// Clipboard utilities with fallback support

export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback for older browsers or insecure contexts
  return copyToClipboardFallback(text);
}

function copyToClipboardFallback(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // Prevent scrolling to bottom
  textArea.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 2em;
    height: 2em;
    padding: 0;
    border: none;
    outline: none;
    box-shadow: none;
    background: transparent;
  `;
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch {
    success = false;
  }
  
  document.body.removeChild(textArea);
  return success;
}

export async function readFromClipboard(): Promise<string | null> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return null;
    }
  }
  return null;
}

export function canUseClipboard(): boolean {
  return !!(navigator.clipboard && window.isSecureContext);
}
