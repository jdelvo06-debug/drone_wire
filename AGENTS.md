# AGENTS.md — DroneWire

Guidance for agents working in the DroneWire Counter-UAS intelligence hub.

## Project Mapping

- GitHub/code root: `/Users/jeremydelvaux/projects/drone_wire/app`
- Live URL: `https://dronewire.org/`
- Purpose: Counter-UAS intelligence hub and newsletter pipeline.

## Operating Rules

- Verify repo path, git remote, active branch, and clean/dirty status before editing.
- Treat all pre-existing modified or untracked files as Jeremy's in-progress work. Do not reset, clean, stash, overwrite, stage, or otherwise disturb unrelated changes; keep edits strictly scoped to the requested files.
- Preserve the existing content pipeline and publication/email approval gates.
- Do not commit, push, deploy, publish, send email, change task-board state, or perform any other external mutation without Jeremy's explicit approval.
- Run project-appropriate tests/build/lint before reporting implementation work complete unless the request explicitly limits verification. Report every skipped or blocked gate clearly.

## Agent OS Tasking Boundary

- **Cortana Command Center Kanban is the source of truth for active Agent OS tasking.** Use it for priorities, card status, handoffs, and cross-agent coordination.
- **Bypass Hermes Kanban by default.** Do not create, move, or depend on Hermes Kanban cards unless Jeremy explicitly asks for Hermes Kanban on that task.
- **GitHub remains the source of truth for code workflow only.** Use GitHub for branches, commits, pull requests, CI, releases, and durable code review history. GitHub issues/PRs may reference Command Center Kanban cards, but they do not replace the Command Center board.
- **External task boards are opt-in only.** Do not create, move, or treat external task-board items as source-of-truth tasking unless Jeremy explicitly asks for that tool on that project.
- Before starting non-trivial work, identify the relevant Command Center Kanban card when one exists. If there is no card, proceed from Jeremy's direct instruction and avoid inventing task records unless asked.

## Context Engine (CCE)

CCE is an optional retrieval aid, not a prerequisite for working in this
repository. Detect whether CCE tools are available and whether their index is
usable before relying on them. If CCE is unavailable, stale, incomplete, or
fails, continue with normal repository tools rather than blocking the task.

- Direct reads of current files, repository searches, and git diffs are always allowed. The current working tree is authoritative, especially for scoped edits, uncommitted work, and conflict resolution.
- When available, CCE search, chunk expansion, and related-context tools may help with broad discovery. Confirm relevant results against the current source before editing or making factual claims.
- Cross-session memory reads and writes are optional. Do not require session recall, decision recording, or code-area recording before answering, editing, or completing work.
- Never store secrets, credentials, personal data, or unpublished sensitive material in optional memory systems.
- Follow the active user and system instructions for response format. This repository does not impose a special compressed prose style or diff-only response format.
