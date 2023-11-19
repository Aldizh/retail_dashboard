export const escapeHTML = (unsafe_str) => unsafe_str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;') // '&apos;' is not valid HTML 4
;