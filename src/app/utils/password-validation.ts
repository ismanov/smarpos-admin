const containsUpperCaseLetter = (str) => {
  if (!str) return false;
  const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  let counter = 0;
  while (counter < str.length) {
    let ch = str.charAt(counter);

    if (isNaN(Number(ch)) && ch === ch.toUpperCase() && !format.test(ch)) {
      return true;
    }
    counter ++;
  }
  return false
};

const containsLowerCaseLetter = (str) => {
  if (!str) return false;
  const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  let counter = 0;
  while (counter < str.length) {
    let ch = str.charAt(counter);

    if (isNaN(Number(ch)) && ch === ch.toLowerCase() && !format.test(ch)) {
      return true;
    }
    counter += 1;
  }
  return false
};

export const containsNumber = (str) => {
  if (!str) return false;
  let counter = 0;
  while (counter < str.length) {
    let ch = str.charAt(counter);

    if (!isNaN(Number(ch))) {
      return true;
    }
    counter ++;
  }
  return false
};

export const isValidPassword = (pass) => {
  return !!(pass && pass.length >= 8 && pass.length <= 16 && containsUpperCaseLetter(pass) && containsLowerCaseLetter(pass) && containsNumber(pass));
};