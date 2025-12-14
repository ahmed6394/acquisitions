# Docker Setup Guide

This project uses Docker to provide consistent environments for both development and production. The setup integrates with **Neon Database**, using **Neon Local** for development and **Neon Serverless Postgres** for production.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- A [Neon](https://neon.tech) account (for API keys and production database).

---

## 1. Development Environment

In development, we use the `neondatabase/neon-local` image to simulate the Neon platform locally. This proxy automatically manages ephemeral branches for your local development.

### Configuration

1.  Ensure you have a `.env.development` file (or `.env` loaded by default).
2.  You need your Neon API Key and Project ID to allow the local proxy to communicate with Neon for branching (if configured) or authentication.

**Required Environment Variables (`.env.development`):**

```dotenv
# Neon API Credentials (get these from Neon Console)
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_project_id

# App Config
PORT=3000
LOG_LEVEL=debug
JWT_SECRET=dev_secret
```

### Running the Dev Stack

Start the application and the Neon Local proxy:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Accessing Services

-   **Application**: [http://localhost:3000](http://localhost:3000)
    -   The app runs in `development` mode with hot-reloading enabled (via `node --watch`).
-   **Database**: `postgres://neon:npg@localhost:5432/neondb`
    -   The app connects internally via `postgres://neon:npg@neon-local:5432/neondb`.

### How it Works

-   **`neon-local` service**: Runs the Neon proxy. It intercepts database connections and can manage branching logic.
-   **`app` service**: Builds from the `development` stage of the `Dockerfile`. It mounts your local source code (`.:/app`) so changes are reflected immediately without rebuilding.

---

## 2. Production Environment

In production, the application connects directly to your Neon Cloud Postgres instance. The Docker image is optimized for size and performance.

### Configuration

1.  Create a `.env.production` file (DO NOT commit this to Git if it contains real secrets).
2.  Set the `DATABASE_URL` to your actual Neon connection string.

**Required Environment Variables (`.env.production`):**

```dotenv
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
JWT_SECRET=your_secure_production_secret

# Your Neon Cloud Connection String
DATABASE_URL=postgres://user:pass@ep-xyz.region.neon.tech/neondb?sslmode=require
```

### Running the Prod Stack

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up --build -d
```

### How it Works

-   **`app` service**: Builds from the `production` stage of the `Dockerfile`.
    -   Installs only production dependencies (`npm ci --only=production`).
    -   Runs as a non-root user (`nodejs`) for security.
    -   No source code mounting; the code is baked into the image.
-   **Database**: No local database container is run. The app connects securely to the remote Neon instance.

---

## 3. Dockerfile Details

The `Dockerfile` uses a multi-stage build process:

1.  **`base`**: Sets up Node.js and copies `package.json`.
2.  **`development`**: Extends `base`, installs all dependencies (including devDeps), and runs `npm run dev`.
3.  **`production`**: Extends `base`, installs only prod dependencies, creates a non-root user, and runs `npm start`.

## 4. Troubleshooting

### "User not found" or Auth Errors in Dev
-   Ensure `neon-local` is healthy (`docker ps`).
-   Check if `NEON_API_KEY` is valid in your `.env` file.

### Database Connection Refused
-   **Dev**: Ensure the `neon-local` container is running and exposing port 5432.
-   **Prod**: Check your `DATABASE_URL` and ensure your IP is allowed in Neon's dashboard settings (if IP allowlisting is enabled).

### Hot Reload Not Working
-   Ensure you are running the **dev** stack (`docker-compose.dev.yml`).
-   Verify that the volume mount `- .:/app` is working correctly (Docker Desktop file sharing settings).
