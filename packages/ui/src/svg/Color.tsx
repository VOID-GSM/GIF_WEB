import React from "react";

export default function Color(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="url(#rainbow)" />
      <defs>
        <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea4b04" />
          <stop offset="17%" stopColor="#ffa425" />
          <stop offset="34%" stopColor="#f8e800" />
          <stop offset="51%" stopColor="#7ddc1e" />
          <stop offset="68%" stopColor="#6db8ff" />
          <stop offset="85%" stopColor="#a991ff" />
          <stop offset="100%" stopColor="#ea4b04" />
        </linearGradient>
      </defs>
    </svg>
  );
}
