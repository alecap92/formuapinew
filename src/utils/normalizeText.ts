export const normalizeText = (text: string) => {
  return text
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};
