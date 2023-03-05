export const isEnglishAndNumericOnly = (text: string) => {
  const alphabet = [
    "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm0123456789",
  ];
  if (text.split("").some((t) => alphabet.some((a) => a === t))) {
  }
};
