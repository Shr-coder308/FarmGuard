import React, { useState } from "react";
import {
  Clock,
  Bell,
  Droplet,
  Sparkles,
  Trash2,
  MessageCircle,
  X,
  ArrowLeftCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function WaterAlerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  
  const handleAdd = (e) => {
    e.preventDefault();
    const time = e.target.time.value;
    setAlerts([...alerts, time]);
    e.target.reset();
  };

  
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
        { from: "bot", text: data.reply || "No response received." },
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

  
  const handleDelete = (i) => {
    setAlerts(alerts.filter((_, idx) => idx !== i));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-lime-100 to-green-200 relative">
      
      <nav className="sticky top-0 z-30 bg-white/50 backdrop-blur-md border-b border-emerald-200 shadow-sm flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-2">
          <Droplet className="text-emerald-600 w-6 h-6" />
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
            Irrigation Time Alerts
          </h1>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white bg-gradient-to-r from-emerald-500 to-lime-500 hover:scale-105 transition-transform shadow-md active:scale-95"
        >
          <ArrowLeftCircle className="w-4 h-4" /> Back
        </button>
      </nav>

      
      <div className="text-center mt-10 space-y-3">
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-500 to-lime-600 bg-clip-text text-transparent drop-shadow-md">
          ⏰ Smart Irrigation Alerts
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Schedule and manage watering times efficiently with FarmGuard AI 💧
        </p>
        <div className="inline-flex items-center gap-2 bg-white/80 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
          <Sparkles className="w-4 h-4" /> Powered by FarmGuard AI
        </div>
      </div>

      
      <motion.form
        onSubmit={handleAdd}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto mt-10 bg-white/80 backdrop-blur-md border border-emerald-200 shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="time"
          name="time"
          className="flex-1 border border-emerald-300 p-3 rounded-lg text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-emerald-500 to-lime-400 text-white font-semibold px-5 py-2 rounded-lg shadow hover:scale-105 transition-transform"
        >
          Add Alert
        </button>
      </motion.form>

      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="max-w-3xl mx-auto mt-10 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {alerts.length === 0 ? (
          <p className="text-center col-span-full text-emerald-800 font-medium bg-white/70 rounded-2xl py-6 shadow">
            No alerts yet — add one above to get started 💧
          </p>
        ) : (
          alerts.map((time, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gradient-to-br from-emerald-300 via-lime-200 to-green-200 p-[2px] rounded-2xl shadow-md hover:shadow-xl"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 text-emerald-800 mb-3">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-lg">Irrigation Reminder</h3>
                </div>
                <p className="text-gray-800 text-lg font-semibold mb-2">
                  <Clock className="inline-block w-5 h-5 mr-1 text-lime-600" />
                  {time}
                </p>
                <p className="text-sm text-gray-600">
                  💧 Ensure watering during early morning or evening hours.
                </p>

                <button
                  onClick={() => handleDelete(i)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Delete Alert"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl border border-emerald-200 shadow-lg p-8 text-center my-10">
        <h3 className="text-2xl font-bold text-emerald-700 mb-3">
          💡 FarmGuard Irrigation Insights
        </h3>
        <p className="text-gray-800 leading-relaxed">
          FarmGuard AI recommends watering schedules based on crop type, soil
          moisture, and weather forecasts. Following optimized irrigation plans
          can help save up to{" "}
          <span className="text-emerald-600 font-semibold">30% of water</span>{" "}
          and improve soil health 🌱.
        </p>
      </div>

      
      <footer className="text-center py-6 text-emerald-900/80 text-sm">
        © {new Date().getFullYear()} FarmGuard — Smart Farming with AI 🌾
      </footer>

      
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-400 to-lime-400 text-gray-900 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-[9999]"
        >
          <MessageCircle size={26} />
        </button>
      )}

      
      {showChat && (
        <div className="fixed bottom-6 right-6 bg-emerald-950/90 backdrop-blur-xl border border-emerald-400/30 rounded-2xl shadow-2xl w-80 max-h-[70vh] flex flex-col overflow-hidden z-[9999]">
          <div className="flex justify-between items-center bg-emerald-500/20 px-4 py-2 border-b border-emerald-400/30">
            <h3 className="font-bold text-lime-300">FarmGuard AI Assistant 🤖</h3>
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
              placeholder="Ask about irrigation, alerts, or schedules..."
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