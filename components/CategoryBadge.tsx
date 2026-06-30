import { cn, getCategoryColor } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "default";
  className?: string;
}

export default function CategoryBadge({ category, size = "default", className }: CategoryBadgeProps) {
  const colorClass = getCategoryColor(category);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === "sm"
          ? "px-2 py-0.5 text-[10px]"
          : "px-2.5 py-1 text-xs",
        colorClass,
        className
      )}
    >
      {category}
    </span>
  );
}
