//функция создания карточек

export function createCard(cardData, deleteOnButtonClick, likeButtonOnClick, openCardImagePopupOnClick) {
    const cardTemplate = document.querySelector('#card-template').content;
  
    const cardTemplateContent = cardTemplate.querySelector(".card").cloneNode(true);
  
    const cardImage = cardTemplateContent.querySelector(".card__image");
    const cardTitle = cardTemplateContent.querySelector(".card__title");
    const cardDeleteButton = cardTemplateContent.querySelector(".card__delete-button");
    const cardLikeButton =cardTemplateContent.querySelector(".card__like-button");
  
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
  
    cardDeleteButton.addEventListener("click", function () {
      deleteOnButtonClick(cardTemplateContent);
    });
  
    cardLikeButton.addEventListener("click", likeButtonOnClick);
  
    cardImage.addEventListener("click", openCardImagePopupOnClick);
  
    return cardTemplateContent;
  };

//функция удвления карточек

export function deleteCard(elementToDelete) {
    elementToDelete.remove();
  };
  
// функция лайка карточки
  
  export function likeButton(evt) {
    if (evt.target.classList.contains('card__like-button')) {
      const likeButton = evt.target;
      likeButton.classList.toggle('card__like-button_is-active');
    }
  };