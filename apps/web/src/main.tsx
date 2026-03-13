import { createRoot } from "react-dom/client";
import { AppRouter } from "./app/router.tsx";
import "./styles/globals.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(<AppRouter />);
