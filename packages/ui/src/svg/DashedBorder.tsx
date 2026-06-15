interface DashedBorderProps {
  strokeWidth?: number;
  dashArray?: string;
  rx?: number;
}

export default function DashedBorder({
  strokeWidth = 2,
  dashArray = "4 4",
  rx = 8,
}: DashedBorderProps) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="100%"
        height="100%"
        fill="none"
        rx={rx}
        ry={rx}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeLinecap="butt"
      />
    </svg>
  );
}