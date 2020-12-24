const KeyboardKeys = {
  ESC: `Escape`,
  ENTER: `Enter`
};

export const isEscButton = (key) => key === KeyboardKeys.ESC;

export const isEnterButton = (key) => key === KeyboardKeys.ENTER;

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElementFromArr = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);

  return arr[randomIndex];
};

export const getRandomElementsFromArr = (arr, minCount = 0, maxCount = 10) => {
  let buffer = [...arr];
  const result = [];

  const generatedCount = getRandomInteger(minCount, maxCount);

  for (let i = 0; i < generatedCount; i++) {
    const randomIndex = getRandomInteger(0, buffer.length - 1);
    result.push(buffer[randomIndex]);
    buffer = [...buffer.slice(0, randomIndex), ...buffer.slice(randomIndex + 1)];
  }

  return result;
};

export const isOnline = () => {
  return window.navigator.onLine;
};
