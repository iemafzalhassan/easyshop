# EasyShop Frontend
[![GitHub Profile](https://img.shields.io/badge/GitHub-iemafzalhassan-blue?logo=github&style=flat)](https://github.com/iemafzalhassan)
![Docker Image](https://img.shields.io/github/forks/iemafzalhassan/easyshop)
[![Stars](https://img.shields.io/github/stars/iemafzalhassan/easyshop)](https://github.com/iemafzalhassan/easyshop)
![GitHub last commit](https://img.shields.io/github/last-commit/iemafzalhassan/easyshop?color=red)
<p align="center">
  <img src="public/logo.svg" alt="EasyShop Logo" width="200"/>
</p>

A modern e-commerce platform built with Next.js 14, featuring server-side rendering, real-time updates, and a seamless shopping experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Docker Support](#docker-support)
- [Contributing](#contributing)

## Features

| Feature | Description |
|---------|-------------|
| Authentication | Secure user authentication with JWT |
| Multi-vendor | Support for multiple shops and vendors |
| Dark Mode | Built-in dark/light theme support |
| Cart Management | Real-time cart updates and management |
| Search & Filter | Advanced product search and filtering |
| Responsive Design | Mobile-first responsive layout |
| Server Actions | Next.js 14 server actions integration |

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|----------|
| Next.js | 14.1.0 | Frontend Framework |
| React | 18.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 3.x | Styling |
| Redux Toolkit | 2.x | State Management |
| PM2 | Latest | Process Management |

## Getting Started

### Prerequisites

```bash
# Required
Node.js >= 18.x
npm >= 9.x
Docker >= 20.x
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/iemafzalhassan/easyshop.git

# Navigate to the project directory
cd easyshop

# Install dependencies
npm install

# Run development server
npm run dev

# Run JSON server (in separate terminal)
npm run server
```

### Docker Deployment

```bash
# Pull the image
docker pull iemafzal/easyshop:v1.0

# Create network
docker network create easyshop-network

# Run container
docker run -d \
  --name easyshop-frontend \
  --network easyshop-network \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=http://api:8000 \
  --restart unless-stopped \
  iemafzal/easyshop:v1.0

# Using docker-compose
docker-compose up -d
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8000
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## Project Structure

```
easyshop-frontend/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── (auth)/      # Auth group routes
│   │   ├── products/    # Product routes
│   │   └── shops/       # Shop routes
│   ├── components/      # React components
│   ├── lib/            # Utilities & store
│   └── types/          # TypeScript types
├── public/             # Static assets
└── docker/            # Docker configs
```

## API Integration

The project uses server actions for API integration:

```typescript
// Example server action
export async function authenticated() {
  const token = await getCookies("token");
  return !!token;
}
```

## Docker Support

### Available Commands

| Command | Description |
|---------|-------------|
| `docker build` | Build the image |
| `docker-compose up` | Start all services |
| `docker-compose down` | Stop all services |
| `docker logs` | View container logs |

### Building Custom Image

```bash
# Build image
docker build -t easyshop-frontend:latest .

# Tag image
docker tag easyshop-frontend:latest iemafzal/easyshop:v1.0

# Push to Docker Hub
docker push iemafzal/easyshop:v1.0
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Md. Afzal Hassan Ehsani - [@iemafzalhassan](https://linkedin.com/in/iemafzalhassan)

Project Link: [https://github.com/yourusername/easyshop-frontend](https://github.com/yourusername/easyshop-frontend)
