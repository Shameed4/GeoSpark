"use client";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Send } from "lucide-react";

export default function AI() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "What can I ask you to do?", sender: "user" },
    { text: "Ask me anything about wildfires", sender: "ai" },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add the new user message to the state
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: "user" }]);
    setMessage("");

    // Simulate an AI response after a brief delay (for now)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "I can help with wildfire information!", sender: "ai" },
      ]);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-end p-4 md:p-8 bg-[radial-gradient(circle_at_50%_50%,rgba(155,135,245,0.2)_3%,transparent_40%),radial-gradient(circle_at_50%_50%,#111111_0%,#000000_60%)]">
      <div className="w-full max-w-4xl flex flex-col items-center space-y-4 pt-8">
        <div className="sparkle-animation">
          <Sparkles className="w-8 h-8 text-white/80" />
        </div>
        <h1 className="text-4xl font-light tracking-wide text-white/90">Ask AI</h1>
      </div>

      <div className="mt-10 flex-1 w-full max-w-4xl flex flex-col-reverse gap-4 mb-8 h-[40vh] overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`w-full max-w-3xl p-3 rounded-xl text-sm ${
                msg.sender === "user" ? "bg-gray-600 text-white self-end" : "bg-gray-700 text-white self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="w-full max-w-4xl mt-8">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Sparkles className="w-5 h-5 text-white/40" />
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything about wildfires"
              className="w-full px-12 py-4 bg-white rounded-xl pr-12 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 input-animation"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 input-animation disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
      <div className="h-8"></div>
    </div>
  );
}
