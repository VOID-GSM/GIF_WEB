---
name: gif-commit
description: "Creates atomic git commits for the GIF project with proper commit types (feat, fix, refactor, style, design, docs, test, chore) and Korean descriptions. Use when asked to commit changes, split work into atomic commits, or organize git history. Triggers on: 'commit', '커밋', 'git commit', 'commit these changes', '변경사항 커밋', '작은 단위로 커밋', '커밋 쪼개줘', 'atomic commits', 'stage and commit'. Does NOT trigger for push, PR creation, or PR review responses."
---

# GIF Commit Skill

## Commit Format
```
{type}: {Korean description}
```
- Description: Korean, under 50 characters, no trailing period
- Co-author line required (see command below)

## Commit Types
| Type | Use case | Example |
|------|----------|---------|
| `feat` | New functionality | `feat: axios instance 설정` |
| `fix` | Bug fix | `fix: 로그인 토큰 갱신 오류 수정` |
| `refactor` | Restructure only | `refactor: 공통 에러 핸들러 분리` |
| `style` | Formatting only | `style: 세미콜론 일관성 적용` |
| `design` | CSS/UI changes | `design: 제출 버튼 hover 스타일 수정` |
| `docs` | Documentation | `docs: API 사용법 주석 추가` |
| `test` | Test code | `test: 로그인 유효성 검사 테스트 추가` |
| `chore` | Config/build | `chore: eslint 규칙 업데이트` |

## Atomic Split Rules
**Split into separate commits when:**
- Two features are independently functional (e.g., axios instance setup is useful without the API call that uses it)
- Changes touch different layers (API service vs. UI component)
- Changes target different pages or routes
- A refactor is mixed with a new feature

**Keep in one commit when:**
- A minimal feature requires its hook and component together to be meaningful

## Workflow
1. `npm run lint` — if fails, report and STOP (no commits)
2. `git diff --name-only` then `git diff` — understand all changes
3. Group files by logical unit
4. For each unit:
   ```bash
   git add {specific files}
   git commit -m "$(cat <<'EOF'
   {type}: {description}

   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```
5. Report all commits with their short hashes

## Before Committing
Always run `npm run lint` first.
- Lint passes → proceed
- Lint fails → report errors, stop, wait for user to fix
