"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { loginAdmin } from "@/lib/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await loginAdmin(formData);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-brand-charcoal mb-2">Admin Access</h1>
        <p className="text-gray-500 text-sm mb-8">Enter your secure password to access the Essyrise dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              name="password"
              required
              placeholder="Enter password" 
              className="w-full text-center text-lg py-3 rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-70"
          >
            {isLoading ? "Verifying..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
