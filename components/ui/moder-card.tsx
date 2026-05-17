import { cn } from "@/lib/utils";
import React from "react";

const ModernCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
};

const ModernCardDescription = ({ children }: { children: string }) => {
  return (
    <p className="jetbrains-mono text-muted-foreground text-xs tracking-tight">
      {children}
    </p>
  );
};

const ModernCardTitle = ({
  label,
  children,
}: {
  label?: string;
  children: string;
}) => {
  return (
    <h2 className="jetbrains-mono flex items-center gap-2 text-sm font-medium tracking-tight">
      {children}
      {label && (
        <span className="text-muted-foreground bg-muted/30 rounded-sm px-2 py-0.5 text-[10px]">
          {label}
        </span>
      )}
    </h2>
  );
};

export { ModernCardContainer, ModernCardDescription, ModernCardTitle };
