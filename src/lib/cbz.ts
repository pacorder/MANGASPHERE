import JSZip from 'jszip';

export interface MangaPage {
  name: string;
  url: string;
}

export interface MangaFile {
  name: string;
  pages: MangaPage[];
}

export async function processCBZ(file: File): Promise<MangaFile> {
  const zip = new JSZip();
  const content = await zip.loadAsync(file);
  const pages: MangaPage[] = [];

  const imageRegex = /\.(jpg|jpeg|png|webp|gif)$/i;
  
  // Extract files and filter for images
  const entries = Object.values(content.files)
    .filter(file => !file.dir && imageRegex.test(file.name));

  // Sort files naturally (01.jpg, 02.jpg, etc.)
  entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  for (const entry of entries) {
    const blob = await entry.async('blob');
    pages.push({
      name: entry.name,
      url: URL.createObjectURL(blob),
    });
  }

  return {
    name: file.name.replace(/\.cbz$/i, ''),
    pages,
  };
}

export function cleanupManga(manga: MangaFile) {
  manga.pages.forEach(page => URL.revokeObjectURL(page.url));
}
