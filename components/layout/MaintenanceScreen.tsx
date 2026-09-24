import { Globe, Monitor, Smartphone, CheckCircle2, ServerCrash } from "lucide-react";

export default function MaintenanceScreen() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-light text-gray-800 tracking-tight">
            Service Temporarily Unavailable
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            EssyRise Electronics is currently undergoing scheduled maintenance and upgrades. 
            We are working quickly to bring the store back online.
          </p>
        </div>

        {/* Cloudflare-style Status Diagnostic Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          
          {/* Internet Check */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <Globe className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Your Internet</p>
              <p className="text-sm text-gray-500">is okay</p>
            </div>
          </div>

          {/* Device Check */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <Smartphone className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Your Device</p>
              <p className="text-sm text-gray-500">is okay</p>
            </div>
          </div>

          {/* Browser Check */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <Monitor className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Your Browser</p>
              <p className="text-sm text-gray-500">is okay</p>
            </div>
          </div>

        </div>

        {/* The "But..." Error Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          <ServerCrash className="h-10 w-10 text-orange-500 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            But EssyRise Electronics is under maintenance.
          </h2>
          <p className="text-gray-500">
            The servers are currently offline for routine upgrades. Your connection is perfectly fine, but the destination server is temporarily not accepting requests. Please try refreshing this page in a few minutes.
          </p>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>Ray ID: {Math.random().toString(36).substring(2, 15).toUpperCase()} • {new Date().toUTCString()}</p>
        </div>

      </div>
    </div>
  );
}
