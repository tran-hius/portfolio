# Build a reusable AI development skill system for this portfolio project

You are working inside my portfolio project.

Your task is to create a complete, reusable skill system for this project using Antigravity Agent Skills.

## IMPORTANT

Do NOT just explain what you would do.

Actually create the required directories and `SKILL.md` files inside:

```text
.agents/skills/
```

You are allowed to create these files and directories.

Do NOT modify application source code.

Do NOT modify `.env` files.

Do NOT install dependencies.

Do NOT delete existing project files.

Do NOT change the existing application architecture.

---

# Goal

Create exactly these 4 skills:

```text
.agents/
└── skills/
    ├── code-review/
    │   └── SKILL.md
    │
    ├── backend-development/
    │   └── SKILL.md
    │
    ├── testing/
    │   └── SKILL.md
    │
    └── security-review/
        └── SKILL.md
```

Each skill must contain a detailed and practical `SKILL.md`.

These are portfolio/learning projects, NOT enterprise production systems.

Therefore, the skills must follow a pragmatic standard.

Do NOT over-engineer recommendations.

---

# General Skill Requirements

Each `SKILL.md` must contain valid YAML frontmatter.

Use:

```yaml
---
name: <skill-name>
description: <clear description>
---
```

The `description` must clearly explain when the skill should be used.

The skill should be written in Markdown.

Write the skills as instructions for another AI agent, not as documentation for a human developer.

The skills should be detailed enough that another AI agent can consistently follow them without needing the original prompt.

---

# Skill 1 — code-review

Create:

```text
.agents/skills/code-review/SKILL.md
```

This skill should define a senior-developer-style code review process for portfolio projects.

The reviewer should evaluate:

* correctness
* business logic
* architecture
* controller/service/repository separation
* TypeScript quality
* async behavior
* error handling
* validation
* authentication
* authorization
* database usage
* security
* performance
* maintainability
* readability

Define clear severity levels:

* CRITICAL
* HIGH
* MEDIUM
* LOW
* INFO

Important rules:

* Do not invent problems.
* Do not treat personal preferences as bugs.
* Do not over-engineer portfolio projects.
* Do not demand enterprise architecture.
* Do not nitpick formatting.
* Focus on meaningful issues.
* Understand the code before criticizing it.
* Review surrounding modules when necessary.
* Do not modify source code.
* Clearly distinguish confirmed bugs from suggestions.

The reviewer should produce a structured report containing:

1. Summary
2. Critical issues
3. High issues
4. Medium issues
5. Low issues
6. Positive aspects
7. Recommended fix order
8. Remaining risks

The review should be useful to another AI agent that will later fix the problems.

---

# Skill 2 — backend-development

Create:

```text
.agents/skills/backend-development/SKILL.md
```

This skill should guide an AI agent when implementing or modifying backend functionality.

Assume the project may use technologies such as:

* Node.js
* TypeScript
* Express
* NestJS
* MongoDB
* Mongoose
* PostgreSQL
* Prisma
* JWT
* REST APIs

However, do NOT assume every technology exists.

The agent must inspect the existing project before deciding how to implement something.

Cover:

## Architecture

Prefer an understandable architecture such as:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

when appropriate.

Do not introduce unnecessary architectural complexity.

## Implementation principles

The agent should:

* understand existing code before modifying it
* follow existing conventions
* reuse existing utilities
* avoid unnecessary abstractions
* avoid duplicate business logic
* maintain type safety
* validate external input
* handle errors properly
* preserve existing behavior
* avoid unrelated refactoring
* keep changes focused

## API development

Cover:

* route design
* request validation
* response structure
* HTTP status codes
* authentication
* authorization
* pagination where appropriate
* error handling

## Database

Cover:

* safe queries
* schema consistency
* validation
* indexes when justified
* transactions when logically necessary
* avoiding unnecessary database calls

## TypeScript

Cover:

* avoiding unnecessary `any`
* proper types
* nullable values
* safe type narrowing
* return types where useful
* avoiding unsafe assertions

## Security

The implementation should:

* never hardcode secrets
* avoid exposing passwords
* avoid exposing tokens
* validate user-controlled input
* enforce backend authorization
* avoid injection vulnerabilities

## Scope control

The agent should not modify unrelated files unless necessary.

Before finishing, it should run appropriate:

* tests
* type checking
* linting
* build

when available.

It should report:

* files changed
* implementation summary
* tests run
* potential risks
* anything that remains unresolved

---

# Skill 3 — testing

Create:

```text
.agents/skills/testing/SKILL.md
```

This skill should guide an AI testing/verification agent.

The testing agent should NOT blindly modify application code.

Its main responsibility is to verify whether the implementation actually works.

Cover:

## Test strategy

Test in this order when appropriate:

1. type checking
2. linting
3. unit tests
4. integration tests
5. API tests
6. build
7. targeted manual verification

The agent must inspect the project's existing scripts before deciding which commands to run.

Do NOT invent commands that do not exist.

## Test coverage

Consider:

* happy path
* invalid input
* missing input
* authentication failure
* authorization failure
* not found cases
* duplicate data
* database errors
* edge cases
* empty data
* null/undefined values
* unexpected input

## Backend testing

Cover:

* controllers
* services
* repositories where appropriate
* authentication
* authorization
* API responses
* database interactions

## Frontend testing

When applicable, cover:

* loading states
* error states
* form validation
* API failure
* authentication state
* UI behavior

## Verification rules

Never claim that something works without actually verifying it.

Clearly distinguish:

```text
PASS
FAIL
BLOCKED
NOT TESTED
```

When a test fails:

* show the failure
* identify likely cause
* identify affected area
* recommend next action

Do not automatically fix source code unless explicitly instructed.

Do not install dependencies without permission.

Do not modify configuration just to make tests pass.

Do not hide failing tests.

---

# Skill 4 — security-review

Create:

```text
.agents/skills/security-review/SKILL.md
```

This skill should perform a practical security review suitable for a portfolio project.

Focus on real and meaningful vulnerabilities.

Review:

## Authentication

* password hashing
* password comparison
* JWT generation
* JWT verification
* token expiration
* refresh tokens
* logout
* authentication middleware

## Authorization

Check for:

* missing authorization
* IDOR
* ownership bypass
* role bypass
* privilege escalation
* frontend-only authorization

Remember:

Authentication ≠ Authorization.

## Input security

Check:

* SQL injection
* NoSQL injection
* XSS
* command injection
* path traversal
* unsafe file uploads
* malicious input

## Sensitive information

Check for:

* passwords in API responses
* JWT secrets
* database credentials
* API keys
* tokens
* `.env` exposure
* secrets committed to Git
* sensitive information in logs

Do NOT print or expose actual secrets during the review.

If a secret is encountered, refer to it generically.

Example:

```text
A database credential appears to be hardcoded in this file.
```

Do NOT reproduce the credential.

## API security

Check:

* authentication
* authorization
* validation
* rate limiting when realistically relevant
* CORS configuration
* error information leakage
* insecure endpoints

Do not demand enterprise-grade security controls for a small portfolio application.

Only recommend things that make sense for the project's scope.

## Security severity

Use:

* CRITICAL
* HIGH
* MEDIUM
* LOW
* INFO

Only use CRITICAL/HIGH when justified.

## Security output

Return:

1. Security summary
2. Critical vulnerabilities
3. High vulnerabilities
4. Medium vulnerabilities
5. Low vulnerabilities
6. Positive security decisions
7. Recommended remediation order

The security reviewer must be READ-ONLY.

Do NOT modify source code.

---

# Portfolio Project Philosophy

All four skills must follow this philosophy:

The goal is to produce a project that demonstrates good engineering ability.

The project does NOT need to behave like a massive enterprise platform.

Prefer:

```text
simple
+
correct
+
secure enough
+
maintainable
```

over:

```text
complex
+
over-engineered
+
unnecessary abstractions
```

Do not automatically recommend:

* microservices
* Kubernetes
* CQRS
* event sourcing
* service mesh
* distributed tracing
* complicated caching
* advanced observability
* complex permission systems

unless the existing project genuinely requires them.

---

# Skill Quality Requirements

Before finishing, inspect every generated `SKILL.md`.

Verify that:

1. YAML frontmatter is valid.
2. `name` matches the directory.
3. `description` clearly explains the skill.
4. Instructions are not contradictory.
5. The skills are practical.
6. The skills are reusable.
7. The skills are detailed enough for an autonomous AI agent.
8. The skills do not contain unnecessary enterprise requirements.
9. The reviewer and security reviewer are explicitly read-only.
10. The testing agent does not falsely claim successful verification.
11. The backend agent does not perform unrelated refactoring.
12. No source code outside `.agents/skills/` was modified.

After creating the files, inspect the resulting directory structure and confirm all four skills exist.

Then provide a concise summary of:

* files created
* purpose of each skill
* whether any existing files were modified

Do NOT modify application source code.
