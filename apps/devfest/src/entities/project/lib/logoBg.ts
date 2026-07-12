"use client";

import { useEffect, useState } from "react";

// 로고 이미지 모서리 픽셀을 샘플링해 배경색을 추정한다.
// 투명(요소만 있는 로고)이거나 흰색에 가까우면 null → 기본 배경(회색/흰색)을 사용.
export function detectLogoBg(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onerror = () => resolve(null);
    img.onload = () => {
      try {
        const size = 16;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        const at = (x: number, y: number) => {
          const i = (y * size + x) * 4;
          return [data[i], data[i + 1], data[i + 2], data[i + 3]] as const;
        };
        const corners = [
          at(0, 0),
          at(size - 1, 0),
          at(0, size - 1),
          at(size - 1, size - 1),
        ];
        // 절반 이상이 투명하면 배경 없는 로고로 간주 → 기본색 사용
        const opaque = corners.filter((c) => c[3] > 40);
        if (opaque.length < 3) return resolve(null);
        const avg = opaque
          .reduce(
            (acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]],
            [0, 0, 0],
          )
          .map((v) => Math.round(v / opaque.length));
        // 흰색에 가까우면 기본색 사용
        if (avg[0] > 244 && avg[1] > 244 && avg[2] > 244) return resolve(null);
        resolve(`rgb(${avg[0]}, ${avg[1]}, ${avg[2]})`);
      } catch {
        resolve(null);
      }
    };
  });
}

// 로고 배경색을 반환. override(프로젝트의 logoBg)가 있으면 감지를 건너뛴다.
export function useLogoBg(logo: string, override?: string): string | null {
  const [detected, setDetected] = useState<string | null>(null);

  useEffect(() => {
    if (override) return;
    let alive = true;
    detectLogoBg(logo).then((bg) => {
      if (alive) setDetected(bg);
    });
    return () => {
      alive = false;
    };
  }, [logo, override]);

  return override ?? detected;
}
