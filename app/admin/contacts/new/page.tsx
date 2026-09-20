"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, FileSpreadsheet, UploadCloud } from "lucide-react";
import { createContact, importContactsCsv } from "@/lib/actions/contacts";
import { useRouter } from "next/navigation";

export default function AddContactsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<string | null>(null);

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createContact(new FormData(e.currentTarget));
    } catch (error) {
      console.error(error);
      alert("Failed to save contact.");
      setIsSubmitting(false);
    }
  };

  const handleCsvImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await importContactsCsv(formData);
      setImportResult(`Successfully imported ${res.count} contacts! Redirecting...`);
      setTimeout(() => router.push("/admin/contacts"), 1500);
    } catch (error) {
      console.error(error);
      alert("Failed to parse and import file.");
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/contacts" className="p-2 text-gray-400 hover:text-brand-primary hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Add Contacts</h1>
          <p className="text-gray-500 text-sm mt-1">Add individual customers manually or upload an Excel/CSV list.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* MANUAL ENTRY CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-purple-50 text-brand-primary rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-brand-charcoal">Manual Entry</h2>
              <p className="text-xs text-gray-400">Add one customer at a time</p>
            </div>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Full Name *</label>
                <input required name="name" type="text" placeholder="e.g. Grace Namubiru" className="w-full rounded-lg border-gray-300 text-sm focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Phone Number *</label>
                <input required name="phone" type="tel" placeholder="0700 000 000" className="w-full rounded-lg border-gray-300 text-sm focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Location</label>
                <input name="location" type="text" defaultValue="Mbarara" className="w-full rounded-lg border-gray-300 text-sm focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Specific Address</label>
                <input name="address" type="text" placeholder="Kakoba, High Street" className="w-full rounded-lg border-gray-300 text-sm focus:ring-brand-primary" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" defaultChecked name="marketing_opt_in" id="optIn" className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4 border-gray-300" />
                <label htmlFor="optIn" className="text-xs font-medium text-gray-700">Opt-in for SMS Marketing campaigns</label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Contact"}
            </button>
          </form>
        </div>

        {/* EXCEL / CSV UPLOAD CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-brand-charcoal">Excel / CSV Import</h2>
              <p className="text-xs text-gray-400">Bulk upload from spreadsheet</p>
            </div>
          </div>

          <form onSubmit={handleCsvImport} className="space-y-4 flex-grow flex flex-col justify-between">
            <div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 text-xs text-gray-600 space-y-1">
                <p className="font-bold text-brand-charcoal">Format Instructions:</p>
                <p>Save your Excel file as a <b>CSV (Comma Delimited)</b> file.</p>
                <p>Column order: <code className="bg-white px-1 py-0.5 rounded border border-gray-300 font-mono text-[10px]">Name, Phone, Location, Address</code></p>
              </div>

              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <input 
                  required
                  type="file" 
                  name="csv_file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                  }}
                />
                <UploadCloud className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-brand-charcoal">
                  {fileName ? `Selected: ${fileName}` : "Click to select CSV file"}
                </p>
              </div>

              {importResult && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-lg text-center">
                  {importResult}
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isImporting || !fileName}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? "Importing Contacts..." : "Upload & Process Contacts"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
