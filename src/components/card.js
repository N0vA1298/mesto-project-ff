import { deleteCardOnServer, cardLikeButtonOn, cardLikeButtonOff } from './api.js';

//функция создания карточек

export function createCard(cardData, deleteCardCallback, likeButton, openCardImagePopupOnClick, cardLikeCounter, userId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardTemplateContent = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImage = cardTemplateContent.querySelector(".card__image");
  const cardTitle = cardTemplateContent.querySelector(".card__title");
  const cardDeleteButton = cardTemplateContent.querySelector(".card__delete-button");
  const cardLikeButton = cardTemplateContent.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardLikeCounter(cardTemplateContent, cardData.likes.length);

  const userLikedCard = cardData.likes.some((element) => {
    return element['_id'] === userId;
  });

  cardLikeButton.classList.toggle('card__like-button_is-active', userLikedCard);

  const cardId = cardData['_id'];

  console.log('Current user ID:', userId);
  console.log('Card owner ID:', cardData.owner['_id']);

  if (userId === cardData.owner['_id']) {
    cardDeleteButton.classList.add('card__delete-button_visible');
    cardDeleteButton.addEventListener('click', () => {
      deleteCardCallback(cardTemplateContent, cardId);
    });
  } else {
    console.log('User is not the owner of the card with id:', cardId);
  }

  cardLikeButton.addEventListener("click", (evt) => {
    likeButton(evt, cardId, cardTemplateContent);
  });

  cardImage.addEventListener("click", openCardImagePopupOnClick);

  return cardTemplateContent;
}
//функция удаления карточек

export function deleteCard(elementToDelete) {
    elementToDelete.remove();
  };
  
// функция лайка карточки
  
  export function likeButton(evt, cardId, cardElement) {
    if (evt.target.classList.contains('card__like-button')) {
      const likeButton = evt.target;
      const likeMethod = (cardId) => {
        return likeButton.classList.contains('card__like-button_is-active') ? cardLikeButtonOff(cardId) : cardLikeButtonOn(cardId)
      };
      likeMethod(cardId)
        .then((cardData) => {
          likeButton.classList.toggle('card__like-button_is-active');
          cardLikeCounter(cardElement, cardData.likes.length);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };


  // функция - счетчик количества лайков на карточке

export function cardLikeCounter(cardElement, amountOfLikes) {
  const cardLikeCount = cardElement.querySelector('.card__like-counter');

  if(amountOfLikes > 0) {
    cardLikeCount.classList.add('card__like-counter-active');
    cardLikeCount.textContent = amountOfLikes;
  } else {
    cardLikeCount.classList.remove('card__like-counter-active');
    cardLikeCount.textContent = '';
  }
}