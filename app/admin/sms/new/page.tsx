"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, AlertTriangle } from "lucide-react";
import { launchSmsCampaign } from "@/lib/actions/sms";

export default function NewSmsCampaignPage() {
  const [message, setMessage] = useState("Hello {name}, check out our latest offers at Essyrise Electronics!");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      await launchSmsCampaign(formData);
      // The server action handles the redirect on success
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to launch campaign. Check your API credentials and balance.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/sms" className="p-2 text-gray-400 hover:text-brand-primary hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">New SMS Campaign</h1>
          <p className="text-gray-500 text-sm mt-1">Broadcast to all opted-in customers.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-bold text-brand-charcoal mb-2">Campaign Name (Internal)</label>
          <input 
            required 
            name="campaign_name" 
            type="text" 
            placeholder="e.g., Weekend Accessory Sale"
            className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-bold text-brand-charcoal">Message Template</label>
            <span className={`text-xs font-bold ${message.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
              {message.length} chars {message.length > 160 && '(Will use >1 SMS unit)'}
            </span>
          </div>
          
          <textarea 
            required 
            name="message" 
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
          ></textarea>
          
          <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs font-bold text-gray-600 mb-1">Supported Variables:</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setMessage(m => m + " {name}")} className="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:border-brand-primary">{"{name}"}</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Example: <i>"Hello John..."</i></p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-brand-surface rounded-xl border border-brand-primary/20 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-brand-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-charcoal">Sending to all opted-in customers</p>
            <p className="text-xs text-gray-500 mt-0.5">Contacts without phone numbers will be skipped.</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
          <Link href="/admin/sms" className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={isSubmitting || message.length === 0}
            className="bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Dispatching..." : "Send Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
