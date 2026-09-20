"use client";

import { useState } from "react";
import { subscribeEmail } from "@/lib/actions/newsletter";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      await subscribeEmail(new FormData(e.currentTarget));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <p className="text-brand-coral font-bold text-sm">Thanks for subscribing! We'll keep you updated.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input 
        type="email" 
        name="email"
        required 
        placeholder="Enter your email" 
        className="bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2 w-full focus:ring-brand-coral focus:border-brand-coral text-sm"
      />
      <button 
        type="submit" 
        disabled={status === "loading"}
        className="bg-brand-coral hover:bg-brand-accent text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm disabled:opacity-50"
      >
        Join
      </button>
    </form>
  );
}
