import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Frosted Backdrop */}
      <div 
        className="absolute inset-0 bg-opacity-40 bg-[#051C2C] backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden z-10 transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col animate-fade-up"
        id="modal-container"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E6]">
          <h3 className="font-heading text-lg font-semibold text-[#051C2C] tracking-tight">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F5F5F2] text-[#888888] hover:text-[#051C2C] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
