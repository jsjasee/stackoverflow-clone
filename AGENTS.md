# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains the Next.js App Router pages, layouts, and API routes such as `src/app/api/vote/route.ts`.
- `components/` holds shared UI and feature components; `components/ui/` contains shadcn-based primitives and `components/magicui/` contains animated UI helpers.
- `src/models/` contains Appwrite client/server configuration and collection access logic. Keep data-access code here instead of inside page components.
- `src/store/` stores Zustand state, `src/utils/` and `lib/` hold shared helpers, and `public/` contains static assets.

## Build, Test, and Development Commands
- `npm run dev` starts the local Next.js dev server at `http://localhost:3000`.
- `npm run build` creates the production build and catches type/runtime integration issues.
- `npm run start` serves the built app locally after a successful build.
- `npm run lint` runs ESLint with the Next.js + TypeScript configuration.

## Coding Style & Naming Conventions
- Use TypeScript with `strict` mode expectations; prefer explicit types for props, Appwrite rows, and utility function inputs.
- Follow the existing style in the file you edit: most components use double quotes and semicolons, with Tailwind classes inline in JSX.
- Use PascalCase for React components (`QuestionForm.tsx`), camelCase for variables/functions, and descriptive route segment names like `[quesId]`.
- Prefer the `@/*` import alias over long relative paths when importing shared code.

## Testing Guidelines
- There is no automated test suite configured yet. Before opening a PR, run `npm run lint` and `npm run build`.
- Manually smoke-test affected flows in the browser, especially auth, question creation/editing, answers, votes, and user profile routes.
- If you add tests later, keep them close to the feature or under `tests/` and use `*.test.ts` or `*.test.tsx` naming.

## Commit & Pull Request Guidelines
- Keep commits short, imperative, and focused, matching the current history (for example: `add completed answer route code`).
- Prefer one logical change per commit; use an optional conventional prefix when helpful, such as `feat:` or `fix:`.
- PRs should include a clear summary, linked issue/task, validation steps, and screenshots or short recordings for UI changes.

## Security & Configuration Tips
- Do not commit secrets. Keep Appwrite credentials in local environment files and server-only code under `src/models/server/`.
- Validate changes that touch `src/app/api/` or Appwrite model files carefully; these affect persisted data and auth-sensitive flows.
