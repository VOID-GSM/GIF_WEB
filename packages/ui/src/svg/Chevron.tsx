type ChevronDirection = "up" | "down" | "left" | "right";

const rotateMap: Record<ChevronDirection, string> = {
  down: "rotate(0deg)",
  up: "rotate(180deg)",
  right: "rotate(-90deg)",
  left: "rotate(90deg)",
};

interface ChevronProps {
  direction?: ChevronDirection;
}

export default function Chevron({ direction = "down" }: ChevronProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: rotateMap[direction] }}
    >
      <path
        d="M18 6L10 14L2 6"
        stroke="var(--color-gray-600)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
