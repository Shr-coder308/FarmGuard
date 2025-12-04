import React, { useState } from "react";
import {
  ArrowLeftCircle,
  Upload,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  MessageCircle,
  Cpu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DiseaseDetect() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const navigate = useNavigate();

  // Upload handler
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setErr("");
  };

  // Disease detection API
  const detectDisease = async () => {
    if (!image) {
      setErr("Please upload an image first.");
      return;
    }

    setLoading(true);
    setErr("");
    setResult(null);

    const form = new FormData();
    form.append("file", image);

    try {
      const res = await fetch("http://127.0.0.1:5001/detect-disease", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErr(data.error || "Server error");
      } else {
        setResult(data);
      }
    } catch {
      setErr("⚠ Cannot reach backend. Start AI server.");
    } finally {
      setLoading(false);
    }
  };

  // Chat handler
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
        { from: "bot", text: data.reply || "No reply." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Unable to reach AI server." },
      ]);
    }

    setChatLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-red-200 via-orange-100 to-yellow-100">

      {/* NAVBAR */}
      <div className="sticky top-0 z-20 bg-white/50 backdrop-blur-lg border-b border-red-300 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <Cpu className="text-red-600" />
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              🦠 Disease Detection
            </h1>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white hover:scale-105 transition shadow-md"
          >
            <ArrowLeftCircle size={18} /> Back
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* UPLOAD SECTION */}
        <div className="bg-white/80 backdrop-blur-lg border border-red-300 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-red-700">Upload Leaf Image</h2>
          <p className="text-sm text-gray-700 mt-1">
            AI detects possible diseases from leaf photos.
          </p>

          <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-red-400 rounded-xl mt-4 cursor-pointer hover:bg-red-50 transition">
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            <ImageIcon className="w-10 h-10 text-red-600 mb-2" />
            <span className="font-semibold text-red-700">Click to upload or drag image</span>
          </label>

          {preview && (
            <img
              src={preview}
              className="mt-4 rounded-xl border border-red-300 shadow-sm object-cover h-64 w-full"
            />
          )}

          <button
            onClick={detectDisease}
            disabled={loading || !image}
            className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Detect Disease"}
          </button>

          {err && <p className="mt-4 text-red-600">{err}</p>}
        </div>

        {/* RESULT SECTION */}
        <div className="bg-white/80 backdrop-blur-lg border border-red-300 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-red-700">AI Result</h2>

          {!result && !loading && (
            <p className="mt-4 text-gray-700">Upload a leaf image to analyze disease.</p>
          )}

          {result && (
            <div className="mt-4 p-5 rounded-xl bg-red-50 border border-red-300 shadow-inner">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-bold text-lg text-red-800">{result.disease}</p>
                  <p className="text-gray-600">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </p>
                </div>
              </div>

              <p className="mt-3 text-gray-800 leading-relaxed">
                💡 <b>Treatment:</b> {result.solution}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CHATBOT FLOATING BUTTON */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-red-400 to-orange-400 text-white shadow-xl hover:scale-110 transition z-[9999]"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* CHATBOT POPUP */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-80 bg-red-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-red-400 flex flex-col max-h-[70vh] overflow-hidden z-[9999]">

          {/* Chat Header */}
          <div className="flex justify-between items-center p-3 border-b border-red-300">
            <h3 className="font-bold text-red-200">FarmGuard Assistant 🤖</h3>
            <button
              className="text-red-200 hover:text-white"
              onClick={() => setShowChat(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="p-3 flex-1 overflow-y-auto space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-3 py-2 rounded-lg ${
                  m.from === "user"
                    ? "bg-red-300 text-red-900 self-end ml-auto"
                    : "bg-white/20 text-white"
                }`}
              >
                {m.text}
              </div>
            ))}

            {chatLoading && (
              <p className="text-xs text-red-200 italic">Typing...</p>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex border-t border-red-300 bg-red-900/60">
            <input
              className="flex-1 bg-transparent text-white p-2 outline-none placeholder-red-300"
              placeholder="Ask disease or crop..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="px-4 text-red-200 hover:text-white font-semibold"
              onClick={handleSend}
            >
              Send
            </button>
          </div>

        </div>
      )}

    </div>
  );
}  