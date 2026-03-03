"use client";

import React, { useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
// 1. Import library สำหรับจัดการ ZIP และการบันทึกไฟล์
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function StandaloneCropToolPNGZip() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("aurelius-design");
  const cropperRef = useRef<ReactCropperElement>(null);
  // เพิ่ม state สำหรับ loading เวลาสร้าง zip เพราะอาจใช้เวลาสักครู่สำหรับภาพใหญ่
  const [isSaving, setIsSaving] = useState(false);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name.split(".")[0]);
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || isSaving) return;

    setIsSaving(true); // เริ่มกระบวนการบันทึก

    const canvas = cropper.getCroppedCanvas({
      width: 4500,
      height: 5400,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    // 2. แปลง Canvas เป็น PNG Blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setIsSaving(false);
          return;
        }

        try {
          // 3. เริ่มต้นสร้าง ZIP
          const zip = new JSZip();

          // ตั้งชื่อไฟล์ PNG ภายใน ZIP
          const pngFilename = `cropped-${fileName}.png`;

          // เพิ่มไฟล์ PNG Blob เข้าไปใน ZIP
          zip.file(pngFilename, blob);

          // สร้างไฟล์ ZIP (Generate ZIP Blob)
          const zipBlob = await zip.generateAsync({ type: "blob" });

          // ตั้งชื่อไฟล์ ZIP หลัก
          const zipFilename = `cropped-${fileName}-by-komsin.zip`;

          // 4. ใช้ file-saver สั่งดาวน์โหลด
          saveAs(zipBlob, zipFilename);
        } catch (error) {
          console.error("Error creating ZIP:", error);
          alert("An error occurred while creating the ZIP file.");
        } finally {
          setIsSaving(false); // จบกระบวนการบันทึก
        }
      },
      "image/png" // กำหนด format เป็น PNG
      // ไม่จำเป็นต้องใส่ quality parameter สำหรับ PNG
    );
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
            <p className="text-xs text-gray-500 mt-1 uppercase">
              Aurelius Studio | By komsin
            </p>
          </div>

          <div className="flex gap-4">
            <label className="bg-white text-black px-4 py-2 rounded-md font-bold cursor-pointer hover:bg-gray-200 transition text-sm">
              SELECT IMAGE
              <input
                type="file"
                className="hidden"
                onChange={onSelectFile}
                accept="image/*"
              />
            </label>

            {image && (
              <button
                onClick={handleDownload}
                disabled={isSaving}
                className={`px-6 py-2 rounded-md font-bold transition text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center min-w-[200px]
                  ${
                    isSaving
                      ? "bg-blue-800 text-gray-300 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    ZIPPING...
                  </>
                ) : (
                  "SAVE AS PNG ZIP"
                )}
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
                initialAspectRatio={4500 / 5400}
                aspectRatio={4500 / 5400}
                guides={true}
                viewMode={1}
                background={false}
                autoCropArea={1}
                responsive={true}
                checkOrientation={false}
              />

              <div className="mt-4 flex gap-4 justify-center text-xs text-gray-400">
                <span className="flex items-center">
                  🖱️ Drag to pan & move crop box
                </span>
                <span className="flex items-center">🔍 Scroll to zoom</span>
                <span className="flex items-center">
                  📐 Use corners to resize (Fixed Aspect Ratio 4500:5400)
                </span>
              </div>
            </div>
          ) : (
            <div
              className="h-[60vh] border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center bg-[#141414] hover:bg-[#181818] transition-colors cursor-pointer"
              onClick={() => document.querySelector("input")?.click()}
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-2xl">
                📥
              </div>
              <p className="text-lg font-medium text-gray-400">
                Drop your Graffiti design here
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Supports PNG, JPG, WebP
              </p>
            </div>
          )}
        </main>

        {/* Footer info */}
        <footer className="mt-8 text-center">
          <p className="text-[10px] text-gray-600 tracking-[0.2em] uppercase">
            Designed for komsin.com workflow | Output: 4500x5400px PNG in ZIP
          </p>
        </footer>
      </div>
    </div>
  );
}