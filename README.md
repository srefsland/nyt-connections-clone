# NYT Connections Clone

Clone of the Connections game from the New York Times, written using Next.js.

## Table of Contents

- [Quick Start with Docker](#quick-start-with-docker)
- [Installing Locally](#installing-locally)
- [Development](#development)
- [Testing](#testing)
- [Using Makefile](#using-makefile)
- [Deployment](#deployment)
- [License](#license)

## Quick Start with Docker

The fastest way to run the app is using Docker:

### Option 1: Build from Source

```bash
# Clone the repository
git clone https://github.com/srefsland/nyt-connections-clone.git
cd nyt-connections-clone

# Build and run with Docker Compose
docker-compose up -d

# Access the app at http://localhost:3000
```

### Option 2: Use Prebuilt Image

```bash
# Run with prebuilt image
docker-compose -f docker-compose.simple.yml up -d

# Access the app at http://localhost:3000
```

To stop the containers:
```bash
docker-compose down
```

## Installing Locally

For those interested in running the app locally without Docker:

### Prerequisites

- Node.js 18+ and npm

### Setup

Clone the repository:
```bash
git clone https://github.com/srefsland/nyt-connections-clone.git
cd nyt-connections-clone
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The development server is now live at http://localhost:3000.

### Production Build

To build and run in production mode:
```bash
npm run build
npm svelopment

### Code Quality

This project uses several tools to maintain code quality:

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

Pre-commit hooks automatically run when you commit changes, ensuring code quality.

### Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
prettier --write .       # Format all files

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run E2E tests with UI
```

## Testing

### Unit Tests

Unit tests use Jest and React Testing Library:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Tests are located in `app/__tests__/` directories.

### E2E Tests

End-to-end tests use Playwright:

```bash
# Run E2E tests
npm run test:e2e

# Run with Playwright UI
npm run test:e2e:ui

# Install Playwright browsers (first time only)
npx playwright install
```

E2E tests are located in the `e2e/` directory.

### Coverage Reports

Coverage reports are generated in the `coverage/` directory. The project maintains coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Using Makefile

A Makefile is provided for convenient command shortcuts:

```bash
# View all available commands
make help

# Common tasks
make install         # Install dependencies
make dev            # Start development server
make build          # Build for production
make test           # Run unit tests
make test-coverage  # Run tests with coverage
make test-e2e       # Run E2E tests
make lint           # Run linter
make format         # Format code with Prettier

# Docker commands
make docker-build   # Build Docker image
make docker-up      # Start Docker containers
make docker-down    # Stop Docker containers
make docker-logs    # View Docker logs
make docker-simple  # Run with prebuilt image

# CI/CD
make ci             # Run all CI checks locally
make all            # Install, test, and build

# Cleanup
make clean          # Remove build artifacts
make docker-clean   # Remove Docker resources
```

## Detart
```

## Deployment

For deployment guides to various cloud platforms, see:
- [AWS Deployment Guide](docs/deploy-aws.md)
- [Azure Deployment Guide](docs/deploy-azure.md)
- [Google Cloud Deployment Guide](docs/deploy-gcp.md)

## License

This project is released under the [MIT License](LICENSE.md).
