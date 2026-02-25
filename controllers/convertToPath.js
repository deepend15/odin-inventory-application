export default function convertToPath(string) {
  const newString = encodeURIComponent(
    string.split(" ").join("_").toLowerCase(),
  );
  const fullyEncodedString = newString
    .replace(/'/g, "%27")
    .replace(/!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .trim();
  return fullyEncodedString;
}
