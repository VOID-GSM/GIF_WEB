import React from "react";

export default function Crown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 8L7.5 11L12 4L16.5 11L21 8L19.5 18H4.5L3 8Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 18H19.5V20H4.5V18Z"
        fill="currentColor"
      />
    </svg>
  );
}
