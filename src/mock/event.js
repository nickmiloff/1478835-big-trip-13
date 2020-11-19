import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElementFromArr = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);

  return arr[randomIndex];
};

const getRandomElementsFromArr = (arr, minCount = 0, maxCount = 10) => {
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

const generateType = () => {
  const types = [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`,
    `Check-in`,
    `Sightseeing`,
    `Restaurant`
  ];

  return getRandomElementFromArr(types);
};

const generateCity = () => {
  const cities = [
    `Chamonix`,
    `Geneva`,
    `Amsterdam`
  ];

  return getRandomElementFromArr(cities);
};

const generateOffers = () => {
  let offers = [
    {
      title: `Add luggage`,
      price: 50
    },
    {
      title: `Switch to comfort`,
      price: 80
    },
    {
      title: `Add meal`,
      price: 15
    },
    {
      title: `Choose seats`,
      price: 5
    },
    {
      title: `Travel by train`,
      price: 40
    }
  ];
  const minOffersCount = 0;
  const maxOffersCount = 5;

  return getRandomElementsFromArr(offers, minOffersCount, maxOffersCount).map((offer) => {
    offer.checked = Boolean(getRandomInteger(0, 1));

    return offer;
  });
};

const generateDestination = () => {
  const suggestions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];
  const Counts = {
    suggestions: {
      min: 1,
      max: 5
    },
    images: {
      min: 1,
      max: 10
    }
  };

  const generatedImagesCount = getRandomInteger(Counts.images.min, Counts.images.max);

  const description = getRandomElementsFromArr(suggestions, Counts.suggestions.min, Counts.suggestions.max).join(` `);
  const photos = new Array(generatedImagesCount).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

  return {
    description,
    photos
  };
};

const generateDate = () => {
  const initialDatetime = `2019-03-19T12:00`;
  const maxDaysGap = 1;

  const generatedGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs(initialDatetime).add(generatedGap, `day`).toDate();
};

const generateDatetime = () => {
  const MaxGap = {
    hours: 6,
    minutes: 30
  };
  const resultedDatetime = [];

  const date = generateDate();

  for (let i = 0; i < 2; i++) {
    const generatedHoursGap = getRandomInteger(-MaxGap.hours, MaxGap.hours);
    const generatedMinutesGap = getRandomInteger(-MaxGap.minutes, MaxGap.minutes);

    const generatedDatetime = dayjs(date).add(generatedHoursGap, `hour`).add(generatedMinutesGap, `m`);

    resultedDatetime.push(generatedDatetime);
  }

  return resultedDatetime.sort((a, b) => a - b).map((datetime) => datetime.toDate());
};

export const generateEvent = () => {
  return {
    type: generateType(),
    city: generateCity(),
    offers: generateOffers(),
    destination: generateDestination(),
    datetime: generateDatetime(),
    price: getRandomInteger(20, 100),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
