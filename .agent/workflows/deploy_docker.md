---
description: Deploy Lunch Gacha using Docker
---

# Docker Deployment Guide

This guide explains how to containerize and run the Lunch Gacha application using Docker.

## Prerequisites
- Docker installed on your machine.

## Configuration Files
The following files have been created in your project root:
- `Dockerfile`: Defines the multi-stage build process (Node.js build -> Nginx server).
- `nginx.conf`: Configuration for the Nginx server to handle the Single Page Application (SPA) routing.
- `.dockerignore`: Specifies files to exclude from the Docker build context.

## Steps to Deploy

### 1. Build the Docker Image
Open your terminal in the project root and run:

```bash
docker build -t lunch-gacha .
```

This command will:
1.  Use a Node.js image to install dependencies and build the Vue app.
2.  Use an Nginx image to serve the built static files.

### Option 2: Using Docker Compose (Recommended)

Build and start the container in the background:

```bash
docker compose up -d --build
```

To stop the container:

```bash
docker compose down
```

### Access the Application
Open your web browser and navigate to:

[http://localhost:8080](http://localhost:8080)

## Managing the Container

To **view logs**:
```bash
docker compose logs -f
```

