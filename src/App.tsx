import { useState } from "react";
import "./App.css";
import { EventDashboard } from "./components/EventDashboard";
import { InteractivePlayground } from "./components/InteractivePlayground";

type View = "dashboard" | "playground";

function App() {
  const [view, setView] = useState<View>("playground");

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="app-nav">
        <button
          className={`nav-btn ${view === "playground" ? "active" : ""}`}
          onClick={() => setView("playground")}
        >
          🎬 Interactive Video
        </button>
        <button
          className={`nav-btn ${view === "dashboard" ? "active" : ""}`}
          onClick={() => setView("dashboard")}
        >
          📊 Analytics Dashboard
        </button>
      </nav>

      {/* Content */}
      {view === "dashboard" && <EventDashboard />}
      {view === "playground" && <InteractivePlayground />}
    </div>
  );
}

export default App;
