import { ReactNode } from "react";

type DashboardSectionProps = {
  children: ReactNode;
  className?: string;
};

export default function DashboardSection({
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <section className={`mt-10 ${className}`}>
      {children}
    </section>
  );
}