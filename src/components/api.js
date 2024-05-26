import { nameInput, jobInput } from "../index.js";

export const configAPI = {
    baseUrl: "https://nomoreparties.co/v1/wff-cohort-13",
    headers: {
    authorization: "fb9f069b-78bb-4d63-8810-b24cf002f635",
    "Content-Type": "application/json",
    },
};

// получение информации о профиле

export const getUserData = (config) => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: "GET",
      headers: config.headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(`Ошибка: ${res.status}`).catch((err) => {
        console.log(err);
      });
    });
  };

// получение информации о карточках с сервера

export const getCardsData = (config) => {
    return fetch(`${config.baseUrl}/cards`, {
      method: "GET",
      headers: config.headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
  
      return Promise.reject(`Ошибка: ${res.status}`).catch((err) => {
        console.log(err);
      });
    });
  };

// отправка и изменение данных профиля

export const editProfileInfoOnServer = (config) => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: "PATCH",
      headers: config.headers,
      body: JSON.stringify({
        name: nameInput.value,
        about: jobInput.value,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
  
      return Promise.reject(`Ошибка: ${res.status}`).catch((err) => {
        console.log(err);
      });
    });
  };

// отправка на сервер данных о новой карточке

export const postNewCard = (popupNameAndUrlData, config) => {
    return fetch(`${config.baseUrl}/cards`, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify({
        name: popupNameAndUrlData.name,
        link: popupNameAndUrlData.link,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
  
      return Promise.reject(`Ошибка: ${res.status}`).catch((err) => {
        console.log(err);
      });
    });
  };

// функция удаления карточки на сервере

export const deleteCardOnServer = (cardId, config) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: config.headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
  
      return Promise.reject(`Ошибка: ${res.status}`).catch((err) => {
        console.log(err);
      });
    });
  };

// функция постановки лайка, с отправкой данных на сервер

export const cardLikeButtonOn = (cardId, config) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: config.headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
  
      return Promise.reject(`Ошибка: ${res.status}`).catch((err) => {
        console.log(err);
      });
    });
  };

// функция удаления лайка, с отправкой данных на сервер

export const cardLikeButtonOff = (cardId, config) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: config.headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
  
      return Promise.reject(`Ошибка: ${res.status}`).catch((err) => {
        console.log(err);
      });
    });
  };

// запрос на смену аватара

export const changeAvatarOnServer = (avatarLink, config) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: config.headers,
      body: JSON.stringify({
        avatar: avatarLink,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
  
      return Promise.reject(`Ошибка: ${res.status}`).catch((err) => {
        console.log(err);
      });
    });
  };

  export const checkImageUrl = (avatarLink, config) => {
    return fetch(avatarLink, {
      method: "HEAD",
      headers: config.headers,
    })
      .then((res) => {
        if (res.ok) {
          const contentType = res.headers.get("Content-Type");
  
          if (contentType && contentType.startsWith("image/")) {
            return avatarLink;
          } else {
            return Promise.reject("Ссылка не на изображение");
          }
        }
  
        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

