# <img src="src/assets/logo.png" alt="Lunch Gacha Logo" height="40"> Lunch Gacha

A fun, physics-based decision-making PWA that helps you decide where to eat! Add your favorite restaurants, assign them weights, and let the Gachapon machine decide your fate.

## ✨ Features

-   **Gachapon Animation**: Satisfying physics-based animation using `matter-js` with a custom dome container.
-   **Weighted Selection**: Assign higher weights to places you prefer more to increase their winning probability.
-   **Interactive Management**:
    -   **Inline Editing**: Click any restaurant name or weight to edit directly.
    -   **Toggle Availability**: Click a restaurant row to enable/disable it without deleting (disabled items are skipped).
-   **PWA Support**: Installable on mobile and desktop devices with offline capabilities.
-   **Data Persistence**: Your list is saved automatically to your device's local storage.
-   **Import/Export**: Share your restaurant lists via JSON files.
-   **Dark Mode**: Sleek, premium UI design with glassmorphism effects.

## 🛠️ Tech Stack

-   **Vue 3** + **Vite** (v7.2.4)
-   **Matter.js** (Physics Engine v0.20.0)
-   **Vite PWA Plugin**
-   **Vanilla CSS** (Responsive Mobile-First Design)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/lunch-spinner.git
    cd lunch-spinner
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

## 📖 Usage Guide

### Managing Restaurants
-   **Add**: Use the form at the top to add a new place. Default weight is 1.
-   **Edit**: Click on the name or weight of any existing item to edit it inline. Press `Enter` to save or `Esc` to cancel.
-   **Toggle**: Click anywhere else on a restaurant row to toggle it on/off. Disabled restaurants appear dimmed and won't be included in the draw.
-   **Delete**: Click the trash icon to remove a restaurant permanently.

### Import/Export Data
You can backup your list or share it with friends using the JSON Import/Export buttons.

**Data Format Example:**
```json
[
  {
    "id": 1715432100000,
    "name": "Burger King",
    "weight": 5,
    "enabled": true
  },
  {
    "id": 1715432100001,
    "name": "Salad Bar",
    "weight": 1,
    "enabled": false
  }
]
```

## ⚙️ How It Works

### Weighted Selection
The application uses a weighted random algorithm. The probability of a restaurant being chosen is calculated as:
`P(x) = Weight(x) / Total_Active_Weight`

For example, if you have "Pizza" (Weight 10) and "Salad" (Weight 1), "Pizza" is 10 times more likely to be chosen.

### Physics Engine
The Gachapon machine simulates a physical environment where capsules (representing your choices) are dropped into a container.
-   **Engine**: Matter.js
-   **Simulation**: Includes gravity, restitution (bounciness), and friction.
-   **Capsules**: The number of capsules spawned (3-15) scales based on your list size.

## 🐳 Docker Deployment

You can run the application in a container using Docker Compose.

```bash
docker compose up -d --build
```

The app will be available at `http://localhost:8081`.

## 📄 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
