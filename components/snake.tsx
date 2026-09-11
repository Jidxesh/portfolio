"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SIZE = 17;
const TICK = 120;
const START = [
  { x: 8, y: 9 },
  { x: 8, y: 10 },
];

type Cell = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const VECTORS: Record<Dir, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const randomFood = (snake: Cell[]): Cell => {
  let spot: Cell;
  do {
    spot = {
      x: Math.floor(Math.random() * SIZE),
      y: Math.floor(Math.random() * SIZE),
    };
  } while (snake.some((s) => s.x === spot.x && s.y === spot.y));
  return spot;
};

export function Snake() {
  const [snake, setSnake] = useState<Cell[]>(START);
  const [food, setFood] = useState<Cell>({ x: 12, y: 5 });
  const [dir, setDir] = useState<Dir>("up");
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  // queue moves so two fast presses in one tick can't fold the snake onto itself
  const queue = useRef<Dir[]>([]);
  const dirRef = useRef<Dir>("up");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("snake-best");
      if (stored) setBest(Number(stored) || 0);
    } catch {
      /* storage unavailable — scores just won't persist */
    }
  }, []);

  const reset = useCallback(() => {
    setSnake(START);
    setFood(randomFood(START));
    setDir("up");
    dirRef.current = "up";
    queue.current = [];
    setScore(0);
    setOver(false);
    setRunning(true);
  }, []);

  const turn = useCallback((next: Dir) => {
    const last = queue.current.at(-1) ?? dirRef.current;
    if (next === last || next === OPPOSITE[last]) return;
    queue.current.push(next);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
        W: "up", S: "down", A: "left", D: "right",
      };
      const next = map[e.key];
      if (!next) return;
      if (!running) return;
      e.preventDefault(); // only while playing, so the page still scrolls otherwise
      turn(next);
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [running, turn]);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSnake((prev) => {
        const nextDir = queue.current.shift() ?? dirRef.current;
        dirRef.current = nextDir;
        setDir(nextDir);

        const v = VECTORS[nextDir];
        const head = { x: prev[0].x + v.x, y: prev[0].y + v.y };

        const hitWall =
          head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE;
        const hitSelf = prev.some((s) => s.x === head.x && s.y === head.y);

        if (hitWall || hitSelf) {
          setRunning(false);
          setOver(true);
          setScore((s) => {
            setBest((b) => {
              const nextBest = Math.max(b, s);
              try {
                window.localStorage.setItem("snake-best", String(nextBest));
              } catch {
                /* ignore */
              }
              return nextBest;
            });
            return s;
          });
          return prev;
        }

        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...prev];
        if (ate) {
          setScore((s) => s + 1);
          setFood(randomFood(next));
        } else {
          next.pop();
        }
        return next;
      });
    }, TICK);

    return () => clearInterval(id);
  }, [running, food]);

  const cells = Array.from({ length: SIZE * SIZE }, (_, i) => ({
    x: i % SIZE,
    y: Math.floor(i / SIZE),
  }));

  return (
    <section id="play" className="relative z-1 border-t border-line-soft py-16 lg:py-23">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mb-11">
          <h2 className="mb-2 font-big text-[clamp(25px,3.6vw,34px)] font-extrabold tracking-[-0.035em]">
            Break room
          </h2>
          <p className="max-w-[58ch] text-[15.5px] text-muted">
            You&apos;ve scrolled this far. Arrow keys or WASD — or the pad below
            on a phone.
          </p>
        </div>

        <div className="flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:gap-14">
          <div className="relative">
            <div
              className="grid gap-px rounded-md border border-line bg-line p-px"
              style={{
                gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
                width: "min(400px, 86vw)",
              }}
            >
              {cells.map((c) => {
                const isHead = snake[0]?.x === c.x && snake[0]?.y === c.y;
                const isBody =
                  !isHead && snake.some((s) => s.x === c.x && s.y === c.y);
                const isFood = food.x === c.x && food.y === c.y;
                return (
                  <div
                    key={`${c.x}-${c.y}`}
                    className={cn(
                      "aspect-square bg-surface transition-colors duration-75",
                      isBody && "bg-lime/70",
                      isHead && "bg-lime",
                      isFood && "bg-cyan"
                    )}
                  />
                );
              })}
            </div>

            {!running && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-md bg-ink/85 backdrop-blur-[2px]">
                <span className="font-mono text-[12px] text-muted">
                  {over ? `game over — ${score} point${score === 1 ? "" : "s"}` : "snake"}
                </span>
                <button
                  onClick={reset}
                  className="rounded-sm border border-lime bg-lime px-5 py-2.5 font-mono text-[13px] text-ink transition-colors hover:bg-lime-hover"
                >
                  {over ? "Play again" : "Start"}
                </button>
              </div>
            )}
          </div>

          <div className="w-full max-w-[280px]">
            <dl className="mb-6 rounded-md border border-line bg-surface px-4 py-1 font-mono text-[13px]">
              <div className="flex justify-between border-b border-line-soft py-3">
                <dt className="text-muted">score</dt>
                <dd className="text-lime">{score}</dd>
              </div>
              <div className="flex justify-between border-b border-line-soft py-3">
                <dt className="text-muted">best</dt>
                <dd>{best}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-muted">heading</dt>
                <dd>{dir}</dd>
              </div>
            </dl>

            {/* touch pad */}
            <div className="grid w-[168px] grid-cols-3 gap-2 md:hidden">
              <span />
              <PadButton label="↑" onPress={() => turn("up")} />
              <span />
              <PadButton label="←" onPress={() => turn("left")} />
              <PadButton label="↓" onPress={() => turn("down")} />
              <PadButton label="→" onPress={() => turn("right")} />
            </div>

            <p className="mt-5 max-w-[34ch] font-mono text-[11px] text-muted">
              built with React state and one interval — no canvas, no game loop
              library
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PadButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="aspect-square rounded-sm border border-line bg-surface font-mono text-lime transition-colors active:bg-surface-2"
      aria-label={label}
    >
      {label}
    </button>
  );
}
