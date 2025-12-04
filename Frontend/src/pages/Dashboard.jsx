import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeftCircle, Cpu, Activity, MessageCircle, X } from "lucide-react";
import bg from "../assets/Scenery.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.reply || data.error || "No reply received." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Unable to reach AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { title: "Crop Recognition 🌾", desc: "Upload plant images to identify the crop instantly using AI vision.", link: "/crop-recognizer", color: "from-yellow-400 via-amber-400 to-orange-500" },
    { title: "Water Levels 💧", desc: "Monitor soil moisture and automate irrigation with smart insights.", link: "/water-level", color: "from-blue-400 via-cyan-400 to-emerald-400" },
    { title: "Disease Detection 🦠", desc: "AI scans for plant diseases — detect early, act faster.", link: "/disease-detect", color: "from-red-400 via-pink-400 to-purple-400" },
    { title: "Time Alerts ⏰", desc: "Get reminders for watering, fertilizing, and harvesting schedules.", link: "/alerts", color: "from-indigo-400 via-violet-400 to-fuchsia-400" },
    { title: "Weather Forecast ☁", desc: "Live weather forecasts & rain predictions for your farm.", link: "/weather", color: "from-sky-400 via-teal-400 to-emerald-500" },
    { title: "Drone Live Feed 🚁", desc: "Watch your farm in real-time from your drone camera feed.", link: "/drone-view", color: "from-green-400 via-lime-400 to-emerald-500" },
    { title: "Fertilizer Guide 🧪", desc: "AI suggests fertilizers based on crop type and soil condition.", link: "/fertilizer-guide", color: "from-lime-400 via-green-400 to-emerald-500" },
    { title: "Market Rate 📈", desc: "Get live mandi prices and crop market analytics.", link: "/market-price", color: "from-amber-400 via-orange-400 to-red-400" },
  ];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
     
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 via-emerald-800/70 to-emerald-950/80 backdrop-blur-sm pointer-events-none" />

     
      <div className="relative z-10 min-h-screen text-white">
       
        <nav className="flex justify-between items-center px-8 py-4 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-md">
          <div className="flex items-center gap-2">
            <Cpu className="text-lime-300 w-6 h-6" />
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-lime-300 to-emerald-400 bg-clip-text text-transparent">
              FarmGuard Dashboard
            </h1>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-semibold rounded-full hover:scale-105 transition-transform shadow-lg active:scale-95"
          >
            <ArrowLeftCircle className="w-5 h-5" /> Back
          </button>
        </nav>

       
        <header className="text-center mt-16 mb-10 px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3">
            Welcome,{" "}
            <span className="bg-gradient-to-r from-lime-300 to-emerald-500 bg-clip-text text-transparent">
              Farmer 👨‍🌾
            </span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100">
            AI-Powered Smart Farming Companion — Grow Smarter Every Day 🌾
          </p>

          <div className="inline-flex items-center gap-2 bg-emerald-100/20 border border-emerald-400/30 px-4 py-1 rounded-full text-sm text-lime-300 mt-4">
            <Sparkles className="w-4 h-4 text-lime-300" /> Powered by FarmGuard 
          </div>
        </header>

        
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-8 py-10">
          {features.map((card, i) => (
            <div
              key={i}
              className={`relative group bg-gradient-to-br ${card.color} p-[2px] rounded-2xl hover:scale-105 transition-all duration-500 shadow-xl hover:shadow-emerald-400/40`}
            >
              <div className="relative bg-zinc-900/80 rounded-2xl p-6 h-full backdrop-blur-md flex flex-col justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-200/90 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <Link
                  to={card.link}
                  className="mt-6 inline-block text-center bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-semibold py-2 rounded-lg hover:opacity-90 transition active:scale-95"
                >
                  Open →
                </Link>
              </div>

             
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 bg-white/10 blur-xl transition pointer-events-none" />
            </div>
          ))}
        </section>

       
        <footer className="mt-10 text-center py-6 bg-white/5 backdrop-blur-md border-t border-white/10">
          <div className="flex justify-center items-center gap-2 text-lime-300 mb-2">
            <Activity className="w-5 h-5" />
            <p className="font-semibold">FarmGuard Monitoring Active</p>
          </div>
          <p className="text-sm text-emerald-200/80">
            © {new Date().getFullYear()} FarmGuard — Revolutionizing Precision Agriculture 🌱
          </p>
        </footer>
      </div>

     
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-400 to-lime-400 text-gray-900 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-[9999]"
          style={{ pointerEvents: "auto" }}
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
            {loading && (
              <p className="text-xs text-gray-300 italic">Typing...</p>
            )}
          </div>

          <div className="flex border-t border-emerald-400/20 bg-emerald-900/60">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 bg-transparent text-white outline-none placeholder-gray-400"
              placeholder="Ask something..."
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
};

export default Dashboard;