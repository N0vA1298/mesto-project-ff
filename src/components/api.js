const configAPI = {
    baseUrl: "https://nomoreparties.co/v1/wff-cohort-13",
    headers: {
    authorization: "fb9f069b-78bb-4d63-8810-b24cf002f635",
    "Content-Type": "application/json",
    },
};

const handleResponse = (res) => {
    if(res.ok) {
      return res.json();
    }
  
    return Promise.reject(`Ошибка: ${res.status}`)
  }
  
// получение информации о профиле

export const getUserData = () => {
    return fetch(`${configAPI.baseUrl}/users/me`, {
      method: "GET",
      headers: configAPI.headers,
    })
      .then(handleResponse);
  };

// получение информации о карточках с сервера

export const getCardsData = () => {
    return fetch(`${configAPI.baseUrl}/cards`, {
      method: "GET",
      headers: configAPI.headers,
    }).then(handleResponse);
  };

// отправка и изменение данных профиля

export const editProfileInfoOnServer = (nameInput, jobInput) => {
    return fetch(`${configAPI.baseUrl}/users/me`, {
      method: "PATCH",
      headers: configAPI.headers,
      body: JSON.stringify({
        name: nameInput.value,
        about: jobInput.value,
      }),
    }).then(handleResponse);
  };

// отправка на сервер данных о новой карточке

export const postNewCard = (popupNameAndUrlData) => {
    return fetch(`${configAPI.baseUrl}/cards`, {
      method: "POST",
      headers: configAPI.headers,
      body: JSON.stringify({
        name: popupNameAndUrlData.name,
        link: popupNameAndUrlData.link,
      }),
    }).then(handleResponse);
  };

// функция удаления карточки на сервере

export const deleteCardOnServer = (cardId) => {
    return fetch(`${configAPI.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: configAPI.headers,
    }).then(handleResponse);
  };

// функция постановки лайка, с отправкой данных на сервер

export const cardLikeButtonOn = (cardId) => {
    return fetch(`${configAPI.baseUrl}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: configAPI.headers,
    }).then(handleResponse);
  };

// функция удаления лайка, с отправкой данных на сервер

export const cardLikeButtonOff = (cardId) => {
    return fetch(`${configAPI.baseUrl}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: configAPI.headers,
    }).then(handleResponse);
  };

// запрос на смену аватара

export const changeAvatarOnServer = (avatarLink) => {
    return fetch(`${configAPI.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: configAPI.headers,
      body: JSON.stringify({
        avatar: avatarLink,
      }),
    }).then(handleResponse);
  };

  export const checkImageUrl = (avatarLink) => {
    return fetch(avatarLink, {
      method: "HEAD",
      headers: configAPI.headers,
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

