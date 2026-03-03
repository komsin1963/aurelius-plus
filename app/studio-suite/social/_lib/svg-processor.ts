/**
 * svg-processor.ts
 * Engine สำหรับจัดการสีในไฟล์ SVG และการ Preview
 */

interface ColorPalette {
  primary?: string;
  secondary?: string;
}

export const multiRecolorSVG = (svgString: string, palette: ColorPalette): string => {
  if (!svgString) return '';
  let updatedSvg = svgString;

  // เปลี่ยนสี Primary (แทนที่สีแดง #FF0000 ในไฟล์ต้นฉบับ)
  if (palette.primary) {
    const primaryRegex = new RegExp('#FF0000|fill="#FF0000"|stroke="#FF0000"', 'gi');
    updatedSvg = updatedSvg.replace(primaryRegex, (match) => {
      if (match.toLowerCase().includes('fill')) return `fill="${palette.primary}"`;
      if (match.toLowerCase().includes('stroke')) return `stroke="${palette.primary}"`;
      return palette.primary!;
    });
  }

  // เปลี่ยนสี Secondary (แทนที่สีเขียว #00FF00 ในไฟล์ต้นฉบับ)
  if (palette.secondary) {
    const secondaryRegex = new RegExp('#00FF00|fill="#00FF00"|stroke="#00FF00"', 'gi');
    updatedSvg = updatedSvg.replace(secondaryRegex, (match) => {
      if (match.toLowerCase().includes('fill')) return `fill="${palette.secondary}"`;
      if (match.toLowerCase().includes('stroke')) return `stroke="${palette.secondary}"`;
      return palette.secondary!;
    });
  }

  return updatedSvg;
};

export const svgToDataUri = (svgString: string): string => {
  if (typeof window === 'undefined' || !svgString) return '';
  try {
    const base64 = btoa(unescape(encodeURIComponent(svgString)));
    return `data:image/svg+xml;base64,${base64}`;
  } catch (e) {
    return '';
  }
};