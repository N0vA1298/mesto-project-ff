import "./pages/index.css";
import { createCard, deleteCard, likeButton} from "./components/card.js";
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

//открытие попапа на клик

buttonOpenPopupProfile.addEventListener('click', function() {
  openEditProfile();
  clearValidation(popupProfileEdit.querySelector(validationConfig.formSelector), validationConfig);
});

buttonAddNewCard.addEventListener('click', function() {
  openModal(popupNewCard);
  clearValidation(popupNewCard.querySelector(validationConfig.formSelector), validationConfig);
});

popupNewCard.addEventListener('submit', (evt) => {
  addNewCard(evt);
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
  evt.preventDefault();
  editProfileInfo();
});

// функция добавления новой карточки

let currentUserData;

function addNewCard(evt) {
  evt.preventDefault();
  
  popupAddNewCardSubmitButton.textContent = 'Сохранение...';

  const newCardData = {
    name: popupInputCardName.value,
    link: popupInputCardUrl.value
  };

  postNewCard(newCardData)
  .then((cardData) => {
    return createCard(
      cardData,
      deleteCardCallback,
      likeButton,
      openImagePopup,
      cardLikeCounter,
      currentUserData.userId
    );
  })
  .then((res) => {
    cardsContainer.prepend(res);

})
.catch((err) => {
  console.log(err);
})
.finally(() => {
  popupAddNewCardSubmitButton.textContent = 'Сохранить';
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
  getUserData()
    .then((userData) => {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
    })
    .catch((err) => {
    console.log(err);
    });
}

const popupEditAvatar = document.querySelector('.popup_type_edit_avatar');
profileImage.addEventListener('click', () => {
  openModal(popupEditAvatar);
})

// ждем выполнение запросов о данных пользователя и данных карточки, и вызываем их функции

Promise.all([getUserData(), getCardsData()])
  .then(([userData, cardsData]) => {
    currentUserData = userData;
    setProfileUserData();

    cardsData.forEach((cardData) => {
      const makeCard = createCard(
        cardData,
        deleteCardCallback,
        likeButton,
        openImagePopup,
        cardLikeCounter,
        currentUserData
      );
      cardsContainer.append(makeCard);
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

  formEditAvatar.textContent = 'Сохранение...';

  profileImage.style.backgroundImage = `url('${popupAvatarInput.value}')`;

  const avatarLink = popupAvatarInput.value;

  checkImageUrl(avatarLink)
    .then(() => {
      return changeAvatarOnServer(avatarLink);
    })
    .then(() => {
      closeModal(popupEditAvatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      popupAvatarButton.textContent = 'Сохранить';
    })
};

formEditAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault();
  changeAvatar();
});

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
    try{
    deleteCardOnServer(cardToDeleteId)
    .then(() => {
      deleteCard(cardToDelete);
      closeModal(popupToConfirmCardDeletion);
    })
    } catch(err) {
        console.log(err);
      }
    });