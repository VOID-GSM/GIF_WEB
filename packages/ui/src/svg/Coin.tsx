import React, { useId } from "react";

// 역량검사 코인 아이콘. 크기는 width/height 로 조절한다 (기본 28px).
export default function Coin(props: React.SVGProps<SVGSVGElement>) {
  // 한 화면에 여러 개를 그려도 그라데이션 id 가 겹치지 않도록 인스턴스마다 고유 id 를 쓴다.
  const gradientId = `coin-gradient-${useId()}`;

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M27 14C27 21.1797 21.1797 27 14 27C6.8203 27 1 21.1797 1 14C1 6.8203 6.8203 1 14 1C21.1797 1 27 6.8203 27 14Z"
        fill={`url(#${gradientId})`}
        stroke="#FFA800"
        strokeWidth="2"
      />
      <path
        d="M14.2551 5.51855C18.2311 5.51855 21.1058 7.75855 21.9831 10.6146H18.2498C17.6151 9.49455 16.1778 8.63589 14.3298 8.63589C11.5671 8.63589 9.51379 10.6706 9.51379 13.5079C9.51379 16.3639 11.5671 18.4359 14.3298 18.4359C16.7005 18.4359 18.3431 16.9799 18.6978 15.4866H14.0498V12.6119H22.3191V13.5079C22.3191 18.1186 18.8658 21.4972 14.2551 21.4972C9.56979 21.4972 6.11646 18.1186 6.11646 13.5079C6.11646 8.89722 9.56979 5.51855 14.2551 5.51855Z"
        fill="#FFA800"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="6"
          y1="0"
          x2="23.5"
          y2="29"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF695" />
          <stop offset="1" stopColor="#FFDB00" />
        </linearGradient>
      </defs>
    </svg>
  );
}
