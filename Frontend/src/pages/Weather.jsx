import React, { useEffect, useState } from "react";
import {
  ArrowLeftCircle,
  CloudSun,
  CalendarDays,
  CloudRain,
  Thermometer,
  Droplets,
  MessageCircle,
  X,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const navigate = useNavigate();
  const API_KEY = "f0b031f077010784afb946cad85a16fe";

  // --- Weather Fetch Logic ---
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const w = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const wData = await w.json();
        if (wData.cod !== 200) throw new Error("Weather Error");
        setWeather(wData);

        const f = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const fData = await f.json();

        const daily = {};
        fData.list.forEach((item) => {
          const date = item.dt_txt.split(" ")[0];
          if (!daily[date])
            daily[date] = {
              temp: item.main.temp,
              weather: item.weather[0].main,
            };
        });
        setForecast(Object.entries(daily).slice(0, 7));
      } catch (e) {
        setError("⚠ Weather API Error. Check your key or plan.");
      }
      setLoading(false);
    });
  }, []);

  // --- Chatbot Send Logic ---
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setChatLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.reply || "No response." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Unable to reach AI server." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col justify-center items-center text-xl text-emerald-900 font-semibold">
        🌦 Fetching live weather data...
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex justify-center items-center text-red-600 text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-emerald-200 to-lime-200 relative overflow-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/40 backdrop-blur-md border-b border-emerald-200 shadow-sm flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-2">
          <CloudSun className="text-emerald-600 w-6 h-6" />
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
            Weather Forecast
          </h1>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white bg-gradient-to-r from-emerald-500 to-lime-500 hover:scale-105 transition-transform shadow-md active:scale-95"
        >
          <ArrowLeftCircle className="w-4 h-4" /> Back
        </button>
      </nav>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto py-10 px-4"
      >
        {/* Current Weather Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-emerald-300 rounded-3xl p-8 shadow-2xl text-center">
          <h2 className="text-3xl font-bold text-emerald-800 flex justify-center items-center gap-2 mb-2">
            <CloudSun /> {weather.name}
          </h2>
          <p className="text-gray-700 text-lg capitalize mb-4">
            {weather.weather[0].description}
          </p>

          <div className="text-7xl font-extrabold text-emerald-700">
            {Math.round(weather.main.temp)}°C
          </div>

          <div className="flex justify-center gap-8 mt-6 text-gray-800 font-semibold">
            <div className="flex items-center gap-1">
              <Thermometer size={18} /> Feels like {Math.round(weather.main.feels_like)}°C
            </div>
            <div className="flex items-center gap-1">
              <Droplets size={18} /> Humidity {weather.main.humidity}%
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-center text-emerald-800 mb-6 flex items-center justify-center gap-2">
            <CalendarDays /> 7-Day Forecast
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {forecast.map(([date, day], i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-emerald-400 via-sky-300 to-lime-300 rounded-2xl p-[2px] shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="bg-white/80 rounded-2xl p-5 text-center backdrop-blur-lg border border-white/40">
                  <p className="text-gray-800 font-semibold mb-1">
                    {new Date(date).toLocaleDateString("en-IN", {
                      weekday: "short",
                    })}
                  </p>
                  <div className="text-3xl font-bold text-emerald-700">
                    {Math.round(day.temp)}°C
                  </div>
                  <p className="capitalize text-gray-700 mt-1">
                    {day.weather === "Rain" ? (
                      <CloudRain className="inline-block w-6 h-6 text-blue-500" />
                    ) : (
                      <CloudSun className="inline-block w-6 h-6 text-yellow-500" />
                    )}{" "}
                    {day.weather}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-12 text-center bg-white/70 backdrop-blur-lg rounded-2xl border border-emerald-200 p-8 shadow-lg">
          <h4 className="text-2xl font-bold text-emerald-700 mb-3">
            💡 FarmGuard AI Weather Tips
          </h4>
          <p className="text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Based on real-time humidity and temperature, schedule irrigation
            early morning or late evening to prevent evaporation losses.
            FarmGuard AI continuously tracks rainfall patterns to help you plan
            sowing, fertilizer use, and pesticide application efficiently 🌾
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="text-center py-6 text-emerald-900/80 text-sm">
        © {new Date().getFullYear()} FarmGuard — AI-Powered Smart Farming 🌱
      </footer>

      {/* 💬 Chatbot Floating Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-400 to-lime-400 text-gray-900 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-[9999]"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* 🧠 Chat Popup */}
      {showChat && (
        <div className="fixed bottom-6 right-6 bg-emerald-950/90 backdrop-blur-xl border border-emerald-400/30 rounded-2xl shadow-2xl w-80 max-h-[70vh] flex flex-col overflow-hidden z-[9999]">
          <div className="flex justify-between items-center bg-emerald-500/20 px-4 py-2 border-b border-emerald-400/30">
            <h3 className="font-bold text-lime-300">
              FarmGuard AI Assistant 🤖
            </h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:text-lime-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.from === "user"
                    ? "bg-emerald-400/80 text-gray-900 self-end ml-auto"
                    : "bg-white/20 text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <p className="text-xs text-gray-300 italic">Typing...</p>
            )}
          </div>

          <div className="flex border-t border-emerald-400/20 bg-emerald-900/60">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 bg-transparent text-white outline-none placeholder-gray-400"
              placeholder="Ask about weather, crops, or AI..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="px-3 text-lime-300 hover:text-white font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}