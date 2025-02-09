"use client";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Bot, User } from "lucide-react";

export default function AI() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "What can I ask you to do?", sender: "user" },
    { text: "Ask me anything about wildfires!", sender: "ai" },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchAIResponse = async (userMessage) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data.answer || "I'm not sure how to respond to that.";
      } else {
        const text = await response.text();
        return `Unexpected response: ${text}`;
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, something went wrong.";
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "user" },
    ]);

    const userMessage = message;
    setMessage("");

    // Fetch AI response
    const aiResponse = await fetchAIResponse(userMessage);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: aiResponse, sender: "ai" },
    ]);
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center p-4 md:p-8 overflow-hidden 
      bg-[radial-gradient(circle_at_50%_50%,rgba(155,135,245,0.2)_3%,transparent_40%),radial-gradient(circle_at_50%_50%,#111111_0%,#000000_60%)]"
    >

      {/* Messages */}
      <main className="flex-1 w-full max-w-4xl my-8 overflow-y-auto scrollbar-custom">
        <div className="w-full max-w-4xl flex flex-col items-center space-y-4 pt-8 mb-10">
          <div className="sparkle-animation">
            <Sparkles className="w-8 h-8 text-white/80" />
          </div>
          <h1 className="text-4xl font-light tracking-wide text-white/90">
            Ask AI
          </h1>
        </div>
        <div className="flex flex-col gap-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`w-full max-w-3xl ${msg.sender === "user" ? "self-end" : "self-start"
                }`}
            >
              {msg.sender === "user" ? (
                <div>
                  <p className="text-xs text-white/60 mb-1">YOU</p>
                  <div className="flex items-center p-3 bg-gray-600 text-white rounded-xl text-sm">
                    <User className="w-5 h-5 text-white mr-2" />
                    <span>{msg.text}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-white/60 mb-1 self-end">AI</p>
                  <div className="flex items-center p-3 bg-gray-700 text-white rounded-xl text-sm">
                    <Bot className="w-5 h-5 text-white mr-2" />
                    <span>{msg.text}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Sparkles className="w-5 h-5 text-white/40" />
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything about wildfires..."
              className="w-full px-12 py-4 bg-white rounded-xl pr-12 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}