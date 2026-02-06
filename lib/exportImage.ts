// Preload fonts for export
async function preloadFonts(): Promise<void> {
  if (!document.fonts) return;
  
  // Wait for all fonts to be loaded
  await document.fonts.ready;
  
  // Force load specific fonts
  const fontFaces = [
    new FontFace('Chakra Petch', 'url(https://fonts.gstatic.com/s/chakrapetch/v11/cIf6MaFLtkE3UjaJxCmrYGkHgIs.woff2)', {
      weight: '400',
      style: 'normal',
    }),
    new FontFace('Chakra Petch', 'url(https://fonts.gstatic.com/s/chakrapetch/v11/cIf9MaFLtkE3UjaJ_ImHRGEsnIJkWL4.woff2)', {
      weight: '600',
      style: 'normal',
    }),
  ];

  try {
    const loadedFonts = await Promise.all(
      fontFaces.map(async (font) => {
        const loadedFont = await font.load();
        document.fonts.add(loadedFont);
        return loadedFont;
      })
    );
    
    // Wait a bit more for fonts to be applied
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.warn('Failed to preload fonts:', error);
  }
}

// Load html2canvas from CDN
function loadHtml2Canvas(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).html2canvas) {
      resolve((window as any).html2canvas);
      return;
    }

    // Load script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
    script.onload = () => {
      resolve((window as any).html2canvas);
    };
    script.onerror = () => {
      reject(new Error("Failed to load html2canvas"));
    };
    document.head.appendChild(script);
  });
}

export async function exportToImage(elementId: string): Promise<Blob | null> {
  try {
    // Preload fonts
    await preloadFonts();

    // Load html2canvas
    const html2canvas = await loadHtml2Canvas();

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found");
    }

    // Generate canvas from element
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
    });

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob: Blob | null) => {
        resolve(blob);
      }, "image/png");
    });
  } catch (error) {
    console.error("Failed to export image:", error);
    return null;
  }
}

export async function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function shareImage(blob: Blob, title: string, text: string) {
  if (!navigator.share) {
    throw new Error("Web Share API not supported");
  }

  const file = new File([blob], "cal-count.png", { type: "image/png" });

  await navigator.share({
    title,
    text,
    files: [file],
  });
}

export function canShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}
