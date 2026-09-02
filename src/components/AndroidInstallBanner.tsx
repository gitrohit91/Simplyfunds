import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, X, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Logo from './Logo';

export const AndroidInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);

  // If already installed or dismissed this session, hide
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowAndroidModal(true);
    }
  };

  return (
    <>
      {/* Floating Smart Mobile App Install Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-blue-800/40 px-3 py-2 sm:px-4 sm:py-2.5 relative shadow-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-inner">
              <Smartphone className="w-4 h-4 text-amber-400" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white tracking-wide">
                <span>Simply Funds Android App</span>
                <span className="hidden sm:inline-block bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded border border-amber-400/30 font-semibold">
                  Fast & Offline-Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate hidden md:block">
                Install as a native Android APK / Web App on your home screen for one-tap EMI calculations & loan tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs h-7 sm:h-8 px-3 rounded-md shadow-sm flex items-center gap-1.5 cursor-pointer border border-amber-300/40"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Install App</span>
            </Button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Dismiss app banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Android Installation Guide Modal (when browser hasn't fired beforeinstallprompt or on manual trigger) */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-slate-900 relative">
            <button
              onClick={() => setShowAndroidModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
                <Logo size={32} showText={false} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Install Simply Funds App</h3>
                <p className="text-xs text-blue-600 font-semibold">Official Android & Mobile Experience</p>
              </div>
            </div>

            <div className="space-y-3.5 my-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <p>
                  Tap the browser menu <strong>(⋮ three dots)</strong> in the top-right corner of Chrome on your Android phone.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <p>
                  Select <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <p>
                  Simply Funds will install directly onto your home screen with its own full-screen launcher icon, offline caching, and instant calculators.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 my-4 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero storage footprint</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 p-2 rounded-lg border border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>100% Secure & Verified</span>
              </div>
            </div>

            <Button
              onClick={() => setShowAndroidModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-sm rounded-xl"
            >
              Got it, continue
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
