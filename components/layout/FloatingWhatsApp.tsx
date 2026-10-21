"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [showPopup, setShowPopup] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const waNumber = "256758288233";

  useEffect(() => {
    setIsMounted(true);
    const closedAt = localStorage.getItem("wa_popup_closed");
    const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

    // If it has never been closed, or it was closed more than 2 weeks ago
    if (!closedAt || Date.now() - parseInt(closedAt, 10) > TWO_WEEKS_MS) {
      // Small 3-second delay so it doesn't pop up instantly on page load
      const timer = setTimeout(() => setShowPopup(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem("wa_popup_closed", Date.now().toString());
  };

  // Prevent hydration mismatch
  if (!isMounted) return null;

  return (
    <>
      {/* Blur Overlay (Only visible when popup is active) */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] transition-opacity"
          onClick={closePopup}
          aria-hidden="true"
        />
      )}

      {/* Floating Container */}
      <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-4">
        
        {/* Popup Dialogue */}
        {showPopup && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 w-64 relative animate-in slide-in-from-bottom-5 fade-in duration-300">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3 mt-1">
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964 1.026-3.565c-.642-1.06-1.002-2.316-1.002-3.58 0-4.004 3.281-7.254 7.288-7.254 3.992 0 7.254 3.254 7.254 7.254s-3.262 7.254-7.288 7.254z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Need help?</h4>
                <p className="text-xs text-gray-600 mt-0.5">Chat directly with us via WhatsApp.</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${waNumber}?text=Hi%20Essyrise%20Electronics!`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closePopup}
              className="mt-3 w-full block text-center text-sm font-bold bg-[#25D366] text-white py-2.5 rounded-xl hover:bg-[#128C7E] transition-colors"
            >
              Start Chat
            </a>
          </div>
        )}

        {/* Floating WhatsApp Icon (Always Visible) */}
        <a
          href={`https://wa.me/${waNumber}?text=Hi%20Essyrise%20Electronics!`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => showPopup && closePopup()}
          className="w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 relative z-10"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964 1.026-3.565c-.642-1.06-1.002-2.316-1.002-3.58 0-4.004 3.281-7.254 7.288-7.254 3.992 0 7.254 3.254 7.254 7.254s-3.262 7.254-7.288 7.254z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
