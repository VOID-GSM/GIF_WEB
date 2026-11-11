// ko(기준)와 다른 언어 메시지의 키 집합·{placeholder} 이름이 같은지 검사한다.
// 번역이 빠지면 런타임에 조용히 한국어로 폴백되므로, 여기서 미리 잡는다.
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const BASE = "ko";
const TARGETS = ["ja"];
const DIRS = ["packages/i18n/messages", "apps/client/messages", "apps/admin/messages"];

const flatten = (obj, prefix = "", out = new Map()) => {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flatten(value, path, out);
    } else {
      out.set(path, String(value));
    }
  }
  return out;
};

// ICU 구문({count, plural, ...})도 고려해 인자 이름만 뽑는다.
const placeholders = (text) =>
  [...text.matchAll(/\{\s*([A-Za-z0-9_]+)\s*[,}]/g)].map((m) => m[1]).sort().join(",");

const load = (dir, locale) =>
  flatten(JSON.parse(readFileSync(resolve(root, dir, `${locale}.json`), "utf8")));

const errors = [];

for (const dir of DIRS) {
  if (!existsSync(resolve(root, dir, `${BASE}.json`))) continue;
  const base = load(dir, BASE);

  for (const locale of TARGETS) {
    const target = load(dir, locale);
    for (const key of base.keys()) {
      if (!target.has(key)) errors.push(`${dir}/${locale}.json: 누락된 키 ${key}`);
      else if (placeholders(base.get(key)) !== placeholders(target.get(key)))
        errors.push(`${dir}/${locale}.json: 플레이스홀더 불일치 ${key}`);
    }
    for (const key of target.keys()) {
      if (!base.has(key)) errors.push(`${dir}/${locale}.json: ${BASE}.json 에 없는 키 ${key}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n메시지 검사 실패: ${errors.length}건`);
  process.exit(1);
}
console.log("메시지 검사 통과");
