# <img src="src/assets/logo.png" alt="Lunch Gacha Logo" height="40"> Lunch Gacha

A fun, physics-based decision-making PWA that helps you decide where to eat! Add your favorite restaurants, assign them weights, and let the Gachapon machine decide your fate.


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

## 📄 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
