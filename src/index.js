import "./pages/index.css";
import { createCard, deleteCard, likeButton } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getUserData, getCardsData, editProfileInfoOnServer, postNewCard, changeAvatarOnServer, checkImageUrl } from './components/api.js';
import { deleteCardOnServer, cardLikeButtonOn, cardLikeButtonOff } from './components/api.js';
import { cardLikeCounter } from './components/card.js'

const cardsContainer = document.querySelector('.places__list');
const buttonOpenPopupProfile = document.querySelector('.profile__edit-button');
const popupProfileEdit = document.querySelector('.popup_type_edit');
const buttonAddNewCard = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');
const popupInputCardName = popupNewCard.querySelector('.popup__input_type_card-name');
const popupInputCardUrl = popupNewCard.querySelector('.popup__input_type_url');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
const popupNewCardForm = popupNewCard.querySelector('.popup__form');

const popupAddNewCardSubmitButton = popupNewCardForm.querySelector('.popup__button');

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// функция для обработки отправки формы
function handleFormSubmit(evt, submitButton, apiFunction, onSuccess) {
  evt.preventDefault();
  submitButton.classList.add('popup__button-disabled');
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  apiFunction()
    .then(onSuccess)
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.classList.remove('popup__button-disabled');
      submitButton.disabled = false;
      submitButton.textContent = 'Сохранить';
    });
}

// открытие попапа на клик
buttonOpenPopupProfile.addEventListener('click', function() {
  openEditProfile();
  clearValidation(popupProfileEdit.querySelector(validationConfig.formSelector), validationConfig);
});

buttonAddNewCard.addEventListener('click', function() {
  openModal(popupNewCard);
  clearValidation(popupNewCard.querySelector(validationConfig.formSelector), validationConfig);
});


// открытие редактирования профиля
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

function openEditProfile() {
  openModal(popupProfileEdit);

  const nameInputValue = profileTitle.textContent;
  const jobInputValue = profileDescription.textContent;

  nameInput.value = nameInputValue;
  jobInput.value = jobInputValue;
}

// редактирование данных профиля
function editProfileInfo(evt) {
  const popupProfileEditSubmitButton = popupProfileEdit.querySelector('.popup__button');
  popupProfileEditSubmitButton.textContent = 'Сохранение...';

  editProfileInfoOnServer(nameInput, jobInput)
  .then((data) => {
    profileTitle.textContent = data.name;
    profileDescription.textContent = data.about;
    closeModal(popupProfileEdit);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    popupProfileEditSubmitButton.textContent = 'Сохранить';
  });
}

// слушатель на submit формы
const profileForm = document.querySelector('.popup__form');
profileForm.addEventListener('submit', (evt) => {
  handleFormSubmit(evt, profileForm.querySelector('.popup__button'), () => editProfileInfoOnServer(nameInput, jobInput), (data) => {
    profileTitle.textContent = data.name;
    profileDescription.textContent = data.about;
    closeModal(popupProfileEdit);
  });
});

// функция добавления новой карточки
let currentUserData;

function addNewCard(evt) {
  evt.preventDefault();
  
  const newCardData = {
    name: popupInputCardName.value,
    link: popupInputCardUrl.value
  };

  handleFormSubmit(evt, popupAddNewCardSubmitButton, () => postNewCard(newCardData), (cardData) => {
    cardsContainer.prepend(createCard(cardData, deleteCardCallback, likeButton, openImagePopup, cardLikeCounter, currentUserData._id));
    closeModal(popupNewCard);
  });
}

popupNewCard.addEventListener('submit', addNewCard);

//открытие попапа с картинкой
function openImagePopup(evt) {
  openModal(popupTypeImage);
  const card = evt.target.closest('.card');

  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');

  popupImage.src = cardImage.src;
  popupImage.alt = cardImage.alt;
  popupCaption.textContent = cardTitle.textContent;
}

enableValidation(validationConfig);

// установка данных пользователя в профиль
const profileImage = document.querySelector(".profile__image");

function setProfileUserData(userData) {
  profileImage.style.backgroundImage = `url('${userData.avatar}')`;
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
}

const popupEditAvatar = document.querySelector('.popup_type_edit_avatar');
profileImage.addEventListener('click', () => {
  openModal(popupEditAvatar);
})

// ждем выполнение запросов о данных пользователя и данных карточки, и вызываем их функции
Promise.all([getUserData(), getCardsData()])
  .then(([userData, cardsData]) => {
    currentUserData = userData;

    setProfileUserData(userData);

    cardsData.forEach((cardData) => {
      cardsContainer.append(createCard(cardData, deleteCardCallback, likeButton, openImagePopup, cardLikeCounter, currentUserData));
    });
  })
  .catch((err) => {
    console.log(err);
  });

// функция смены аватара
const formEditAvatar = popupEditAvatar.querySelector('.popup__form');
const popupAvatarInput = formEditAvatar.querySelector('.popup__input_type_url');
const popupAvatarButton = formEditAvatar.querySelector('.popup__button');

function changeAvatar() {
  handleFormSubmit(event, popupAvatarButton, () => changeAvatarOnServer(popupAvatarInput.value), (data) => {
    profileImage.style.backgroundImage = `url('${data.avatar}')`;
    closeModal(popupEditAvatar);
  });
}

formEditAvatar.addEventListener('submit', changeAvatar);

// функция удаления карточки
const popupToConfirmCardDeletion = document.querySelector('.popup_type_card-deletion');
let cardToDelete, cardToDeleteId;

const deleteCardCallback = (card, cardId) => {
  openModal(popupToConfirmCardDeletion);

  cardToDelete = card;
  cardToDeleteId = cardId;
};

const cardDeleteButtonConfirm = popupToConfirmCardDeletion.querySelector('.popup__button');
cardDeleteButtonConfirm.addEventListener('click', () => {
  deleteCardOnServer(cardToDeleteId)
    .then(() => {
      deleteCard(cardToDelete);
      closeModal(popupToConfirmCardDeletion);
    })
    .catch((err) => {
      console.log(err);
    });
});

enableValidation(validationConfig);