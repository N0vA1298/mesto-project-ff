// @todo: Темплейт карточки

// @todo: DOM узлы

const placesList = document.querySelector('.places__list');

const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки

function createCard(cardData) {
  const cardTemplateContent = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardTemplateContent.querySelector('.card__image');
  const cardTitle = cardTemplateContent.querySelector('.card__title');
  const cardDeleteButton = cardTemplateContent.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardDeleteButton.addEventListener('click', () => {
    deleteCard(cardTemplateContent);
  })

  return cardTemplateContent;
}

// @todo: Функция удаления карточки

function deleteCard(elementToDelete) {
  elementToDelete.remove();
}

// @todo: Вывести карточки на страницу

initialCards.forEach ((cardData) => {
  placesList.append(createCard(cardData));
});
