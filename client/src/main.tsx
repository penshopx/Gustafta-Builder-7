import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

window.__pwaInstalled = false;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.__pwaInstallPrompt = e;
});

window.addEventListener("appinstalled", () => {
  window.__pwaInstalled = true;
  window.__pwaInstallPrompt = undefined;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("root")!).render(<App />);
