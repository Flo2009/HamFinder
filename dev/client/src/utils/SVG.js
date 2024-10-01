// Function to generate an SVG as a placeholder
export const generateSVGPlaceholder = (text, color) => {
  // Get first two initials from the text
  const initials = text
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Use modern encoding method with error handling
  const toBase64 = (str) => {
    try {
      return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1)));
    } catch (error) {
      console.error('Error encoding to Base64:', error);
      return ''; // Return an empty string or a fallback in case of an error
    }
  };

  // SVG template
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#${color}" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="36" fill="white" font-family="Arial">
        ${initials}
      </text>
    </svg>
  `;

  // Convert to Base64 with proper encoding
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
};