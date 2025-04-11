import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "primereact/resources/themes/saga-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <App />
  // </StrictMode>‚
);
