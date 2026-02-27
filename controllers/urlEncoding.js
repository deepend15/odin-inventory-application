export function encodeString(string) {
  const encodedString = encodeURIComponent(string.toLowerCase())
    .replace(/'/g, "")
    .replace(/!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .replace(/\.$/, "");
  return encodedString;
}

export function convertToPath(title) {
  const titlePath = title.split(" ").join("-");
  const encodedTitlePath = encodeString(titlePath);
  return encodedTitlePath;
}
