import "./pages/index.css";
import { createCard, deleteCard, likeButton } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getUserData, getCardsData, editProfileInfoOnServer, postNewCard, changeAvatarOnServer, configAPI, checkImageUrl } from './components/api.js';


const cardsContainer = document.querySelector('.places__list');
const editButtonProfile = document.querySelector('.profile__edit-button');
const popupProfileEdit = document.querySelector('.popup_type_edit');
const addNewCardButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');
const popupInputCardName = popupNewCard.querySelector('.popup__input_type_card-name');
const popupInputCardUrl = popupNewCard.querySelector('.popup__input_type_url');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

//открытие попапа на клик

editButtonProfile.addEventListener('click', function() {
  openEditProfile();
  clearValidation(popupProfileEdit.querySelector(validationConfig.formSelector), validationConfig);
});

addNewCardButton.addEventListener('click', function() {
  openModal(popupNewCard);
  clearValidation(popupNewCard.querySelector(validationConfig.formSelector), validationConfig);
});

popupNewCard.addEventListener('submit', (evt) => {
  addNewCard(evt);
});

// открытие редактирования профиля

export const nameInput = document.querySelector(".popup__input_type_name");
export const jobInput = document.querySelector(".popup__input_type_description");

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

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  editProfileInfoOnServer(configAPI)
  .then(() => {
    popupProfileEditSubmitButton.textContent = 'Сохранить';
    closeModal(popupProfileEdit);
  })
}

// слушатель на submit формы

const profileForm = document.querySelector('.popup__form');

profileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  editProfileInfo();
});

// функция добавления новой карточки

function addNewCard(evt) {
  evt.preventDefault();

  const popupAddNewCardSubmitButton = popupNewCard.querySelector('.popup__button');
  popupAddNewCardSubmitButton.textContent = 'Сохранение...';

  const newCardData = {
    name: popupInputCardName.value,
    link: popupInputCardUrl.value
  };

  Promise.all([postNewCard(newCardData, configAPI), getUserData(configAPI)])
  .then(([cardData, userData]) => {
    return createCard(
      cardData,
      deleteCard,
      likeButton,
      openImagePopup,
      cardLikeCounter,
      userData
    );
  })
  .then((res) => {
    cardsContainer.prepend(res);

  popupInputCardName.value = '';
  popupInputCardUrl.value = '';

  popupAddNewCardSubmitButton.textContent = 'Сохранить';
})
.then(() => {
  closeModal(popupNewCard);
})
}

//открытие попапа с картинкой

function openImagePopup(evt) {
  openModal(popupTypeImage);
  const card = evt.target.closest('.card');

  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');

  popupImage.src = cardImage.src;
  popupImage.alt = cardImage.alt;
  popupCaption.textContent = cardTitle.textContent;
};

enableValidation(validationConfig);

// установка данных пользователя в профиль

const profileImage = document.querySelector(".profile__image");

function setProfileUserData() {
  getUserData(configAPI)
    .then((userData) => {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
    });
}

const popupEditAvatar = document.querySelector('.popup_type_edit_avatar');
profileImage.addEventListener('click', () => {
  openModal(popupEditAvatar);
})

// ждем выполнение запросов о данных пользователя и данных карточки, и вызываем их функции

Promise.all([getUserData(configAPI), getCardsData(configAPI)])
  .then(([userData, cardsData]) => {
    setProfileUserData();

    cardsData.forEach((cardData) => {
      const makeCard = createCard(
        cardData,
        deleteCard,
        likeButton,
        openImagePopup,
        cardLikeCounter,
        userData
      );
      cardsContainer.append(makeCard);
    });
  });

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

// функция смены аватара

const popupTypeAvatar = document.querySelector('.popup_type_edit_avatar');
function changeAvatar() {
  const popupAvatarInput = popupTypeAvatar.querySelector('.popup__input_type_url');
  const popupAvatarButton = popupTypeAvatar.querySelector('.popup__button');
  popupAvatarButton.textContent = 'Сохранение...';
  profileImage.style.backgroundImage = `url('${popupAvatarInput.value}')`;
  const avatarLink = popupAvatarInput.value;

  checkImageUrl(avatarLink, configAPI)
    .then(() => {
      return changeAvatarOnServer(avatarLink, configAPI);
    })
    .then(() => {
      popupAvatarInput.value = '';
      popupAvatarButton.textContent = 'Сохранить';
      closeModal(popupTypeAvatar);
    })
};

popupTypeAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault();
  changeAvatar();
});