import React from 'react';

export function MobileFrameWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 p-4">
      {/* Simulates an entry-level Android phone frame */}
      <div className="w-full max-w-[400px] h-[800px] bg-white rounded-[40px] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col relative">
        {/* Notch / Speaker simulation */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-50"></div>
        
        {/* Scrollable App Viewport */}
        <div className="flex-1 overflow-y-auto pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MobileFrameWrapper;
