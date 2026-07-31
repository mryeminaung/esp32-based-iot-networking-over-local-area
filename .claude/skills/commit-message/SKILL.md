---
name: commit-message
description: Generate meaningful commit messages from staged changes - use when committing code before pushing to a branch. Analyzes git diff to create Conventional Commits format messages with proper type prefixes (feat, fix, refactor, docs, etc.) and clear descriptive subjects.
---

# Commit Message Skill

When the user wants to commit changes, follow these steps:

## Steps

1. **Check git status** to see what files are modified/added/deleted
2. **Review the changes** using `git diff --cached` (for staged) or `git diff` (for unstaged)
3. **Generate a commit message** following the Conventional Commits format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `refactor:` for code refactoring
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `test:` for adding tests
   - `chore:` for maintenance tasks
4. **Stage the changes** with `git add` if not already staged
5. **Commit** with the generated message

## Commit Message Format

```
<type>: <short description>
```

## Examples

- `feat: add dark mode toggle to dashboard`
- `fix: resolve splash screen flickering on page load`
- `refactor: move global components to src/components`
- `docs: update README with setup instructions`

## Tips

- Keep the subject line under 72 characters
- Use imperative mood ("add" not "added")
- Focus on what the change does, not how it does it
- If multiple unrelated changes, suggest splitting into separate commits
