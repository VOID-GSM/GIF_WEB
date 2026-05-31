---
name: gif-feature
description: "GIF project full-feature scaffolding orchestrator. Use when implementing a new feature end-to-end: API integration, pages, components, types, and hooks. Triggers on: '기능 구현', '새 기능 만들어줘', 'feature 추가', 'API 연동하고 페이지 만들어줘', 'scaffold', '전체 구현', '{기능명} 만들어줘', 'implement {feature}', '페이지랑 API 같이 만들어줘'. Also handles re-runs, partial updates, and additions to existing features."
---

# GIF Feature Orchestrator

## Execution Mode
**Sub-agent pipeline** (api-agent → ui-agent, sequential)  
Both agents invoked via `Agent` tool with `model: "opus"`.

---

## Phase 0: Context Check

1. Identify target app: **admin** or **client** (ask if ambiguous)
2. Check existing files related to the feature:
   ```
   apps/{app}/src/entities/{domain}/
   apps/{app}/src/features/{action}/
   apps/{app}/src/views/{page}/
   apps/{app}/src/widgets/{name}/
   apps/{app}/src/app/{route}/
   ```
3. Determine run mode:
   - **Initial**: No related files exist → run all phases
   - **Partial add**: Some files exist → skip existing, add only what's missing
   - **Update**: Feature exists, user wants changes → identify which layer to update (API-only → Phase 2, UI-only → Phase 3)

---

## Phase 1: Feature Plan

Before writing any code, establish:

| Item | Decision |
|------|----------|
| Target app(s) | `admin`, `client`, or both |
| API endpoints | Method + path for each operation (GET/POST/PATCH/DELETE) |
| Response shape | TypeScript interface fields |
| Route path | Where in `app/` the page lives |
| Role guard | Which admin role(s) can access (if admin app) |
| FSD layers needed | Which of entities/features/widgets/views are required |
| Component split | Which parts are Server vs Client |
| Shared vs local | Types/components shared in packages/lib or packages/ui? |

Report the plan to the user as a table before proceeding. Proceed automatically unless the user raises an issue.

---

## Phase 2: API Layer
**Agent:** `api-agent`

**Prompt template:**
> You are the api-agent. Feature: `{feature_name}` in the `{app}` app.
> 
> API endpoints to implement: `{endpoint_list}`
> Response types: `{type_spec}`
> Target files (FSD):
> - Types: `apps/{app}/src/entities/{domain}/model/types.ts`
> - Service: `apps/{app}/src/entities/{domain}/api/{domain}Api.ts`
> - Hooks: `apps/{app}/src/entities/{domain}/api/use{Domain}.ts`
>
> Follow the GIF project API conventions: use `apiClient` from `@repo/lib`, TanStack Query v5 array queryKey, and Sonner for mutation feedback. Create all three files.

Outputs: list of created files → passed to Phase 3.

---

## Phase 3: UI Layer
**Agent:** `ui-agent`

**Prompt template:**
> You are the ui-agent. Feature: `{feature_name}` in the `{app}` app.
>
> API hooks available at: `{hook_file_paths}`
> Route: `apps/{app}/src/app/{route}/`
> Role guard needed: `{yes/no, role_name}`
>
> Create: page.tsx (and layout.tsx if a new route group), plus any sub-components.
> Rules: Server Component by default; add `'use client'` only for interactive parts. Use design tokens from `packages/ui/src/tokens.css`. Import hooks from the paths above.

Outputs: list of created files.

---

## Data Flow
```
Phase 1 (plan) → feature name, endpoints, types, route, role guard
Phase 2 (api-agent) → created file paths
Phase 3 (ui-agent) → receives Phase 2 output + plan context
```

---

## Error Handling
| Error | Action |
|-------|--------|
| Target app unclear | Ask user before Phase 1 |
| API spec unclear | Make reasonable REST assumptions, note them in plan |
| Phase 2 fails | Stop and report; do not run Phase 3 with broken API layer |
| Existing file conflict | Read existing file first, merge or extend rather than overwrite |

---

## Test Scenarios

**Normal — full feature:**
> "프로젝트 목록 조회 페이지 만들어줘 (client 앱)"
Expected: Phase 1 plans route + API, Phase 2 creates service + hook, Phase 3 creates page with the hook.

**Partial — API only:**
> "팀 멤버 조회 API 연동해줘"
Expected: Phase 0 detects UI layer not requested → Phase 2 only.

**Partial — UI only:**
> "이미 만든 API 훅 있는데 페이지만 만들어줘"
Expected: Phase 0 detects API files exist → Phase 3 only.
