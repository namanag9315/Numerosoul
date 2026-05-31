import { SectionDivider } from "@/components/effects/SectionDivider";

export function Divider({
  className = "",
  variant = "gold",
}: {
  className?: string;
  variant?: "gold" | "cream";
}) {
  return <SectionDivider className={className} variant={variant} />;
}
