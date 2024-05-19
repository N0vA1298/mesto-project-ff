import './pages/index.css';
import {initialCards} from './cards.js';


const placesList = document.querySelector('.places__list');

const editButtonProfile = document.querySelector('.profile__edit-button');

const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки

function createCard(cardData, deleteOnButtonClick) {
  const cardTemplateContent = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardTemplateContent.querySelector('.card__image');
  const cardTitle = cardTemplateContent.querySelector('.card__title');
  const cardDeleteButton = cardTemplateContent.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardDeleteButton.addEventListener('click', () => {
    deleteOnButtonClick(cardTemplateContent);
  })

  return cardTemplateContent;
}

// @todo: Функция удаления карточки

function deleteCard(elementToDelete) {
  elementToDelete.remove();
}

// @todo: Вывести карточки на страницу

initialCards.forEach (function(cardData) {
  const newCard = createCard(cardData, deleteCard);
  placesList.append(newCard);
});

editButtonProfile.addEventListener('click', function() {
  const popupProfileEdit = document.querySelector('.popup_type_edit');
  popupProfileEdit.style.display = 'block';

  });