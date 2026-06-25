# GIF (GSM Idea Festival)

GIF는 **광주소프트웨어마이스터고등학교 아이디어 페스티벌**의 전체 운영 과정을 하나의 플랫폼에서 효율적으로 관리하기 위한 서비스입니다. 기존의 수기 방식에서 벗어나, 학생(Client)의 팀 프로젝트 관리·자료 제출부터 관리자(Admin)의 양식 생성·제출 현황 추적·평가·점수 집계까지 모든 워크플로우를 통합합니다.

## 구성

이 저장소는 Turborepo 기반 모노레포로 구성되어 있습니다.

| 워크스페이스 | 설명 |
|---|---|
| `apps/client` | 학생용 웹 서비스 (팀 프로젝트 관리, 자료 제출) |
| `apps/admin` | 교사용 관리 웹 서비스 (양식 생성, 제출 현황, 평가, 점수 집계) |
| `packages/*` | 공통 컴포넌트(ui), 공통 설정, 유틸리티 등 공유 패키지 |

## 기술 스택

- **Framework & Core:** Next.js 15 (App Router), React 19, TypeScript 5
- **Monorepo:** Turborepo 2
- **Data Fetching & State:** TanStack Query 5, Axios
- **Styling & UI:** Tailwind CSS 4, Sonner
- **Package Manager:** npm

## 시작하기

### 요구 사항

- Node.js 18 이상
- npm 10.9.2 (`packageManager` 명시 버전)

### 설치

```bash
git clone https://github.com/VOID-GSM/GIF_WAB.git
cd GIF_WAB
npm install
```

### 개발 서버 실행

```bash
# 전체 모노레포 실행
npm run dev

# Admin 앱만 실행
npm run dev -w apps/admin

# Client 앱만 실행
npm run dev -w apps/client
```

### 빌드 & 린트

```bash
# 전체 프로젝트 빌드
npm run build

# 코드 린트 검사
npm run lint
```

## 버그 제보 및 이슈

버그를 발견하거나 기능 제안이 있다면 GitHub 이슈 트래커를 이용해 주세요.

- **이슈 트래커:** https://github.com/VOID-GSM/GIF_WAB/issues

이슈를 등록할 때는 다음 내용을 포함해 주세요.

- 재현 방법 (단계별)
- 기대한 동작과 실제 동작
- 영향받는 앱 (`apps/client` 또는 `apps/admin`)
- 환경 정보 (브라우저, OS 등)
