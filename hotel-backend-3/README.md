# Hotel Management System - Backend

Spring Boot 3 REST API for the Hotel Management System university project.

## Module 1 status: Setup + Auth (COMPLETE)
- Project scaffold, Maven config, application.properties (dev/prod profiles)
- Database schema (Flyway migration, MySQL) - all 8 tables + relationships
- Global exception handling + standard ApiResponse/PageResponse/ErrorResponse wrappers
- JWT security (dual auth: customer vs staff/admin), Spring Security config, role-based route protection
- Customer auth: register + login (`/api/customer/auth/**`)
- Staff/Admin auth: login only (`/api/admin/auth/login`)
- Customer profile view/edit (`/api/customer/profile`)

## Setup

1. Install MySQL (XAMPP) and start it. No need to create the database manually -
   `createDatabaseIfNotExist=true` in `application-dev.properties` handles it, and Flyway
   creates the tables automatically on first run.
2. Update `src/main/resources/application-dev.properties` with your MySQL username/password if not using default XAMPP root with no password.
3. Run:
   ```
   mvn spring-boot:run
   ```
4. API base URL: `http://localhost:8080`
5. Swagger UI: `http://localhost:8080/swagger-ui.html`

## Render + Aiven deployment

If the backend runs on Render and MySQL is hosted by Aiven, configure these Render
environment variables from the Aiven service details:

```text
SPRING_PROFILES_ACTIVE=prod
DB_URL=jdbc:mysql://<aiven-host>:<aiven-port>/<database>?useSSL=true&sslMode=REQUIRED&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=<aiven-username>
DB_PASSWORD=<aiven-password>
JWT_SECRET=<long-random-secret>
```

Use the Aiven host, port, database name, username, and password exactly as shown
in Aiven. `DB_URL` must start with `jdbc:mysql://`; do not add a leading colon,
surround the value with quotes, or paste Aiven's `mysql://` URI unchanged.
Keep the credentials in Render environment variables or secrets, never in Git.

## Default seeded accounts

| Role  | Email              | Password   |
|-------|---------------------|------------|
| Admin | admin@hotel.com     | Admin@123  |

(Change this password after first login in a real deployment. Customers self-register via `/api/customer/auth/register`. Staff accounts get created by Admin in the upcoming Admin > Manage Staff module.)

## API endpoints so far

| Method | Endpoint                        | Access          | Description            |
|--------|----------------------------------|-----------------|-------------------------|
| POST   | /api/customer/auth/register      | Public          | Customer self-register  |
| POST   | /api/customer/auth/login         | Public          | Customer login          |
| POST   | /api/admin/auth/login            | Public          | Staff/Admin login       |
| GET    | /api/customer/profile            | CUSTOMER        | Get own profile         |
| PUT    | /api/customer/profile            | CUSTOMER        | Update own profile      |

## Next modules (in order)
Room Type -> Room + Room Images -> Upload -> Booking -> Payment -> Dashboard/Report -> Frontend integration

## Note on this environment
This project was scaffolded in a sandboxed environment without access to Maven Central,
so `mvn compile` could not be run here to verify the build. The code follows correct
Spring Boot 3 / Jakarta EE conventions - run `mvn spring-boot:run` locally to build and start it.
