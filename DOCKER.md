# ChatBit — Docker Deployment Guide

This guide explains how to build, run, and manage the full **ChatBit** stack using Docker and Docker Compose.

---

## Architecture Overview

The Dockerized environment contains 3 services:

1. **`db`** (`postgres:16-alpine`): PostgreSQL database with automated table initialization from `backend/schema.sql`.
2. **`backend`** (`node:20-alpine`): Express.js & Socket.IO server running on port `3000`.
3. **`mobile`** (`nginx:alpine`): Expo Web static bundle served on port `8080`.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- `docker compose` (v2+) or `docker-compose` (v1).

---

## Getting Started

### 1. Build & Start All Services

Run the following command from the project root directory:

```bash
docker compose up --build
```

To run in detached (background) mode:

```bash
docker compose up -d --build
```

---

## Exposed Endpoints

| Service | Host URL | Description |
|---|---|---|
| **Web Client** | `http://localhost:8080` | ChatBit Web Interface |
| **Backend API** | `http://localhost:3000` | REST API & Socket.IO endpoint |
| **API Documentation** | `http://localhost:3000/docs` | Scalar OpenAPI Documentation |
| **Health Check** | `http://localhost:3000/health` | Backend status check |
| **PostgreSQL DB** | `localhost:5432` | Database server |

---

## Managing Containers

- **View Running Services**:
  ```bash
  docker compose ps
  ```

- **View Real-Time Logs**:
  ```bash
  docker compose logs -f
  ```

- **View Logs for a Specific Service**:
  ```bash
  docker compose logs -f backend
  ```

- **Stop Services**:
  ```bash
  docker compose stop
  ```

- **Stop & Remove Containers and Volumes**:
  ```bash
  docker compose down -v
  ```

---

## Environment Variables Configuration

You can customize runtime credentials by creating a `.env` file in the root directory:

```env
DB_NAME=chatbit_db
DB_USER=chatbit_user
DB_PASSWORD=chatbit_password
JWT_SECRET=your_custom_jwt_secret_key_here
EXPO_PUBLIC_API_URL=http://localhost:3000
```
