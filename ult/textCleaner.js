export const cleanText = (text) => {
  // First, remove any HTML tags
  text = text.replace(/<[^>]*>?/gm, ""); // Strips out all HTML tags

  // Then, clean up any HTML entities
  return text
    .replace(/&#8220;/g, "“")    // Left double quotation mark
    .replace(/&#8221;/g, "”")    // Right double quotation mark
    .replace(/&#8211;/g, "–")    // En dash
    .replace(/&#8212;/g, "—")    // Em dash
    .replace(/&#8216;/g, "‘")    // Left single quotation mark
    .replace(/&#8217;/g, "’")    // Right single quotation mark
    .replace(/&#8230;/g, "…")    // Ellipsis
    .replace(/&#8242;/g, "′")    // Prime (single prime)
    .replace(/&#8243;/g, "″")    // Double prime
    .replace(/&quot;/g, '"')     // Double quote
    .replace(/&apos;/g, "'")     // Apostrophe
    .replace(/&amp;/g, "&")      // Ampersand
    .replace(/&lt;/g, "<")       // Less-than sign
    .replace(/&gt;/g, ">")       // Greater-than sign
    .replace(/&nbsp;/g, " ")     // Non-breaking space
    .replace(/&copy;/g, "©")     // Copyright symbol
    .replace(/&reg;/g, "®")      // Registered trademark symbol
    .replace(/&trade;/g, "™")    // Trademark symbol
    .replace(/&euro;/g, "€")     // Euro sign
    .replace(/&pound;/g, "£")    // Pound sign
    .replace(/&yen;/g, "¥")      // Yen sign
    .replace(/&cent;/g, "¢")     // Cent sign
    .replace(/&sect;/g, "§")     // Section symbol
    .replace(/&deg;/g, "°")      // Degree symbol
    .replace(/&para;/g, "¶")     // Pilcrow symbol (paragraph sign)
    .replace(/&hellip;/g, "…")   // Horizontal ellipsis
    .replace(/&ndash;/g, "–")    // En dash
    .replace(/&mdash;/g, "—")    // Em dash
    .replace(/&lsquo;/g, "‘")    // Left single quotation mark
    .replace(/&rsquo;/g, "’")    // Right single quotation mark
    .replace(/&ldquo;/g, "“")    // Left double quotation mark
    .replace(/&rdquo;/g, "”")    // Right double quotation mark
    .replace(/&laquo;/g, "«")    // Left-pointing double angle quotation mark
    .replace(/&raquo;/g, "»");   // Right-pointing double angle quotation mark
};
