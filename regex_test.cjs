const str1 = "TRUPER BIELDO (1), TRUPER AZADON (2), SUSTRATO 250L (2)";
const str2 = "TRUPER BIELDO (P:10, E:4, R:6), TRUPER AZADON (P:5, E:0, R:5)";

const splitProducts = (str) => {
  const parts = [];
  let current = '';
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
};

const parse = (str) => {
  const parts = splitProducts(str);
  return parts.map((part, pIdx) => {
    const matchNew = part.match(/(.+?)\s*\(P:(\d+),\s*E:(\d+),\s*R:(\d+)\)/);
    if (matchNew) return { type: 'new', name: matchNew[1].trim(), p: matchNew[2], e: matchNew[3], r: matchNew[4] };
    const matchOld = part.match(/(.+?)\s*\((\d+)\)/);
    if (matchOld) return { type: 'old', name: matchOld[1].trim(), qty: matchOld[2] };
    return { type: 'unknown', raw: part };
  });
};

console.log('str1:', parse(str1));
console.log('str2:', parse(str2));
