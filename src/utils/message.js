const SHOW_TIME = 5000;

export const message = (msg) => {
  const messageContainer = document.createElement(`div`);
  const messageItem = document.createElement(`h2`);

  messageContainer.classList.add(`error-message`);
  messageItem.textContent = msg;
  messageItem.classList.add(`error-message__title`);

  messageContainer.append(messageItem);
  document.body.append(messageContainer);

  setTimeout(() => {
    messageContainer.remove();
  }, SHOW_TIME);
};
