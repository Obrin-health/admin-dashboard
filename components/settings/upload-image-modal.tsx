"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, Upload } from "lucide-react";

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  onSave: (newImageUrl: string) => void;
}

export default function UploadImageModal({
  isOpen,
  onClose,
  currentImage,
  onSave,
}: UploadImageModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState<string>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedImage(currentImage);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, currentImage]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        alert("Only PNG and JPEG images are allowed.");
        e.target.value = "";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file size exceeds 2MB limit.");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setZoom(1);
          setPosition({ x: 0, y: 0 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(selectedImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[540px] bg-white rounded-3xl p-7 sm:p-8 shadow-2xl z-10 transition-all select-none">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-[20px] font-bold text-[#101828] leading-tight">
              Upload profile image
            </h2>
            <p className="text-[14px] text-[#667085] mt-1">
              Upload your profile image below.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#667085] hover:text-[#101828] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gray Preview Container */}
        <div className="bg-[#F8F9FA] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center">
          {/* Square Crop Frame */}
          <div
            className="w-64 h-64 sm:w-72 sm:h-72 border-[3.5px] border-[#101828] relative overflow-hidden bg-[#FCE5C2] flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              }}
            >
              <Image
                src={selectedImage}
                alt="Profile Preview"
                fill
                sizes="300px"
                className="object-cover pointer-events-none"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Zoom Slider Controls */}
          <div className="w-full max-w-72 flex items-center gap-3.5 mt-6">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.8, prev - 0.2))}
              className="text-[#344054] hover:text-[#101828] cursor-pointer p-1"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4.5 h-4.5" />
            </button>

            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E4E7EC] rounded-lg appearance-none cursor-pointer accent-[#101828]"
            />

            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(2.5, prev + 0.2))}
              className="text-[#344054] hover:text-[#101828] cursor-pointer p-1"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Optional file selector helper */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3.5 inline-flex items-center gap-1.5 text-xs text-[#BB1A8C] hover:underline font-medium cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Choose another image from device</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 mt-6 pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-6 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[14px] font-semibold shadow-xs transition-colors cursor-pointer text-center"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-xl border border-[#D0D5DD] bg-white hover:bg-gray-50 text-[#344054] text-[14px] font-semibold transition-colors cursor-pointer text-center"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
