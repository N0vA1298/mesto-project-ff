// функция обработчик всех инпутов формы

function setEventListeners(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  togglePopupButtonState(inputList, buttonElement, validationConfig);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
        checkInputValidation(formElement, inputElement, validationConfig);
        togglePopupButtonState(inputList, buttonElement, validationConfig);
    });
  });
};

// функция валидации формы

export function enableValidation(validationConfig) {
  const formList = Array.from(
    document.querySelectorAll(validationConfig.formSelector)
  );

  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, validationConfig);
  });
};

// функция показа ошибки у инпута формы

function showPopupInputError(formElement, inputElement, errorMessage, validationConfig) {
  const formInputError = formElement.querySelector(`.${inputElement.id}-error`);
  formInputError.textContent = errorMessage;
  formInputError.classList.add(validationConfig.errorClass);
  inputElement.classList.add(validationConfig.inputErrorClass);
};

// функция скрытия ошибки у инпута формы

function hidePopupInputError(formElement, inputElement, validationConfig) {
  const formInputError = formElement.querySelector(`.${inputElement.id}-error`);
  formInputError.textContent = "";
  formInputError.classList.remove(validationConfig.errorClass);
  inputElement.classList.remove(validationConfig.inputErrorClass);
};

// функция валидации инпута

function checkInputValidation(formElement, inputElement, validationConfig) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showPopupInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      validationConfig
    );
  } else {
    hidePopupInputError(formElement, inputElement, validationConfig);
  }
};

// функция поиска невалидного инпута

function invalidInput(inputList) {
  return inputList.some((listElement) => {
    return !listElement.validity.valid;
  });
};

// функция переключения кнопки в активную или наоборот

function togglePopupButtonState(inputList, buttonElement, validationConfig) {
  if (invalidInput(inputList)) {
    buttonElement.setAttribute("disabled", "");
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.removeAttribute("disabled", "");
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

// функция очистки ошибок полей ввода в попапе

export function clearValidation(formElement, validationConfig) {
  const inputErrorList = Array.from(
    formElement.querySelectorAll(`.${validationConfig.inputErrorClass}`)
  );
  inputErrorList.forEach((inputElement) => {
    hidePopupInputError(formElement, inputElement, validationConfig);
  });

  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  formElement.reset();
  togglePopupButtonState(inputList, buttonElement, validationConfig);
};