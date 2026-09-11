import { Reveal } from "@/components/reveal";

export function SectionHeading({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  return (
    <Reveal>
      <div className="mb-11">
        <h2 className="mb-2 font-big text-[clamp(25px,3.6vw,34px)] font-extrabold tracking-[-0.035em]">
          {title}
        </h2>
        <p className="max-w-[58ch] text-[15.5px] text-muted">{blurb}</p>
      </div>
    </Reveal>
  );
}
