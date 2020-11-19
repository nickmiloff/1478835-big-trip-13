import dayjs from 'dayjs';

export const createTripInfoTemplate = (cities = ``, firstDay, lastDay) => {
  const firstDate = dayjs(firstDay);
  const lastDate = dayjs(lastDay);

  const lastDateString = firstDate.get(`month`) !== lastDate.get(`month`) ? lastDate.format(`MMM DD`) : lastDate.format(`DD`);

  return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cities}</h1>

      <p class="trip-info__dates">${dayjs(firstDay).format(`MMM DD`)}&nbsp;&mdash;&nbsp;${lastDateString}</p>
    </div>
  `;
};
