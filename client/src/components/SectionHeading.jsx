export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start';

  return (
    <div className={`flex max-w-3xl flex-col gap-3 ${alignment}`}>
      {eyebrow ? <span className="eyebrow-chip">{eyebrow}</span> : null}
      <h2 className="font-display text-4xl font-bold tracking-[-0.04em] text-slate-950 md:text-5xl">
        {title}
      </h2>
      {description ? <p className="max-w-2xl text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}

export default SectionHeading;
