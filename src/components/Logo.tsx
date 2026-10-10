import zoraLogoImg from "../logos/zora-logo.png";

export default function Logo({
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={zoraLogoImg}
        alt="Zora Studio Logo"
        className="h-auto w-[50px] object-contain"
      />
    </div>
  );
}