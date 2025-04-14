import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./App.css";
import "primereact/resources/themes/saga-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
