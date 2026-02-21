# NYT Connections Clone

Clone of the Connections game from the New York Times, written using Next.js.

## Table of Contents

- [Quick Start with Docker](#quick-start-with-docker)
- [Installing Locally](#installing-locally)
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
npm start
```

## Deployment

For deployment guides to various cloud platforms, see:
- [AWS Deployment Guide](docs/deploy-aws.md)
- [Azure Deployment Guide](docs/deploy-azure.md)
- [Google Cloud Deployment Guide](docs/deploy-gcp.md)

## License

This project is released under the [MIT License](LICENSE.md).
