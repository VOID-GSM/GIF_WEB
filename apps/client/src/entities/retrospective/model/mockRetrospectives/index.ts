// TODO(backend): 실제 API 연동 시 이 목 데이터 폴더는 통째로 삭제한다.
// 백엔드가 회고록(카테고리·공개범위·북마크·관련 작업·임시 저장)을 아직 지원하지 않아
// 화면을 먼저 확정하기 위한 임시 데이터다. 파일 하나가 너무 길어지지 않도록 3개로 나눴다.

import type { DetailRetrospectiveResponse } from "../type";
import { MOCK_RETROSPECTIVES_PART1 } from "./part1";
import { MOCK_RETROSPECTIVES_PART2 } from "./part2";
import { MOCK_RETROSPECTIVES_PART3 } from "./part3";

export const MOCK_RETROSPECTIVES: DetailRetrospectiveResponse[] = [
  ...MOCK_RETROSPECTIVES_PART1,
  ...MOCK_RETROSPECTIVES_PART2,
  ...MOCK_RETROSPECTIVES_PART3,
];
