<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Project-Local Skill Policy

- Treat all installed, generated, copied, or downloaded skills as project-scoped resources.
- Store project skills only inside this repository. Prefer `<project-root>/.agents/skills/` when a tool does not require a different repository-local path.
- Never write or install skills in user-level or global locations, including `%USERPROFILE%\.codex\skills`, `%USERPROFILE%\.agents\skills`, `$CODEX_HOME/skills`, or any other path outside the current repository.
- Run skill discovery and management commands from the project root. Do not use global skill flags or global-only resolution modes such as `--global` or `--global-only`.
- Before running a command that may persist a skill, verify that its resolved destination is inside the current repository. If the destination cannot be verified or the tool supports only user/global storage, stop and ask the user instead of running it.
- Keep skills isolated per project; do not share one writable skill installation between projects.

## Naming Conventions

- Use kebab-case for all project-authored filenames. Examples: `theme-toggle.tsx`, `user-profile.test.tsx`, and `use-user-settings.ts`.
- Use camelCase for variable names and regular function names. Examples: `selectedTheme` and `loadUserSettings`.
- Use PascalCase for constructor functions and class names. Examples: `UserService` and `AppError`.
- Keep React component names in PascalCase so JSX recognizes them as components.
- Preserve filenames and identifiers whose spelling is required by a framework, tool, generated-code contract, or established platform convention, such as `package.json`, `README.md`, `AGENTS.md`, TanStack Router's `__root.tsx` and `Route`, and generated `routeTree.gen.ts`.

## TDD and Testing Policy

- Use test-driven development for behavior changes: write a meaningful failing test first, implement the smallest change that makes it pass, and then refactor while keeping the test suite green.
- Use Vitest as the test runner.
- Test every extracted React component and custom hook by default. Run these tests in a virtual DOM environment and exercise behavior through rendered UI or hook consumers rather than testing implementation details.
- Keep static imports as the default in both production code and tests. Minimize dynamic `import()` usage.
- In tests, dynamic `import()` is allowed only when testing pure functions or utility functions. Do not use it in component, hook, or integration tests.
- Avoid Node.js `fs` APIs whenever a test can use in-memory data, dependency injection, fixtures imported as modules, or public application interfaces instead.
- Prefer a small number of behavior-focused tests over broad coverage for its own sake. Coverage percentage is not a delivery goal.
- Do not force a test when isolating the subject would require excessive mocking. In that case, keep the design testable where practical and document the reason the test was omitted.
- Mock only true external boundaries, nondeterministic dependencies, or prohibitively expensive collaborators. Prefer real internal modules and observable user-facing outcomes.
