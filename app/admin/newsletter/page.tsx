"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { 
  Users, 
  Send, 
  Upload, 
  UserPlus, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileSpreadsheet 
} from "lucide-react";
import { 
  getSubscribers, 
  addSingleSubscriber, 
  batchImportSubscribers, 
  sendBroadcastEmail,
  Subscriber 
} from "@/lib/actions/adminNewsletter";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual Add State
  const [singleEmail, setSingleEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addStatus, setAddStatus] = useState<{ success?: string; error?: string }>({});

  // File Upload State
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success?: string; error?: string }>({});

  // Broadcast Email State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ success?: string; error?: string }>({});

  // Fetch list on mount
  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    setLoading(true);
    const data = await getSubscribers();
    setSubscribers(data);
    setLoading(false);
  }

  // Handle Manual Add
  async function handleAddSingle(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddStatus({});

    const res = await addSingleSubscriber(singleEmail);
    if (res.error) {
      setAddStatus({ error: res.error });
    } else {
      setAddStatus({ success: "Subscriber added to D1 and Brevo!" });
      setSingleEmail("");
      loadSubscribers();
    }
    setAddLoading(false);
  }

  // Handle Excel / CSV File Upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadStatus({});

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[];

      // Flatten and extract emails from rows
      const extractedEmails: string[] = [];
      rawRows.forEach((row) => {
        if (Array.isArray(row)) {
          row.forEach((cell) => {
            if (typeof cell === "string" && cell.includes("@")) {
              extractedEmails.push(cell.trim());
            }
          });
        }
      });

      if (extractedEmails.length === 0) {
        setUploadStatus({ error: "No emails found in the uploaded file." });
        setUploadLoading(false);
        return;
      }

      const res = await batchImportSubscribers(extractedEmails);
      if (res.error) {
        setUploadStatus({ error: res.error });
      } else {
        setUploadStatus({ success: `Successfully imported ${res.count} contacts into D1 & Brevo!` });
        loadSubscribers();
      }
    } catch (err) {
      console.error(err);
      setUploadStatus({ error: "Failed to parse file. Make sure it is an Excel or CSV file." });
    }
    setUploadLoading(false);
    e.target.value = ""; // Reset file input
  }

  // Handle Broadcast Submission
  async function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm(`Are you sure you want to send this broadcast to ALL ${subscribers.length} subscribers?`)) {
      return;
    }

    setSendLoading(true);
    setSendStatus({});

    const res = await sendBroadcastEmail(subject, message);
    if (res.error) {
      setSendStatus({ error: res.error });
    } else {
      setSendStatus({ success: `Broadcast successfully sent to ${res.count} subscribers!` });
      setSubject("");
      setMessage("");
    }
    setSendLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Mail className="w-7 h-7 text-[#0076c0]" /> Email Marketing & Broadcasts
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage subscribers and send promotional broadcasts via Brevo & Cloudflare D1.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-5 py-3 rounded-xl">
          <Users className="w-6 h-6 text-[#0076c0]" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Subscribers</p>
            <p className="text-xl font-black text-[#0076c0]">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : subscribers.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Add Contacts (Manual & Excel) */}
        <div className="space-y-6">
          
          {/* Manual Add Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#0076c0]" /> Add Contact Manually
            </h2>

            <form onSubmit={handleAddSingle} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={singleEmail}
                  onChange={(e) => setSingleEmail(e.target.value)}
                  placeholder="customer@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0076c0]"
                />
              </div>

              <button 
                type="submit" 
                disabled={addLoading}
                className="w-full bg-[#0076c0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save to D1 & Brevo"}
              </button>

              {addStatus.success && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {addStatus.success}
                </div>
              )}
              {addStatus.error && (
                <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {addStatus.error}
                </div>
              )}
            </form>
          </div>

          {/* Import Excel / CSV Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#0076c0]" /> Import Excel / CSV
            </h2>
            <p className="text-xs text-gray-500">
              Upload a sheet containing emails. The system auto-extracts contacts and writes them to Brevo and Cloudflare D1.
            </p>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 hover:border-[#0076c0] bg-gray-50 hover:bg-blue-50/40 rounded-2xl cursor-pointer transition-colors p-4 text-center">
              {uploadLoading ? (
                <div className="flex flex-col items-center gap-2 text-[#0076c0]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-bold">Processing file...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs font-bold text-gray-700">Click to upload spreadsheet</span>
                  <span className="text-[10px] text-gray-400">.XLSX, .XLS, or .CSV</span>
                </div>
              )}
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileUpload} 
                disabled={uploadLoading}
                className="hidden" 
              />
            </label>

            {uploadStatus.success && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {uploadStatus.success}
              </div>
            )}
            {uploadStatus.error && (
              <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {uploadStatus.error}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Send Broadcast Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-[#0076c0]" /> Compose Broadcast Message
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Send an email campaign to all {subscribers.length} subscribers in your list.
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject Line</label>
              <input 
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. 🔥 Massive iPhone Discounts at Essyrise Electronics!"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0076c0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message Body</label>
              <textarea 
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement or deal details here..."
                required
                className="w-full p-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0076c0] leading-relaxed"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={sendLoading || subscribers.length === 0}
              className="w-full md:w-auto px-8 py-3.5 bg-[#0076c0] hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {sendLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending Broadcast...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Broadcast ({subscribers.length} Recipients)
                </>
              )}
            </button>

            {sendStatus.success && (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> {sendStatus.success}
              </div>
            )}
            {sendStatus.error && (
              <div className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" /> {sendStatus.error}
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
