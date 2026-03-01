import { Link } from "react-router-dom";

export default function SectionHeader({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
        {subtitle ? (
          <p className="mt-2 text-base-content/70">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {secondaryCta ? (
          <Link to={secondaryCta.to} className="btn btn-outline rounded-xl">
            {secondaryCta.label}
          </Link>
        ) : null}
        {primaryCta ? (
          <Link to={primaryCta.to} className="btn btn-primary rounded-xl">
            {primaryCta.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}