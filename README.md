# Acquisitions API

A production-ready Node.js Express REST API for managing acquisitions, featuring authentication, rate limiting, security middleware, and containerized deployment.

## 🚀 Features

- **Authentication & Authorization** - JWT-based authentication with secure cookie handling
- **Rate Limiting & Bot Protection** - Powered by Arcjet for intelligent threat detection
- **Database** - PostgreSQL with Drizzle ORM and Neon serverless support
- **Security** - Helmet, CORS, and comprehensive security middleware
- **Containerization** - Docker support with development and production configurations
- **CI/CD** - GitHub Actions workflows for linting, testing, and Docker builds
- **Code Quality** - ESLint, Prettier, and automated testing with Jest

## 📋 Prerequisites

- Node.js 20.x or higher
- Docker & Docker Compose
- PostgreSQL database (or Neon account for serverless)
- Arcjet account for security features

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmed6394/acquisitions.git
   cd acquisitions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.development
   ```

4. **Configure your `.env.development`**
   ```env
   # Server
   PORT=3000
   NODE_ENV=development

   # Database (Neon)
   DATABASE_URL=postgresql://user:password@host:5432/database

   # JWT
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRES_IN=7d

   # Arcjet
   ARCJET_KEY=your-arcjet-key
   ARCJET_ENV=development
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

### Docker Development

1. **Start with Docker Compose**
   ```bash
   npm run dev:docker
   # or
   ./scripts/dev.sh
   ```

   This will:
   - Build the application container
   - Start Neon Local proxy for database
   - Run migrations automatically
   - Enable hot reload

2. **View logs**
   ```bash
   docker compose -f docker-compose.dev.yml logs -f
   ```

3. **Stop containers**
   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage
```

## 📝 API Endpoints

### Health & Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Health check with uptime |
| GET | `/api` | API status |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/refresh` | Refresh access token |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (admin) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## 🏗️ Project Structure

```
acquisitions/
├── .github/
│   └── workflows/          # CI/CD workflows
├── scripts/
│   ├── dev.sh              # Development startup script
│   └── prod.sh             # Production startup script
├── src/
│   ├── config/
│   │   ├── arcjet.js       # Arcjet security configuration
│   │   ├── database.js     # Database connection
│   │   └── logger.js       # Winston logger setup
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── security.middleware.js
│   ├── models/
│   │   └── user.model.js   # Drizzle schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── users.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   └── users.service.js
│   ├── utils/
│   │   ├── cookies.js
│   │   ├── format.js
│   │   └── jwt.js
│   ├── validations/
│   │   ├── auth.validation.js
│   │   └── users.validation.js
│   ├── app.js              # Express app setup
│   └── index.js            # Entry point
├── tests/
│   └── app.test.js         # API tests
├── .env.example
├── docker-compose.dev.yml
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.dev
├── drizzle.config.js
├── eslint.config.js
├── jest.config.mjs
└── package.json
```

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run dev:docker` | Start Docker development environment |
| `npm run prod:docker` | Start Docker production environment |
| `npm run test` | Run Jest tests |

## 🐳 Docker

### Development

```bash
# Build and start
docker compose -f docker-compose.dev.yml up --build

# Stop
docker compose -f docker-compose.dev.yml down
```

### Production

```bash
# Build and start
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Pull from Docker Hub

```bash
docker pull <your-dockerhub-username>/acquisitions:latest
docker run -p 3000:3000 --env-file .env <your-dockerhub-username>/acquisitions:latest
```

## 🔐 Security Features

### Arcjet Protection

- **Bot Detection** - Identifies and blocks malicious bots
- **Rate Limiting** - Sliding window rate limiting per IP
- **Shield** - Protection against common attacks

### Authentication

- JWT tokens with secure HTTP-only cookies
- Password hashing with bcrypt
- Role-based access control (user/admin)

### Headers & CORS

- Helmet for secure HTTP headers
- Configurable CORS policies

## 🚀 CI/CD

### GitHub Actions Workflows

1. **Lint and Format** (`.github/workflows/lint-and-format.yml`)
   - Runs ESLint and Prettier checks
   - Triggered on push and pull requests

2. **Tests** (`.github/workflows/tests.yml`)
   - Runs Jest test suite
   - Generates coverage reports
   - Triggered on push and pull requests

3. **Docker Build** (`.github/workflows/docker-build-and-push.yml`)
   - Builds Docker image
   - Pushes to Docker Hub
   - Triggered on push to main

### Required Secrets

Configure these in GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `DATABASE_URL` | PostgreSQL connection string |
| `ARCJET_KEY` | Arcjet API key |

## 📊 Database

### Drizzle ORM

This project uses Drizzle ORM with PostgreSQL. Schema is defined in `src/models/`.

```bash
# Generate new migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (GUI)
npm run db:studio
```

### Neon Serverless

For local development with Neon:

1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `.env.development`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ahmed**

- GitHub: [@ahmed6394](https://github.com/ahmed6394)

---

⭐ Star this repository if you found it helpful!