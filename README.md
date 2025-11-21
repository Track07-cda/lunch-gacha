# 🍱 Lunch Gacha

A fun, physics-based decision-making PWA that helps you decide where to eat! Add your favorite restaurants, assign them weights, and let the Gachapon machine decide your fate.

![Lunch Gacha Screenshot](https://via.placeholder.com/800x400?text=Lunch+Gacha+App)

## ✨ Features

-   **Gachapon Animation**: Satisfying physics-based animation using `matter-js`.
-   **Weighted Selection**: Assign higher weights to places you prefer more.
-   **PWA Support**: Installable on mobile and desktop devices.
-   **Offline Capable**: Works without an internet connection.
-   **Data Persistence**: Your list is saved automatically to your device.
-   **Import/Export**: Share your restaurant lists via JSON.
-   **Dark Mode**: Sleek, premium UI design.

## 🛠️ Tech Stack

-   **Vue 3** + **Vite**
-   **Matter.js** (Physics)
-   **Vite PWA Plugin**
-   **Vanilla CSS**

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/lunch-gacha.git
    cd lunch-gacha
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

## 🐳 Docker Deployment

You can run the application in a container using Docker Compose.

```bash
docker compose up -d --build
```

The app will be available at `http://localhost:8080`.

## 🌐 Deploying to GitHub Pages

To deploy this Vue app to GitHub Pages, follow these steps:

### 1. Update `vite.config.js`

If you are deploying to `https://<USERNAME>.github.io/<REPO>/`, you must set the `base` parameter in `vite.config.js`.

```javascript
export default defineConfig({
  base: '/lunch-gacha/', // Replace 'lunch-gacha' with your repository name
  plugins: [ ... ]
})
```

> **Note**: If you are deploying to a custom domain or user page (`username.github.io`), you can skip this step or set `base: '/'`.

### 2. Manual Deployment

1.  Build the project:
    ```bash
    npm run build
    ```

2.  Commit the `dist` folder to a `gh-pages` branch (or use a deployment script).

### 3. Automated Deployment (GitHub Actions)

Create a file at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then, go to your repository **Settings > Pages** and set the source to **GitHub Actions**.
