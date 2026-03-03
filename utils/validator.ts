// utils/validator.ts
export const validateImage = (file: File): Promise<{ isValid: boolean; message: string }> => {
  return new Promise((resolve) => {
    // 1. ตรวจสอบขนาดไม่เกิน 2MB
    if (file.size > 2 * 1024 * 1024) {
      resolve({ isValid: false, message: "FILE_TOO_LARGE: MAX 2MB" });
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      // 2. ตรวจสอบความละเอียด 900x1200
      const isValid = img.width === 900 && img.height === 1200;
      resolve({
        isValid,
        message: isValid ? "MATCHED" : `INVALID_RES: ${img.width}x${img.height} (REQUIRE 900x1200)`
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => resolve({ isValid: false, message: "INVALID_IMAGE_FILE" });
  });
};