# Implementation Plan: Agent-Agnostic Codebase Knowledge Layer

## Goal

Set up a repo-committed, version-controlled knowledge structure (`.ai/` directory + `AGENTS.md`) that:
- Works with **any** AI agent/IDE (Antigravity, Cursor, Copilot, Cline, Aider, etc.)
- Is **shared** across team members via git
- **Eliminates** redundant full-project scans, saving 60-80% of token costs
- Stays **current** through normal git workflow (PRs, commits)

> [!IMPORTANT]
> This plan is **project-agnostic**. It does not hardcode any file paths, tech stack details, or schema definitions. The agent executing this must dynamically scan the target project to populate all content.

---

## Phase 1: Analyze the Project

Before creating any files, the agent must understand the project. This phase is **read-only**.

### Step 1.1 — Identify Project Fundamentals

Scan and collect:

- [ ] **Tech stack**: Framework, language, ORM, database, queue system, CSS framework, UI library
- [ ] **Package manager**: npm, yarn, pnpm, pip, cargo, etc.
- [ ] **Project type**: Monolith, monorepo, microservices, library, CLI tool
- [ ] **Entry points**: Where the app starts (e.g., `src/app/`, `main.ts`, `index.py`)
- [ ] **Build/run commands**: How to dev, build, test, deploy
- [ ] **Environment**: Docker, local, cloud — and any setup steps

Sources to check:
```
- package.json / pyproject.toml / Cargo.toml / go.mod (dependencies + scripts)
- README.md (project description, setup instructions)
- Dockerfile / docker-compose.yml (infrastructure)
- .env.example (environment variables)
- Any existing docs/ directory
```

### Step 1.2 — Map the Architecture

Scan and collect:

- [ ] **Directory structure**: Top-level folders and their purposes
- [ ] **Key modules/subsystems**: Identify 3-8 major functional areas (e.g., auth, API, workers, UI, database)
- [ ] **Data flow**: How data moves through the system (request → processing → storage → response)
- [ ] **External dependencies**: Third-party APIs, services, databases
- [ ] **Key files per module**: The 2-5 most important files in each subsystem

### Step 1.3 — Extract Patterns and Conventions

Scan and collect:

- [ ] **File naming conventions**: kebab-case, camelCase, PascalCase
- [ ] **Code organization patterns**: Where do new components/services/routes go?
- [ ] **Common patterns**: How are API routes structured? How is auth enforced? How is state managed?
- [ ] **Do/Don't rules**: Any constraints, gotchas, or anti-patterns specific to this project
- [ ] **Database schema**: If an ORM is used, identify the schema file and key models/relationships

### Step 1.4 — Check for Existing Context Files

- [ ] Check for existing `.gemini/rules/`, `.cursorrules`, `.github/copilot-instructions.md`, `AGENTS.md`
- [ ] Check for existing `ARCHITECTURE.md`, `CONTRIBUTING.md`, `docs/` directory
- [ ] **Do not duplicate** — if good docs exist, reference them rather than copying content

---

## Phase 2: Create the `.ai/` Knowledge Structure

### Step 2.1 — Create `AGENTS.md` (repo root)

This is the **front door** for any AI agent. It must be concise and actionable.

```
Location: <project-root>/AGENTS.md
```

Template:

```markdown
# AGENTS.md

> This file provides context for AI coding agents working on this project.
> Read this file first before making any changes.

## Project Overview
<!-- 2-3 sentences: What does this project do? Who is it for? -->

## Tech Stack
<!-- Bullet list of core technologies -->

## Before You Start
1. Read `.ai/CONTEXT.md` for project constraints and environment setup
2. Read `.ai/ARCHITECTURE.md` for system design and data flows
3. Read `.ai/PATTERNS.md` for code conventions and rules
4. For specific subsystems, read the relevant file in `.ai/modules/`

## Critical Rules
<!-- 5-10 most important rules that apply to ALL changes. Examples: -->
<!-- - Always use X for Y -->
<!-- - Never do Z -->
<!-- - All mutations must include audit logging -->

## File Map
<!-- Table mapping feature areas to key file paths -->
| Area | Key Files |
|---|---|
| ... | ... |

## Commands
| Action | Command |
|---|---|
| Dev server | `...` |
| Build | `...` |
| Test | `...` |
| Lint | `...` |
| Database migrate | `...` |
```

> [!TIP]
> Keep `AGENTS.md` under 100 lines. It's a summary + pointer to detailed docs, not the docs themselves.

### Step 2.2 — Create `.ai/CONTEXT.md`

Deep project context that doesn't fit in `AGENTS.md`.

```
Location: <project-root>/.ai/CONTEXT.md
```

Template:

```markdown
# Project Context

## Environment
<!-- OS requirements, hardware constraints, Docker setup, etc. -->

## Dependencies & Infrastructure
<!-- Database, cache, queue, external APIs, etc. -->
<!-- Include connection details pattern (not secrets) -->

## Development Setup
<!-- Step-by-step: clone → install → configure → run -->

## Deployment
<!-- How the app is deployed. CI/CD pipeline if any. -->

## Constraints
<!-- Memory limits, batch size limits, rate limits, etc. -->
<!-- Things an agent MUST know to avoid breaking the system -->

## Environment Variables
<!-- List all env vars with descriptions (not values) -->
| Variable | Description | Required |
|---|---|---|
| ... | ... | ... |
```

### Step 2.3 — Create `.ai/ARCHITECTURE.md`

System design and data flows.

```
Location: <project-root>/.ai/ARCHITECTURE.md
```

Template:

```markdown
# Architecture

## System Diagram
<!-- Mermaid diagram showing major components and their relationships -->

## Component Overview
<!-- For each major component: what it does, key files, how it connects to others -->

### [Component Name]
- **Purpose**: ...
- **Key Files**: ...
- **Depends On**: ...
- **Depended By**: ...

## Data Flows
<!-- Describe 2-4 critical data flows through the system -->
<!-- Example: "User uploads CSV → Queue → Worker processes → DB upsert → HTML generated → Staged → Published" -->

## Key Functions & Entry Points
| Function/Class | File | Purpose |
|---|---|---|
| ... | ... | ... |

## Database Schema Summary
<!-- Key models and their relationships. Reference the schema file. -->
<!-- Don't copy the full schema — summarize the relationships -->
```

### Step 2.4 — Create `.ai/PATTERNS.md`

Code conventions and patterns to follow.

```
Location: <project-root>/.ai/PATTERNS.md
```

Template:

```markdown
# Code Patterns & Conventions

## File Organization
<!-- Where to put new files for: components, services, routes, tests, utils -->

## Naming Conventions
<!-- Files, variables, functions, components, database columns -->

## Common Patterns

### [Pattern Name, e.g., "Adding a New API Route"]
<!-- Step-by-step with code example -->

### [Pattern Name, e.g., "Creating a New Database Model"]
<!-- Step-by-step with code example -->

### [Pattern Name, e.g., "Adding Permission Checks"]
<!-- Step-by-step with code example -->

## Anti-Patterns (Don't Do This)
<!-- Common mistakes to avoid, with explanation of why -->

## Error Handling
<!-- How errors are handled in this project -->

## Testing Conventions
<!-- How to write tests, what to test, where tests go -->
```

### Step 2.5 — Create `.ai/modules/` (per-subsystem docs)

One file per major subsystem identified in Phase 1, Step 1.2.

```
Location: <project-root>/.ai/modules/<subsystem-name>.md
```

Template for each module:

```markdown
# [Subsystem Name]

## Purpose
<!-- What this subsystem does, in 2-3 sentences -->

## Key Files
| File | Purpose |
|---|---|
| ... | ... |

## How It Works
<!-- Technical explanation of the subsystem's internals -->
<!-- Include sequence diagrams (mermaid) for complex flows -->

## Configuration
<!-- Any config files, env vars, or settings that control this subsystem -->

## Common Tasks
<!-- How to: add X, modify Y, debug Z within this subsystem -->

## Gotchas
<!-- Non-obvious behaviors, known issues, edge cases -->
```

> [!IMPORTANT]
> Only create module files for subsystems that are **complex enough to warrant their own doc**. A simple utility folder doesn't need one. Aim for 3-8 module files depending on project size.

---

## Phase 3: Bridge to Tool-Specific Configs

If the project uses specific AI tools, create thin bridge files that reference `.ai/`.

### Step 3.1 — Antigravity (`.gemini/rules/`)

If `.gemini/rules/` files already exist:
- [ ] Review each rule file
- [ ] Remove content that now lives in `.ai/` to avoid duplication
- [ ] Keep only Antigravity-specific instructions (e.g., docker trigger rules, workflow references)
- [ ] Add a reference comment at the top of each rule: `<!-- See .ai/ for full project context -->`

If they don't exist:
- [ ] Create a single `.gemini/rules/agent-context.md` with:

```markdown
# Agent Context

Before starting any task, read the following files in order:
1. `AGENTS.md` (project root)
2. `.ai/CONTEXT.md`
3. `.ai/ARCHITECTURE.md`
4. `.ai/PATTERNS.md`
5. Relevant `.ai/modules/<name>.md` for the subsystem you're modifying
```

### Step 3.2 — Cursor (`.cursorrules`)

- [ ] If using Cursor, create `.cursorrules` at project root:

```markdown
Read AGENTS.md and the .ai/ directory for project context before making changes.
<!-- Copy the Critical Rules section from AGENTS.md here -->
```

### Step 3.3 — GitHub Copilot (`.github/copilot-instructions.md`)

- [ ] If using Copilot, create `.github/copilot-instructions.md`:

```markdown
Read AGENTS.md and the .ai/ directory for project context.
<!-- Copy the Critical Rules section from AGENTS.md here -->
```

---

## Phase 4: Validate

### Step 4.1 — Verify Completeness

- [ ] `AGENTS.md` exists at project root with filled-in content (not template placeholders)
- [ ] `.ai/CONTEXT.md` has environment, constraints, and setup instructions
- [ ] `.ai/ARCHITECTURE.md` has system diagram, component overview, and key functions table
- [ ] `.ai/PATTERNS.md` has at least 3 common patterns documented
- [ ] `.ai/modules/` has one file per major subsystem (minimum 3)
- [ ] No placeholder text remains (all `<!-- ... -->` comments replaced with actual content)
- [ ] No hardcoded secrets or credentials in any file

### Step 4.2 — Verify No Duplication

- [ ] Content is not duplicated between `AGENTS.md` and `.ai/` files
- [ ] Content is not duplicated between `.ai/` and existing docs (e.g., `README.md`, `docs/`)
- [ ] Tool-specific files (`.gemini/rules/`, `.cursorrules`) reference `.ai/` rather than duplicating

### Step 4.3 — Test with a Fresh Conversation

- [ ] Start a new agent conversation
- [ ] Ask a question about a specific subsystem (e.g., "How does the import pipeline work?")
- [ ] Verify the agent reads `.ai/modules/` instead of scanning source files
- [ ] Ask to make a change — verify the agent follows patterns from `.ai/PATTERNS.md`

---

## Phase 5: Ongoing Maintenance

### When to Update `.ai/` Files

| Trigger | Action |
|---|---|
| New subsystem/module added | Create `.ai/modules/<name>.md` |
| Major refactor | Update `.ai/ARCHITECTURE.md` + affected module files |
| New patterns established | Add to `.ai/PATTERNS.md` |
| New critical rule | Add to `AGENTS.md` Critical Rules section |
| Dependencies change significantly | Update `.ai/CONTEXT.md` |
| Files/folders restructured | Update `AGENTS.md` File Map |

### How to Keep It Current

**Option A — Manual (simplest)**:
After significant changes, tell the agent: *"Update the relevant `.ai/` docs to reflect what we just changed"*

**Option B — PR checklist**:
Add to your PR template:
```markdown
## AI Context Checklist
- [ ] Updated `.ai/` docs if architecture/patterns changed
- [ ] Updated `AGENTS.md` file map if files were added/moved
```

**Option C — CI check (advanced)**:
Add a CI step that warns if files in key directories changed but `.ai/` files didn't:
```yaml
# Example: GitHub Actions
- name: Check .ai/ docs freshness
  run: |
    # If src/ changed but .ai/ didn't, add a PR comment reminder
    if git diff --name-only origin/main | grep -q "^src/" && \
       ! git diff --name-only origin/main | grep -q "^\.ai/"; then
      echo "::warning::Source code changed but .ai/ docs were not updated"
    fi
```

---

## Execution Instructions

> [!CAUTION]
> When executing this plan on another machine, **do not copy content from a different version of the project**. The agent must scan the **current** codebase on that machine and generate all content dynamically.


