// ================= MAIN JAVASCRIPT =================

// Get current year
const currentYear = new Date().getFullYear();

// Find footer paragraph
const footerText = document.querySelector("footer p");

// Update footer year
if (footerText) {
  footerText.textContent = `© ${currentYear} CalorieTrack. All rights reserved.`;
}
