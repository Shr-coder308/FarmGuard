import React, { useState } from "react";
import {
  ArrowLeftCircle,
  Upload,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Cpu,
  MessageCircle,
  X,
  Sparkles,
  Leaf,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function CropRecognizer() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const navigate = useNavigate();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setErr("");
  };

  const detect = async () => {
    if (!image) {
      setErr("Please select an image first.");
      return;
    }
    setLoading(true);
    setErr("");
    setResult(null);

    const form = new FormData();
    form.append("file", image);

    try {
      const res = await fetch("http://127.0.0.1:5001/detect-crop", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErr(data.error || "Server error");
      } else {
        setResult(data);
      }
    } catch (e) {
      setErr("⚠ Cannot reach AI server. Start backend first.");
    } finally {
      setLoading(false);
    }
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
        { from: "bot", text: data.reply || data.error || "No reply received." },
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
    <div className="relative bg-gradient-to-b from-emerald-300 via-green-200 to-lime-300 min-h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-white/50 backdrop-blur-lg border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Cpu className="text-emerald-600 w-6 h-6" />
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
              🌿 Crop Recognition
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white bg-gradient-to-r from-emerald-500 to-lime-500 hover:scale-105 transition-transform shadow-md active:scale-95"
          >
            <ArrowLeftCircle className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow py-10 px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent drop-shadow-md">
            🌾 Smart Crop Detection
          </h2>
          <p className="text-gray-800 text-lg">
            Upload your plant or leaf photo to identify the crop instantly using
            FarmGuard AI 🌱
          </p>
          <div className="inline-flex items-center gap-2 bg-white/80 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
            <Sparkles className="w-4 h-4" />
            Powered by FarmGuard 
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white/70 backdrop-blur-lg border border-emerald-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-emerald-700 mb-2">
              Upload Plant Image
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a clear image of the plant or leaf. Supported formats: JPG,
              PNG.
            </p>

            {/* Dropzone */}
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-emerald-400 rounded-xl cursor-pointer hover:bg-emerald-50/60 transition-all">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFile}
              />
              <ImageIcon className="w-10 h-10 text-emerald-600 mb-2" />
              <span className="font-semibold text-emerald-700">
                Click to upload or drag & drop
              </span>
              <span className="text-xs text-emerald-600/70 mt-1">
                AI works best with leaf close-up images.
              </span>
            </label>

            {/* Preview */}
            {preview && (
              <div className="mt-5">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-64 object-cover rounded-xl border border-emerald-200 shadow-md"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={detect}
                disabled={loading || !image}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white
                           bg-gradient-to-r from-emerald-500 to-lime-500 hover:opacity-90 disabled:opacity-60 transition-all shadow-md active:scale-95"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {loading ? "Detecting..." : "Detect Crop"}
              </button>
              <button
                onClick={() => {
                  setImage(null);
                  setPreview("");
                  setResult(null);
                  setErr("");
                }}
                className="px-4 py-2 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition"
              >
                Reset
              </button>
            </div>

            {/* Error */}
            {err && <div className="mt-4 text-red-600 text-sm">{err}</div>}
          </div>

          {/* Result Section */}
          <div className="bg-white/70 backdrop-blur-lg border border-emerald-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-emerald-700 mb-2">
              AI Recognition Result
            </h3>

            {!result && !loading && (
              <p className="text-gray-700 mt-4">
                Upload an image and click <b>Detect Crop</b> to view AI results
                here 🌱
              </p>
            )}

            {result && (
              <div className="mt-6 p-5 bg-gradient-to-br from-emerald-100 via-green-50 to-lime-100 rounded-xl border border-emerald-200 shadow-inner">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <div className="text-lg font-bold text-emerald-800">
                      {result.crop}
                    </div>
                    <div className="text-sm text-gray-700">
                      Confidence: {Math.round(result.confidence * 100)}%
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  🌿 The AI identified your crop as <b>{result.crop}</b>. For
                  best results, ensure clear daylight images and proper focus on
                  leaves.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-emerald-900/80 text-sm">
        © {new Date().getFullYear()} FarmGuard — AI-Powered Smart Farming 🌾
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
              placeholder="Ask about crops, water, or AI..."
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