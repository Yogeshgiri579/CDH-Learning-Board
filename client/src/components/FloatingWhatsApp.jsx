import React, { useState } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export const FloatingWhatsApp = ({
  communityUrl = "https://chat.whatsapp.com/GjN9K8MultiCloudCDH",
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <aside aria-label="Community support" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center select-none">
      {/* Tooltip on hover or active */}
      <div
        className={`hidden sm:flex items-center space-x-2 mr-3 px-3.5 py-2 rounded-xl bg-[#161b22]/95 backdrop-blur-md border border-[#30363d] text-white shadow-xl text-xs transition-all duration-200 pointer-events-none ${
          hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
        <span className="font-semibold text-xs">Join DevOps WhatsApp</span>
        <span className="text-[10px] px-1.5 py-0.2 bg-[#25D366]/20 text-[#25D366] font-bold rounded">
          Active
        </span>
      </div>

      {/* Floating Action Button */}
      <a
        href={communityUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/60 hover:scale-108 active:scale-95 transition-all duration-200 focus:outline-none"
        title="Join CloudDevOpsHub WhatsApp Community"
        aria-label="Join CloudDevOpsHub WhatsApp Community"
      >
        {/* Pulsing Outer Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 drop-shadow" />

        {/* Unread / Active notification dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 border-2 border-[#010409] rounded-full z-20 flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
        </span>
      </a>
    </aside>
  );
};
