# Database Design

## Tables

The application uses a single table, `Task`. It's a local-first, single-user
app with no accounts and no relational data, so a single flat table covers
every feature in the brief — no foreign keys or joins are needed.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key. |
| `title` | String | Required. |
| `description` | String? | Optional — not every task needs one. |
| `dueDate` | DateTime | Required. |
| `topic` | String | Free text, not a separate `Topic` table — topics aren't managed as their own entities anywhere in the brief. |
| `status` | String, default `"Todo"` | Constrained to `Todo` / `In-Progress` / `Complete` in application code (API route validation), since Prisma's SQLite connector has no native enum support. |
| `archived` | Boolean, default `false` | Archiving a task flips this flag on the existing row. Archived tasks are never deleted or copied elsewhere — they remain fully queryable, satisfying "cannot be deleted, only archived." |
| `createdAt` / `updatedAt` | DateTime | Managed automatically by Prisma. |

## Overdue is not a column

There is no `overdue` field anywhere in the schema. Overdue status is
computed at read time in `lib/overdue.ts`, from `dueDate`, `status`, and
`archived`, on every API response. A task is overdue only if its due date
has passed, it isn't `Complete`, and it isn't archived. Storing this instead
would let it silently go stale as real time passes — deriving it on every
read means it's always correct.