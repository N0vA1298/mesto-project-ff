//открытие попапов

export function openModal(element) {
    element.classList.add("popup_is-opened");
    document.addEventListener("keydown", closePopupWithEsc);
    element.addEventListener("click", closePopupOnClick);
    document.addEventListener("click", popupCloseOnOverlay);
  };
  
  //закрытие попапов
  
  export function closeModal(element) {
    element.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", closePopupWithEsc);
    element.removeEventListener("click", closePopupOnClick);
    document.removeEventListener("click", popupCloseOnOverlay);
  };
  
  //функция закрытия на кнопку esc
  
  function closePopupWithEsc(evt) {
    if (evt.key === 'Escape') {
      const openedPopup = document.querySelector('.popup_is-opened');
      if (openedPopup) {
        closeModal(openedPopup);
      }
    }
  };
  
  // закрытие попапов на клик
  
  function closePopupOnClick(evt) {
    const closeOnButton = evt.target.closest('.popup__close');
    if (closeOnButton) {
      const popup = closeOnButton.closest('.popup');
      if (popup) {
        closeModal(popup);
      }
    }
  };
  
  // закрытие попапов на клик оверлея
  
  function popupCloseOnOverlay(evt) {
    if (evt.target.classList.contains('popup')) {
      closeModal(evt.target);
    }
  }


// добавляем функцию для обработки отправки формы

  async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
        });

        if (response.ok) {
            const popup = form.closest('.popup');
            if (popup) {
                closeModal(popup);
            }
        } else {
            console.error('Form submission failed', response.statusText);
        }
    } catch (error) {
        console.error('Form submission error', error);
    }
}

// привязываем обработчик к формам
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
});