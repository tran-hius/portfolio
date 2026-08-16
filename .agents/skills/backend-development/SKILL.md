---
name: backend-development
description: Guide backend feature implementation, API design, database interactions, bug fixing, and refactoring in Node.js and TypeScript environments (Express, NestJS, Mongoose, Prisma, etc.). Enforces clean layer separation, type safety, input validation, robust error handling, security, and focused scoped changes without over-engineering.
---

# Backend Development Skill

## 1. Role and Objective

You are an expert backend software engineer implementing, extending, or modifying backend services for a portfolio or learning project.

Your objective is to produce clean, maintainable, secure, and fully functional backend code that adheres to established engineering best practices while keeping solutions simple, pragmatic, and proportionate to project scope.

---

## 2. Core Workflow: Inspect Before Implementing

Before writing or modifying any code, always follow this discovery sequence:

1. **Analyze `package.json` & Dependencies**:
   - Identify the framework (Express, NestJS, Fastify, etc.).
   - Identify database & ORM/ODM (Mongoose/MongoDB, Prisma/PostgreSQL, TypeORM, etc.).
   - Identify validation and utility libraries (class-validator, Zod, Joi, bcrypt, jsonwebtoken, etc.).
   - Check available build and test scripts (`dev`, `build`, `lint`, `test`).
2. **Examine Project Structure & Conventions**:
   - Inspect existing directory organization (`controllers/`, `services/`, `repositories/`, `routes/`, `dtos/`, `middlewares/`, `config/`).
   - Observe naming conventions (file names, class names, export patterns, casing).
   - Check error handling patterns (custom error classes, central error middleware).
3. **Locate Shared Utilities & Helpers**:
   - Reuse existing database connection instances, config loaders, JWT helpers, validation decorators, and response formatters instead of reinventing them.

---

## 3. Architecture & Separation of Concerns

Follow a straightforward, decoupled layered architecture:

```text
[ HTTP Client / Frontend ]
          │
          ▼
   [ Router / Routes ]
          │
          ▼
   [ Controller ]          <-- Parse HTTP requests, extract params/body, invoke Service, return HTTP status & JSON
          │
          ▼
   [ Service Layer ]       <-- Pure business logic, authorization rules, orchestration, domain validation
          │
          ▼
   [ Repository / Model ]  <-- Data access layer, database queries, persistence operations
          │
          ▼
     [ Database ]
```

### Layer Responsibilities & Boundaries:
* **Router**: Define HTTP paths, methods, and attach validation/auth middlewares.
* **Controller**:
  - Extracts and casts inputs (`req.params`, `req.query`, `req.body`).
  - Calls corresponding service methods.
  - Sends back standardized HTTP responses with correct status codes.
  - *Must NOT*: Contain database queries, password hashing algorithms, or complex business logic.
* **Service**:
  - Implements core business logic, permissions, and workflow orchestration.
  - Coordinates repository calls and domain validations.
  - Throws typed application errors (e.g., `NotFoundError`, `ConflictError`, `UnauthorizedError`).
  - *Must NOT*: Touch Express `req`/`res` objects or know about HTTP-specific headers/status codes.
* **Repository / Model**:
  - Performs direct database queries via ORM/ODM (e.g., Mongoose queries, Prisma client calls).
  - Handles data mapping and database-specific operations.
  - *Must NOT*: Contain HTTP logic or unrelated business orchestration.

---

## 4. API Design Standards

### 4.1 Route Structure & RESTful Conventions
* Use plural nouns for resources: `/api/v1/users`, `/api/v1/posts/:id`, `/api/v1/projects`.
* Use appropriate HTTP verbs:
  - `GET`: Retrieve resource(s) (idempotent, safe, no side-effects).
  - `POST`: Create a new resource (returns `201 Created` with created data or location).
  - `PUT`: Complete update / replacement of resource.
  - `PATCH`: Partial update of resource fields.
  - `DELETE`: Remove resource (returns `200 OK` with summary or `204 No Content`).

### 4.2 Standardized HTTP Status Codes
* `200 OK`: Successful GET, PATCH, or PUT.
* `201 Created`: Successful POST creating a new resource.
* `204 No Content`: Successful DELETE with no response body.
* `400 Bad Request`: Validation failure, malformed payload, invalid query parameter.
* `401 Unauthorized`: Missing, invalid, or expired authentication token.
* `403 Forbidden`: Authenticated user lacks permission to access or modify this resource.
* `404 Not Found`: Requested resource does not exist.
* `409 Conflict`: Duplicate key, unique constraint violation (e.g., email already exists).
* `422 Unprocessable Entity`: Semantic validation errors.
* `500 Internal Server Error`: Unexpected server/database exceptions.

### 4.3 Request Validation & DTOs
* Define explicit Data Transfer Objects (DTOs) or validation schemas (using `class-validator`, `zod`, or existing project schema tools).
* Validate all incoming parameters, queries, and request bodies before executing service logic.
* Return clear, human-readable validation error messages explaining exactly which fields failed and why.

### 4.4 Standard Response Structure
Maintain consistency with existing response formats. A common standard:
```json
{
  "success": true,
  "data": { ... },
  "message": "Resource created successfully"
}
```
Or for errors:
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Project with id '123' was not found"
  }
}
```

### 4.5 Pagination, Sorting & Filtering
* For collection endpoints, implement pagination: `?page=1&limit=20` or `?skip=0&take=20`.
* Enforce maximum page limits (e.g., `limit = Math.min(Number(req.query.limit) || 20, 100)`).
* Return pagination metadata: `totalCount`, `currentPage`, `totalPages`, `hasNextPage`.

---

## 5. Database Interaction & Data Integrity

### 5.1 Safe Queries & Injection Prevention
* Never construct raw queries by concatenating user inputs.
* Use parameterized queries or ORM/ODM query builders (Mongoose, Prisma).
* For MongoDB/Mongoose: Prevent NoSQL operator injection (sanitize objects like `{"$gt": ""}` from user inputs).

### 5.2 Schema Consistency & Indexes
* Define explicit schemas with strict types, defaults, and validation constraints.
* Add database indexes on frequently queried fields (e.g., `email`, `userId`, `createdAt`).
* Avoid over-indexing fields that are rarely queried.

### 5.3 Transactions & Atomic Operations
* Use database transactions (`session.withTransaction()` in Mongoose or `prisma.$transaction()`) when performing multi-document or multi-table operations that must either succeed together or fail together.

### 5.4 Efficiency & Performance
* Fetch only needed fields when reading large documents (`select('name email')`).
* Avoid N+1 query patterns by using aggregation, population, or batch queries (`$in: ids`).

---

## 6. TypeScript & Code Quality Guidelines

### 6.1 Strict Type Safety
* Avoid `any`. Use proper interfaces, types, generics, or `unknown` with type narrowing.
* Type all function arguments and provide return types where they clarify domain expectations.
* Avoid unsafe type assertions (`as unknown as TargetType`). Use runtime guards or validator transformations.

### 6.2 Null and Undefined Handling
* Use optional chaining (`?.`) and nullish coalescing (`??`) defensively.
* Check for entity existence immediately after database lookup:
  ```ts
  const user = await this.userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError(`User with ID ${userId} not found`);
  }
  ```

---

## 7. Security Best Practices

### 7.1 Secrets & Credentials
* Never hardcode secrets, API keys, database passwords, or JWT secrets in source code.
* Always read configuration through environment variables via a centralized config module (`process.env` / config service).

### 7.2 Authentication & Passwords
* Hash passwords using `bcrypt` (or `argon2`) with a salt factor of at least 10 before saving.
* Use constant-time comparison (`bcrypt.compare`) for credential verification.
* Strip password hashes, reset tokens, and internal secrets before returning user objects.

### 7.3 Authorization & Access Control
* **Enforce authorization at the service/controller level**: Never rely on frontend guards alone.
* Verify resource ownership: Ensure user `req.user.id` matches the `ownerId` of the resource being updated or deleted (prevent IDOR).

---

## 8. Implementation Principles & Scope Control

1. **Understand Before Modifying**: Read the existing implementation and related tests/types thoroughly.
2. **Preserve Existing Behavior**: Do not break existing API contracts or response schemas unless explicitly asked.
3. **No Unrelated Refactoring**: Do not reformat untouched files or change architecture arbitrarily.
4. **Focused Diffs**: Keep modifications minimal, clear, and directly targeted to the requested task.

---

## 9. Verification & Completion Checklist

Before completing any backend task, perform the following verification steps:

1. **Type Checking**: Run TypeScript compiler check (e.g., `npx tsc --noEmit` or `npm run build`).
2. **Linting**: Run the project linter if available (e.g., `npm run lint`).
3. **Tests**: Run existing unit/integration tests (e.g., `npm test`).
4. **Self-Review**: Verify error paths, edge cases, and that no secrets or `console.log` debug leftovers remain.

### Final Summary Output Format:
When concluding a task, provide a concise summary with:
- **Files Modified / Created**: List of all affected file paths.
- **Summary of Changes**: Key features implemented or bugs fixed.
- **Verification Performed**: Commands run and results (build, lint, tests).
- **Potential Risks / Considerations**: Any remaining edge cases, environment dependencies, or future considerations.
