"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData();
    formData.append("email", email);

    const result = await subscribeToNewsletter(formData);

    if (result?.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage("Thanks for subscribing! Check your inbox for updates.");
      setEmail(""); // Clear the input field
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address..."
          required
          disabled={status === "loading" || status === "success"}
          className="w-full pl-5 pr-32 py-3.5 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#0076c0] focus:ring-1 focus:ring-[#0076c0] disabled:opacity-50 transition-all text-sm md:text-base"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-5 md:px-7 bg-[#0076c0] hover:bg-blue-600 text-white font-bold rounded-full disabled:opacity-70 flex items-center justify-center transition-colors text-sm"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      {/* Dynamic Feedback Message */}
      {message && (
        <div className={`mt-4 flex items-center justify-center gap-2 text-sm font-medium ${
          status === "success" ? "text-emerald-400" : "text-red-400"
        }`}>
          {status === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message}
        </div>
      )}
    </div>
  );
}
