import {createEventDestinationDescriptionTemplate} from './event-destination-description';
import {createEventPhotosListTemplate} from './event-photos-list';

export const createEventFormDestinationTemplate = ({description = ``, photos = []}) => {
  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${description && description !== `` ? createEventDestinationDescriptionTemplate(description) : ``}
      ${photos.length > 0 ? createEventPhotosListTemplate(photos) : ``}
    </section>
  `;
};
