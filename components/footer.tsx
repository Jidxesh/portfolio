export function Footer() {
  return (
    <>
      <div
        aria-hidden
        className="sd-drift relative z-1 select-none whitespace-nowrap px-6 pb-2.5 pt-6 text-center font-big text-[min(11.5vw,196px)] font-extrabold leading-[0.9] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_var(--color-line)] transition-all duration-400 hover:[-webkit-text-stroke:1px_var(--color-lime-dim)]"
      >
        Jidnesh Chavan
      </div>

      <div className="mx-auto max-w-[1080px] px-6">
        <footer className="relative z-1 flex flex-wrap justify-between gap-3.5 border-t border-line-soft pb-10 pt-6 font-mono text-xs text-muted">
          <span>Jidnesh Chavan — Mumbai, India</span>
          <span>Press ⌘K to jump around.</span>
        </footer>
      </div>
    </>
  );
}
