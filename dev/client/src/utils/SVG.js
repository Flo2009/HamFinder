
// Function to generate an SVG as a placeholder
const generateSVGPlaceholder = (text) => {
    const initials = text
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); // Get first two initials
    
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#${Math.floor(Math.random()*16777215).toString(16)}" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="36" fill="white" font-family="Arial">
          ${initials}
        </text>
      </svg>
    `;
  
    return `data:image/svg+xml;base64,${btoa(svg)}`; // Convert to Base64
  };