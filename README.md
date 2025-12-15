# Acquisitions App

This application is dockerized for both development (using a local Postgres instance to simulate Neon) and production (using Neon Serverless Postgres).

## Prerequisites

- Docker and Docker Compose installed.

## Development Environment

The development environment runs the application alongside a local Postgres container (`neon-local`) to simulate the database.

### Setup & Run

1.  Ensure `.env.development` exists (created automatically).
2.  Run the development stack:

    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```

3.  The application will be available at `http://localhost:3000`.
4.  The database is accessible at `postgres://user:password@localhost:5432/dbname`.

### Notes

- The app connects to the database via the internal hostname `neon-local`.
- Hot-reloading is enabled for the application code.

## Production Environment

The production environment builds an optimized image and expects an external Neon Database URL.

### Setup & Run

1.  Set the `DATABASE_URL` environment variable to your Neon Cloud connection string.
2.  Run the production stack:

    ```bash
    export DATABASE_URL="postgres://user:pass@ep-xyz.region.neon.tech/dbname?sslmode=require"
    docker-compose -f docker-compose.prod.yml up --build
    ```

    Or using a `.env` file (ensure it's not committed):

    ```bash
    docker-compose -f docker-compose.prod.yml --env-file .env.production up --build
    ```

## Project Structure

- `Dockerfile`: Multi-stage build for dev and prod.
- `docker-compose.dev.yml`: Defines the dev stack with local Postgres.
- `docker-compose.prod.yml`: Defines the prod stack (app only).
- `.env.development`: Default config for local dev.
- `.env.production`: Template for production config.
