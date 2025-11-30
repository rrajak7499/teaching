export const swar = ["अ","आ","इ","ई","उ","ऊ","ऋ","ए","ऐ","ओ","औ","अं","अः"];

export const vyanjan = [
  "क","ख","ग","घ","ङ",
  "च","छ","ज","झ","ञ",
  "ट","ठ","ड","ढ","ण",
  "त","थ","द","ध","न",
  "प","फ","ब","भ","म",
  "य","र","ल","व",
  "श","ष","स","ह",
  "क्ष","त्र","ज्ञ"
];

export const matras = ["ा","ि","ी","ु","ू","ृ","े","ै","ो","ौ","ँ","ं","ः","्"];

export const generateCombinations = () => {
  const combinations: string[] = [];

  vyanjan.forEach(v => {
    matras.forEach(m => {
      combinations.push(v + m);
    });
  });

  return combinations;
};
