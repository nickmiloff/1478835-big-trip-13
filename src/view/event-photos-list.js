import {createEventPhotoTemplate} from './event-photo';

export const createEventPhotosListTemplate = (photos) => {
  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos.map(createEventPhotoTemplate).join(``)}
      </div>
    </div>
  `;
};
