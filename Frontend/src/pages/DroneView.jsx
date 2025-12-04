import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  MapPin,
  Battery,
  Wifi,
  Gauge,
  Video,
  ArrowLeftCircle,
  MessageCircle,
  X,
  Sparkles,
  Navigation,
  LandPlot,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function DroneView() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [battery] = useState(87);
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const [gps] = useState("Fix ✅");
  const [status, setStatus] = useState("Connecting…");

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // 🌐 Stream logic
  const envBase = import.meta.env.VITE_STREAM_BASE;
  const envPath = import.meta.env.VITE_STREAM_PATH || "/live/drone/stream/index.m3u8";
  const derivedHost = (() => {
    if (typeof window !== "undefined" && window.location?.hostname) {
      const proto = window.location.protocol;
      const host = window.location.hostname;
      return `${proto}//${host}:8888`;
    }
    return null;
  })();
  const STREAM_BASE = envBase || derivedHost || "http://10.18.12.11:8888";
  const STREAM_URL = `${STREAM_BASE.replace(/\/$/, "")}${envPath}`;

  // ⚙ FPS counter
  useEffect(() => {
    let last = performance.now();
    let frames = 0;
    let raf;
    const tick = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 📺 Stream attach
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attach = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({ maxBufferLength: 10, enableWorker: true, lowLatencyMode: true });
        hlsRef.current = hls;

        hls.loadSource(STREAM_URL);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setStatus("Live");
          video.play().catch(() => {});
        });

        hls.on(Hls.Events.FRAG_LOADED, (_e, data) => {
          if (data?.stats?.tfirst) {
            const segLatencyMs = Date.now() - data.stats.tfirst;
            setLatency(Math.max(0, Math.round(segLatencyMs)));
          }
        });

        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data?.fatal) {
            setStatus("Disconnected — reconnecting...");
            hls.destroy();
            setTimeout(attach, 1500);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = STREAM_URL;
        video.addEventListener("loadedmetadata", () => {
          setStatus("Live");
          video.play().catch(() => {});
        });
      } else {
        setStatus("HLS not supported");
      }
    };

    attach();
    return () => {
      hlsRef.current?.destroy();
    };
  }, [STREAM_URL]);

  // 🧠 Chat send
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
      setMessages((prev) => [...prev, { from: "bot", text: data.reply || "No reply." }]);
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
    <div className="w-screen h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-black text-white relative overflow-hidden">
      {/* Nav */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-gradient-to-b from-black/70 to-transparent z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="text-lime-400 w-6 h-6" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-lime-300 to-emerald-400 bg-clip-text text-transparent">
            Drone Live Feed
          </h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-semibold rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          <ArrowLeftCircle className="w-5 h-5" /> Back
        </button>
      </nav>

      {/* Video Feed */}
      <div className="w-full h-full flex items-center justify-center relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          controls
          className="w-full h-full object-cover rounded-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-black/70" />
      </div>

      {/* Telemetry HUD */}
      <div className="absolute top-0 w-full flex justify-between px-6 py-4 text-sm font-medium">
        <div className="flex gap-4 items-center">
          <Battery className="w-5 h-5 text-lime-400" /> {battery}%
          <Wifi className="w-5 h-5 text-cyan-300" /> {latency}ms
          <Gauge className="w-5 h-5 text-emerald-300" /> {fps} FPS
        </div>
        <div className="flex gap-2 items-center">
          <MapPin className="w-5 h-5 text-lime-300" /> {gps}
          <span
            className={`ml-3 px-2 py-1 rounded-xl ${
              status === "Live" ? "bg-green-600" : "bg-yellow-600"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Bottom Controls */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-5"
      >
        <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-gray-900 font-semibold hover:scale-105 transition">
          <Navigation size={16} /> Takeoff
        </button>
        <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-400 text-white font-semibold hover:scale-105 transition">
          <LandPlot size={16} /> Land
        </button>
        <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-300 text-gray-900 font-semibold hover:scale-105 transition">
          <Video size={16} /> Record
        </button>
      </motion.div>

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
              placeholder="Ask about drones, setup, or AI help..."
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