/**
 * zip-service.ts
 * ระบบมัดรวมไฟล์ ZIP สำหรับ komsin.com
 */
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface AssetFile {
  name: string;
  data: string | Blob;
  type: 'svg' | 'png' | 'txt';
}

export const exportBundleAsZip = async (
  files: AssetFile[], 
  bundleName: string = "Aurelius_Studio_Bundle"
) => {
  const zip = new JSZip();
  const folder = zip.folder(bundleName);

  if (!folder) return;

  files.forEach((file) => {
    folder.file(`${file.name}.${file.type}`, file.data);
  });

  // ใส่ License ให้ดูเป็นมืออาชีพ
  folder.file("LICENSE.txt", 
    `Art Assets by komsin\n` +
    `Registered via komsin.com\n` +
    `License: Commercial Use Allowed.`
  );

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${bundleName}.zip`);
};