import dayjs from 'dayjs';
import {getRandomInteger, getRandomElementFromArr, getRandomElementsFromArr} from '../utils/common';

const Mocks = {
  types: [
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
  ],
  cities: [
    `Chamonix`,
    `Geneva`,
    `Amsterdam`
  ],
  offers: {
    list: [
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
    ],
    min: 0,
    max: 5
  },
  suggestions: {
    description: {
      list: [
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
      ],
      min: 1,
      max: 5
    },
    images: {
      min: 0,
      max: 10
    }
  },
  datetime: {
    initial: `2019-03-19T12:00`,
    gaps: {
      days: 1,
      hours: 6,
      minutes: 30
    }
  }
};

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateOffers = () => {
  const {list, min, max} = Mocks.offers;

  return getRandomElementsFromArr(list, min, max).map((offer) => {
    offer.checked = Boolean(getRandomInteger(0, 1));

    return offer;
  });
};

const generateDestination = () => {
  const {list, min: minDescCount, max: maxDescCount} = Mocks.suggestions.description;
  const {min: minImgsCount, max: maxImgsCount} = Mocks.suggestions.images;

  const generatedImagesCount = getRandomInteger(minImgsCount, maxImgsCount);

  const description = getRandomElementsFromArr(list, minDescCount, maxDescCount).join(` `);
  const photos = new Array(generatedImagesCount).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

  return {
    description,
    photos
  };
};

const generateDatetime = () => {
  const {initial, gaps} = Mocks.datetime;
  const result = [];

  const generatedDaysGap = getRandomInteger(-gaps.days, gaps.days);
  const generatedDay = dayjs(initial).add(generatedDaysGap, `day`).toDate();

  for (let i = 0; i < 2; i++) {
    const generatedHoursGap = getRandomInteger(-gaps.hours, gaps.hours);
    const generatedMinutesGap = getRandomInteger(-gaps.minutes, gaps.minutes);

    const generatedDatetime = dayjs(generatedDay).add(generatedHoursGap, `hour`).add(generatedMinutesGap, `m`);
    result.push(generatedDatetime);
  }

  return result.sort((a, b) => a - b).map((datetime) => datetime.toDate());
};

export const generateEvent = () => {
  return {
    id: generateId(),
    type: getRandomElementFromArr(Mocks.types),
    city: getRandomElementFromArr(Mocks.cities),
    offers: generateOffers(),
    destination: generateDestination(),
    datetime: generateDatetime(),
    price: getRandomInteger(20, 100),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
