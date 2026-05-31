---
name: gif-review
description: "Handles GitHub PR review comments for the GIF project: evaluates each comment individually, applies accepted changes as atomic commits with lint validation, and posts replies with accept/reject decision, reasoning, and code snippets. Use when asked to handle PR comments, reflect review feedback, or respond to reviewer suggestions. Triggers on: 'PR 코멘트 반영', 'review 반영', '코멘트 처리', 'PR 리뷰 반영', 'respond to review', 'handle PR feedback', '리뷰 반영해줘', '코멘트 답글 달아줘', '코멘트 반영해줘', 'review comment 반영'. Does NOT trigger for creating PRs, committing code, or pushing."
---

# GIF PR Review Response Skill

## Fetch Comments

```bash
# Get repo owner and name
gh repo view --json owner,name

# Get current PR number
gh pr list --head $(git branch --show-current) --json number,title

# Fetch all inline review comments
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments

# Fetch PR-level comments and review summaries
gh pr view {pr_number} --json comments,reviews,url
```

## Evaluation Criteria

**Accept the comment when it:**
- Fixes incorrect behavior or logic
- Improves adherence to GIF project conventions:
  - **TanStack Query v5**: array `queryKey`, `useQuery`/`useMutation` only
  - **Axios**: always use the configured Axios instance, never bare `axios.get()`
  - **Server Components**: default; add `'use client'` only for state, events, or hooks
  - **Role-based access**: Middleware and Layout guards per teacher role type
- Improves TypeScript type safety (missing types, incorrect type assertions)
- Adds missing validation at system boundaries (user input, external API responses)

**Reject the comment when it:**
- Contradicts the PR's intentional design decision
- Introduces abstraction not needed for current scope (YAGNI)
- Is a subjective style preference not in the project conventions
- Is out of scope for this PR

## Reply Templates

### Accepted
```
반영했습니다.

{1-2 sentence reason for acceptance}

반영 커밋: `{short_hash}` — {commit_message}

```{language}
{relevant modified lines — keep concise}
```
```

### Rejected
```
미반영했습니다.

{1-2 sentence reason for rejection}
```

## Apply Workflow
1. Make the code change
2. `npm run lint` — fix any lint errors in the same change
3. `git add {changed files}`
4. `git commit -m "fix: {brief description of the review fix}"`
5. `git log -1 --format="%h"` — get short hash for reply
6. After ALL comments are processed: `git push origin {branch}` (push once)
7. Post reply for each comment:
   ```bash
   gh api repos/{owner}/{repo}/pulls/comments/{comment_id}/replies \
     -f body="{reply_text}"
   ```

## Processing Order
Process comments chronologically. Evaluate and prepare all changes first, then commit, then push once, then post all replies.
