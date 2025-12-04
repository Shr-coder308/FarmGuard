import React, { useState } from "react";
import {
  Leaf,
  Sprout,
  Clock,
  FlaskRound,
  Sparkles,
  MessageCircle,
  X,
  ArrowLeftCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function FertilizerGuide() {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const tips = [
    {
      crop: "🌾 Wheat",
      type: "NPK 20:20:0 + Urea",
      timing: "Before sowing and mid-growth stage",
      desc: "Boosts nitrogen and phosphorus for root and tiller growth.",
      color: "from-amber-300 via-yellow-400 to-orange-300",
    },
    {
      crop: "🌾 Rice",
      type: "Urea + DAP (Di-Ammonium Phosphate)",
      timing: "2 weeks after transplanting",
      desc: "Enhances early tillering and improves grain formation.",
      color: "from-green-300 via-emerald-400 to-teal-300",
    },
    {
      crop: "🥔 Potato",
      type: "NPK 10:26:26 + Potash",
      timing: "At planting and tuber initiation stage",
      desc: "Improves tuber quality and starch accumulation.",
      color: "from-red-300 via-pink-400 to-rose-300",
    },
    {
      crop: "🌽 Maize",
      type: "NPK 15:15:15 + Urea",
      timing: "Basal + 30 days after sowing",
      desc: "Ensures balanced nutrient supply for cob formation.",
      color: "from-yellow-300 via-amber-400 to-lime-300",
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-lime-100 to-green-200 relative">
     
      <nav className="sticky top-0 z-30 bg-white/50 backdrop-blur-md border-b border-emerald-200 shadow-sm flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-2">
          <FlaskRound className="text-emerald-600 w-6 h-6" />
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
            Fertilizer Guide
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
          🌱 Smart Fertilizer Recommendations
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Get optimized fertilizer combinations and application timings for each
          crop — powered by FarmGuard AI 💚
        </p>
        <div className="inline-flex items-center gap-2 bg-white/80 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
          <Sparkles className="w-4 h-4" /> Powered by FarmGuard AI
        </div>
      </div>

      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-8 py-12 max-w-7xl mx-auto"
      >
        {tips.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={`relative group bg-gradient-to-br ${item.color} p-[2px] rounded-2xl shadow-lg hover:shadow-2xl`}
          >
            <div className="bg-white/80 rounded-2xl p-6 h-full backdrop-blur-lg flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-emerald-700 mb-2 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-lime-500" /> {item.crop}
                </h3>
                <p className="text-gray-800 font-semibold mb-1">
                  ✅ Fertilizer: <span className="font-normal">{item.type}</span>
                </p>
                <p className="text-gray-700 mb-3">
                  🕒 Timing: <span className="font-normal">{item.timing}</span>
                </p>
                <p className="text-sm text-gray-700/90 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center justify-between bg-emerald-100/50 border border-emerald-300 rounded-xl px-3 py-2 mt-5 text-sm font-semibold text-emerald-800">
                <Clock className="w-4 h-4 text-emerald-600" />{" "}
                <span>AI Recommended</span>
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-white/30 blur-2xl transition pointer-events-none" />
          </motion.div>
        ))}
      </motion.div>

     
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl border border-emerald-200 shadow-lg p-8 text-center mb-10">
        <h3 className="text-2xl font-bold text-emerald-700 mb-3">
          💡 FarmGuard AI Fertilizer Insights
        </h3>
        <p className="text-gray-800 leading-relaxed">
          Based on real-time soil conditions, temperature, and crop stage,
          FarmGuard AI suggests fertilizer mixes to improve soil fertility and
          reduce cost. Using organic compost along with NPK boosts yield and
          soil structure health 🌾.
        </p>
      </div>

      
      <footer className="text-center py-6 text-emerald-900/80 text-sm">
        © {new Date().getFullYear()} FarmGuard — Smart Farming with AI 🌿
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
              placeholder="Ask about fertilizers or crops..."
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