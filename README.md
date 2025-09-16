# CloudVR Tours - Immersive Virtual Travel Experiences

## Project Overview

CloudVR Tours is a cutting-edge VR tourism platform that allows users to explore breathtaking destinations through immersive virtual reality experiences. Built with modern web technologies, it provides 360° tours of global landmarks without requiring a VR headset.

## Getting Started

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

This project can be deployed to any static hosting service such as:

- **Vercel** - `npm run build` then deploy the `dist` folder
- **Netlify** - Connect your GitHub repository for automatic deployments
- **GitHub Pages** - Use GitHub Actions for automated builds
- **AWS S3** - Upload the built files to an S3 bucket

## Features

- 🌍 **150+ Global Destinations** - Explore world-famous landmarks
- 🥽 **No VR Headset Required** - Works in any modern browser
- 📱 **Mobile Optimized** - Touch controls and gyroscope support
- 🎯 **Interactive Hotspots** - Click markers for detailed information
- 🎨 **Modern UI/UX** - Glassmorphism design with smooth animations
- 🔐 **User Authentication** - Sign up/login with email or Google
- 💳 **Payment Integration** - Stripe integration for premium tours
