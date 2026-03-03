"use client";

import React, { useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function StandaloneCropTool() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("aurelius-design");
  const cropperRef = useRef<ReactCropperElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name.split('.')[0]); // เก็บชื่อไฟล์เดิมไว้
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    // สร้าง Canvas จากส่วนที่ Crop
    const canvas = cropper.getCroppedCanvas({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    // แปลงเป็น Blob และดาวน์โหลดลงเครื่อง
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `cropped-${fileName}-by-komsin.png`; // ใส่เครดิตในชื่อไฟล์
      link.href = url;
      link.click();
      URL.revokeObjectURL(url); // Clean up memory
    }, "image/png");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Area */}
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">
              CROP <span className="text-blue-500 text-sm">STUDIO SUITE</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1 uppercase">Aurelius Studio | By komsin</p>
          </div>
          
          <div className="flex gap-4">
            <label className="bg-white text-black px-4 py-2 rounded-md font-bold cursor-pointer hover:bg-gray-200 transition text-sm">
              SELECT IMAGE
              <input type="file" className="hidden" onChange={onSelectFile} accept="image/*" />
            </label>
            
            {image && (
              <button 
                onClick={handleDownload}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-500 transition text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                SAVE TO DEVICE
              </button>
            )}
          </div>
        </header>

        {/* Workspace */}
        <main>
          {image ? (
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 shadow-inner">
              <Cropper
                ref={cropperRef}
                src={image}
                style={{ height: "70vh", width: "100%" }}
                initialAspectRatio={NaN} // ให้ปรับอิสระในตอนแรก
                guides={true}
                viewMode={1}
                background={false} // สำคัญ: เพื่อให้เห็นความโปร่งใสของลาย Graffiti
                autoCropArea={1}
                responsive={true}
                checkOrientation={false}
              />
              
              <div className="mt-4 flex gap-4 justify-center text-xs text-gray-400">
                <span className="flex items-center">🖱️ Drag to pan</span>
                <span className="flex items-center">🔍 Scroll to zoom</span>
                <span className="flex items-center">📐 Use corners to resize</span>
              </div>
            </div>
          ) : (
            <div 
              className="h-[60vh] border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center bg-[#141414] hover:bg-[#181818] transition-colors cursor-pointer"
              onClick={() => document.querySelector('input')?.click()}
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-2xl">
                📥
              </div>
              <p className="text-lg font-medium text-gray-400">Drop your Graffiti design here</p>
              <p className="text-sm text-gray-600 mt-2">Supports PNG, JPG, WebP</p>
            </div>
          )}
        </main>
        
        {/* Footer info */}
        <footer className="mt-8 text-center">
          <p className="text-[10px] text-gray-600 tracking-[0.2em] uppercase">
            Designed for komsin.com workflow
          </p>
        </footer>
      </div>
    </div>
  );
}