import React from "react";
import {
  Droplet,
  Leaf,
  Info,
  Waves,
  Clock,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function WaterLevels() {
  const data = [
    {
      crop: "Wheat",
      level: 60, // percent
      advice: "Irrigate every 12–15 days for optimal yield.",
      color: "from-yellow-300 via-amber-400 to-orange-400",
      emoji: "🌾",
      next: "3 days",
      health: 85,
    },
    {
      crop: "Rice",
      level: 90,
      advice: "Maintain 2–5 cm standing water in the field.",
      color: "from-blue-400 via-cyan-400 to-emerald-400",
      emoji: "🌾",
      next: "2 days",
      health: 95,
    },
    {
      crop: "Sugarcane",
      level: 70,
      advice: "Irrigate every 10 days; avoid waterlogging.",
      color: "from-green-400 via-emerald-500 to-teal-500",
      emoji: "🍃",
      next: "5 days",
      health: 80,
    },
    {
      crop: "Maize",
      level: 40,
      advice: "Light irrigation every 7–8 days during flowering.",
      color: "from-orange-400 via-yellow-400 to-amber-300",
      emoji: "🌽",
      next: "1 day",
      health: 75,
    },
  ];

  return (
    <div className="p-10 bg-gradient-to-b from-emerald-300 via-blue-200 to-emerald-400 min-h-screen flex flex-col items-center">
      
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
          💧 Smart Water Level Dashboard
        </h2>
        <p className="text-black text-lg">
          Real-time AI irrigation insights for sustainable farming 🌱
        </p>
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Powered by FarmGuard 
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl w-full">
        {data.map((item, index) => (
          <div
            key={index}
            className={`relative group overflow-hidden rounded-2xl p-6 bg-gradient-to-tr ${item.color} shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500 text-white border border-white/20 backdrop-blur-lg`}
          >
            
            <div className="absolute inset-0 opacity-20">
              <Waves className="w-full h-full text-white/40 animate-pulse" />
            </div>

            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-extrabold flex items-center gap-2">
                  {item.emoji} {item.crop}
                </h3>
                <Droplet className="w-6 h-6 opacity-80" />
              </div>

              
              <div className="mt-2 mb-4 bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                <div
                  className="h-4 rounded-full bg-white/70 transition-all duration-700"
                  style={{ width: `${item.level}% `}}
                />
              </div>

              <div className="flex justify-between text-sm font-semibold mb-3 text-white/90">
                <p>Water Level: {item.level}%</p>
                <p>Next: {item.next}</p>
              </div>

              <p className="flex items-start gap-2 text-sm text-white/90 mb-3 leading-relaxed">
                <Info className="w-4 h-4 mt-[2px] text-white/70" /> {item.advice}
              </p>

              
              <div className="flex items-center justify-between bg-white/20 rounded-xl px-3 py-2 text-sm backdrop-blur-md">
                <span className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-white/80" /> Health Score
                </span>
                <span className="font-bold">{item.health}% 🌿</span>
              </div>

              {/* Stats Bar */}
              <div className="flex justify-between text-xs mt-2 opacity-80">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> Last checked: 2h ago
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 size={12} /> AI calibrated
                </span>
              </div>
            </div>

            
            <div className="absolute inset-0 opacity-0 group-hover:opacity-40 bg-white/20 blur-2xl transition" />
          </div>
        ))}
      </div>

       
      <div className="mt-16 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-5xl text-center">
        <h3 className="text-2xl font-bold text-emerald-700 mb-3">
          💡 AI Irrigation Summary
        </h3>
        <p className="text-gray-800 max-w-3xl mx-auto leading-relaxed">
          Based on real-time soil moisture and temperature analytics, FarmGuard AI
          recommends dynamic irrigation intervals. Farmers can save up to{" "}
          <span className="text-emerald-600 font-semibold">25% of water</span> and
          increase yield consistency by{" "}
          <span className="text-emerald-600 font-semibold">15-20%</span>.
        </p>
      </div>

      <p className="mt-10 text-sm text-gray-800">
        © {new Date().getFullYear()} FarmGuard — AI Precision Agriculture for the Future 🌾
      </p>
    </div>
  );
}