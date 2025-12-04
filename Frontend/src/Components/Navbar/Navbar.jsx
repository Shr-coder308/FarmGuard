import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  LogOut,
  User,
  ChevronDown,
  ChevronUp,
  Leaf,
  Sparkles,
  Sun,
} from "lucide-react";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // backend logic 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErr("");
    if (!email || !password || (!isLogin && !name)) {
      setFormErr("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const URL = isLogin
        ? "http://localhost:5000/login"
        : "http://localhost:5000/signup";
      const body = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.message?.startsWith("❌")) {
        setFormErr(data.message);
      } else {
        if (isLogin && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.user?.name || email);
          setUsername(data.user?.name || email);
          setShowModal(false);
        } else setIsLogin(true);
      }
    } catch {
      setFormErr("Network issue — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background image with blur */}
      <div
        className="fixed inset-0 -z-10 bg-no-repeat bg-center bg-[length:100%_100%]"
        style={{
          backgroundImage: "url('/Farmguard.jpg')",
          filter: "blur(2px) brightness(0.9)",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      {/* Sunlight glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-yellow-200/30 blur-[100px] animate-pulse rounded-full" />
        <div className="absolute top-0 right-1/3 w-56 h-56 bg-orange-300/20 blur-[120px] animate-pulse-slow rounded-full" />
      </div>

      {/*Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-lime-200/20 shadow-md">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-lime-100 drop-shadow-md flex items-center gap-2">
            <Sun className="text-yellow-300 animate-spin-slow" size={22} />
            Farm<span className="text-white">Guard</span>
          </h1>

          {username ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-700/80 hover:bg-green-600 transition text-white font-semibold shadow-lg"
              >
                <div className="bg-white text-green-700 font-bold w-8 h-8 rounded-full grid place-content-center">
                  {username.charAt(0).toUpperCase()}
                </div>
                {showProfileMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-black/60 backdrop-blur-xl border border-lime-400/20 rounded-2xl p-3 text-white shadow-2xl">
                  <p className="text-sm px-2 opacity-80 mb-2">
                    Welcome, <b>{username.split(" ")[0]}</b>
                  </p>
                  <a
                    href="/dashboard"
                    className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition"
                  >
                    <User size={16} /> Dashboard
                  </a>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      setUsername(null);
                    }}
                    className="w-full text-left flex items-center gap-2 hover:bg-red-500/10 px-3 py-2 rounded-lg text-red-300 transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setShowModal(true);
                setIsLogin(true);
              }}
              className="px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-yellow-300 to-lime-200 text-green-900 shadow-md hover:scale-105 transition"
            >
              Sign In
            </button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center text-white px-6 relative">
        <h2 className="text-6xl font-extrabold leading-tight text-lime-100 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] animate-glow">
          Empowering Farmers with AI 🌾
        </h2>

        <p className="mt-5  text-yellow-600 font-semibold text-lg max-w-2xl mx-auto leading-relaxed">
          From sunrise to harvest — monitor, predict, and grow smarter with FarmGuard.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-5">
          {username ? (
            <a
              href="/dashboard"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-300 to-lime-200 text-green-900 font-bold shadow-lg hover:scale-105 transition-all"
            >
              Go to Dashboard
            </a>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-300 to-lime-200 text-green-900 font-bold shadow-lg hover:scale-105 transition-all"
            >
              Get Started
            </button>
          )}

          <button
            className="px-8 py-3 rounded-full border border-lime-300 text-white font-semibold hover:bg-white/10 transition-all"
            onClick={() => alert('Please login to explore features.')}
            disabled={!!username}
          >
            Explore Features
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-3 text-black/80 text-sm">
          <Leaf className="w-5 h-5 animate-bounce text-lime-300" />
          <p>
            Sustainable • Smart • AI-Powered — <b>FarmGuard 2025</b>
          </p>
          <Sparkles className="w-5 h-5 animate-pulse text-yellow-300" />
        </div>
      </section>

      {/* Auth Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black/50 backdrop-blur-2xl border border-lime-300/30 rounded-2xl shadow-2xl w-full max-w-md p-8 text-white"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white"
            >
              ✖
            </button>

            <h2 className="text-3xl font-extrabold text-center mb-4 text-lime-100">
              {isLogin ? "Welcome Back 👨‍🌾" : "Join FarmGuard 🌱"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 rounded-lg bg-white/10 border border-lime-300/30 focus:ring-2 focus:ring-lime-300 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-white/10 border border-lime-300/30 focus:ring-2 focus:ring-lime-300 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 rounded-lg bg-white/10 border border-lime-300/30 pr-10 focus:ring-2 focus:ring-lime-300 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formErr && (
                <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 p-2 rounded-lg text-center">
                  {formErr}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-300 to-lime-200 text-green-900 font-bold hover:scale-105 transition-all shadow-lg"
              >
                {loading ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
              </button>

              <p className="text-center text-white/80 mt-3">
                {isLogin ? "No account?" : "Already have one?"}{" "}
                <button
                  type="button"
                  className="text-lime-200 underline underline-offset-2 hover:text-yellow-200"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;