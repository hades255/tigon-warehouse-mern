export const randomString = (length = 8, number = false) => {
  const numbers = "0123456789";
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    (number ? numbers : "");
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
};

export const stringToAvatar = (name) => {
  const n = name.split(" ");
  return n.length === 1 ? n[0][0] : n[0][0] + n[1][0];
};

export const stringToColor = (name) => {
  const n = name.split(" ");
  return n.length === 1
    ? `rgba(125, 125, ${3 * (n[0][0].charCodeAt(0) - 45)}, 0.7)`
    : `rgba(125, ${20 * (n[0][0].toUpperCase().charCodeAt(0) % 13)},${
        20 * (n[1][0].toUpperCase().charCodeAt(0) % 13)
      }, 0.7)`;
};
