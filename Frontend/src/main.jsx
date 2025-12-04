import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";


import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";


import CropRecognizer from "./pages/CropRecognizer.jsx";
import WaterLevel from "./pages/WaterLevel.jsx";
import DiseaseDetect from "./pages/DiseaseDetect.jsx";
import Alerts from "./pages/Alerts.jsx";

import Weather from "./pages/Weather.jsx";
import DroneView from "./pages/DroneView.jsx";
import FertilizerGuide from "./pages/FertilizerGuide.jsx";
import MarketPrice from "./pages/MarketPrice.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Feature Pages */}
        <Route path="/crop-Recognizer" element={<CropRecognizer />} />
        <Route path="/water-level" element={<WaterLevel />} />
        <Route path="/disease-detect" element={<DiseaseDetect />} />
        <Route path="/alerts" element={<Alerts />} />
        
        <Route path="/weather" element={<Weather />} />
        <Route path="/drone-view" element={<DroneView />} />
        <Route path="/fertilizer-guide" element={<FertilizerGuide />} />
        <Route path="/market-price" element={<MarketPrice />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);