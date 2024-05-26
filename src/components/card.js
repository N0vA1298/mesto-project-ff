import { cardLikeCounter } from '../index.js'
import { openModal, closeModal } from './modal.js';
import { deleteCardOnServer, cardLikeButtonOn, cardLikeButtonOff, configAPI } from './api.js';

//функция создания карточек

export function createCard(cardData, popupDeleteCard, likeButton, openCardImagePopupOnClick, cardLikeCounter, userData) {
    const cardTemplate = document.querySelector('#card-template').content;
  
    const cardTemplateContent = cardTemplate.querySelector(".card").cloneNode(true);
  
    const cardImage = cardTemplateContent.querySelector(".card__image");
    const cardTitle = cardTemplateContent.querySelector(".card__title");
    const cardDeleteButton = cardTemplateContent.querySelector(".card__delete-button");
    const cardLikeButton =cardTemplateContent.querySelector(".card__like-button");
  
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    cardLikeCounter(cardTemplateContent, cardData.likes.length);

      const userLikedCard = cardData.likes.some((element) => {
    return element['_id'] === userData['_id'];
  });

  if(userLikedCard) {
    cardLikeButton.classList.add('card__like-button_is-active');
  } else {
    cardLikeButton.classList.remove('card__like-button_is-active');
  }
  
    const cardId = cardData['_id'];

    if(userData['_id'] === cardData.owner['_id']) {
      cardDeleteButton.classList.add('card__delete-button-correct-user');

      cardDeleteButton.addEventListener("click", function () {
      const popupToConfirmCardDeletion = document.querySelector('.popup_type_card-deletion');
      openModal(popupToConfirmCardDeletion);

      const cardDeleteButtonConfirm = popupToConfirmCardDeletion.querySelector('.popup__button');

      cardDeleteButtonConfirm.addEventListener('click', () => {
        popupDeleteCard(cardTemplateContent, cardId);
        closeModal(popupToConfirmCardDeletion);
      })
      });
    } else {
      cardDeleteButton.classList.remove('card__delete-button-correct-user');
    }
  
    cardLikeButton.addEventListener("click", (evt) => {
      likeButton(evt, cardId, cardTemplateContent);
    });
  
    cardImage.addEventListener("click", openCardImagePopupOnClick);
  
    return cardTemplateContent;
  };

//функция удвления карточек

export function deleteCard(elementToDelete, cardId) {
  elementToDelete.remove();
    deleteCardOnServer(cardId, configAPI);
  };
  
// функция лайка карточки
  
  export function likeButton(evt, cardId, cardElement) {
    if (evt.target.classList.contains('card__like-button')) {
      const likeButton = evt.target;
      if(!likeButton.classList.contains('card__like-button_is-active')) {
        likeButton.classList.add('card__like-button_is-active');
        cardLikeButtonOn(cardId, configAPI)
        .then((cardData) => {
          cardLikeCounter(cardElement, cardData.likes.length);
        })
      } else {
        likeButton.classList.remove('card__like-button_is-active');
        cardLikeButtonOff(cardId, configAPI)
        .then((cardData) => {
          cardLikeCounter(cardElement, cardData.likes.length);
        });
      }
    }
  };