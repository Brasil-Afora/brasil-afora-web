import "leaflet/dist/leaflet.css"
import React from "react"
import ReactDOM from "react-dom/client"
import { Toaster } from "@/components/ui/sonner"
import App from "./app"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
)
