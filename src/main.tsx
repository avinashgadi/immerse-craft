import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Performance monitoring
if (import.meta.env.DEV) {
  console.log("🚀 CloudVR Tours - Development Mode");
  console.log("📊 Performance: Monitor bundle size and loading times");
}

// Create root and render app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
