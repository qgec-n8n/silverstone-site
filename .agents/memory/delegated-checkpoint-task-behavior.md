---
name: Delegated checkpoint / commit tasks
description: How the platform handles a project task whose only job is to "commit/checkpoint" the main agent's work.
---

# Delegated checkpoint / commit tasks

When the main agent delegates a "create checkpoint / commit my work" step to a project task (because direct `git commit`/`git tag` is forbidden to the main agent), the platform has ALREADY auto-committed the main agent's entire working tree at the moment the task is proposed — the main-agent loop ends and a checkpoint commit is created automatically.

**Consequence:** the delegated checkpoint task starts from a CLEAN working tree with the full deliverable already committed in HEAD. There is usually nothing new to stage.

**How to apply:**
- Don't go looking for uncommitted deliverable files in the task-agent environment — verify with `git status` / `git log`; the work is already committed.
- The named checkpoint is produced by the task's own completion commit, whose message comes from `.local/.commit_message`. Write the exact desired name as the first line, then `mark_task_complete`.
- Don't run `git commit` manually and don't fabricate file changes just to "force" a commit. Re-validate the gates, record any genuine durable lesson (that itself becomes the real change the named commit captures), and complete.

**Why:** avoids the confusion of hunting for "missing" uncommitted work and prevents redundant or forbidden manual git operations inside the delegated task.
