import { Counter } from "@/components/counter";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const facts: [string, React.ReactNode][] = [
  ["Based in", "Mumbai, MH"],
  ["Degree", <>B.E. Computer Engg.<br />Univ. of Mumbai</>],
  ["Diploma", <>Computer Engg.<br />MSBTE</>],
  ["Now", <>App dev · learning<br />full-stack &amp; AI/ML</>],
  ["Editor", "VS Code, Cursor"],
  ["Status", "Open to internships"],
];

const stats = [
  { to: 5, suffix: "+", label: "projects shipped" },
  { to: 3, suffix: "", label: "internships & leads" },
  { to: 20, suffix: "+", label: "technologies used" },
  { to: 2027, suffix: "", label: "graduating" },
];

export function About() {
  return (
    <section id="about" className="relative z-1 border-t border-line-soft py-16 lg:py-23">
      <div className="mx-auto max-w-[1080px] px-6">
        <Reveal>
          <div className="mb-13 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface px-5 py-6">
                <b className="block text-[clamp(28px,4.4vw,40px)] font-bold leading-none tracking-[-0.03em] text-lime">
                  <Counter to={s.to} suffix={s.suffix} />
                </b>
                <span className="mt-2.5 block font-mono text-[11.5px] text-muted">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <SectionHeading
          title="How I got here"
          blurb="Three years of a diploma, two internships, a year running app-dev for a student community, and an ongoing move from Android into the web and ML."
        />

        <div className="grid gap-9 lg:grid-cols-[1.35fr_0.9fr] lg:gap-14">
          <Reveal>
            <div className="space-y-4.5 text-body">
              <p className="max-w-[62ch]">
                I started with Android — Kotlin, Jetpack Compose, Firebase — and led app
                development for Google Developer Groups On Campus ACE for a year. Building a
                real-time chat app taught me more about state than any lecture did: typing
                indicators, pagination, delivery status, all of it is just data changing over
                time and a UI trying to keep up.
              </p>
              <p className="max-w-[62ch]">
                That pulled me toward the backend. These days I spend most of my time in Spring
                Boot and Express, designing schemas, thinking about auth, and shipping things
                that run somewhere other than my laptop. Before that I did a stretch of data
                work — EDA, a Random Forest model, a Streamlit dashboard — which still shapes
                how I look at a database.
              </p>
              <p className="max-w-[62ch]">
                I learn by building the thing badly first, then finding out why it&apos;s bad.
                Every project below has a repo behind it, and most of them have a bug I remember
                vividly.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="rounded-md border border-line bg-surface px-4.5 py-1 font-mono text-[13px]">
              {facts.map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-b border-line-soft py-3.5 last:border-b-0"
                >
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
