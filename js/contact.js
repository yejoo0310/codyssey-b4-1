import {
  contactForm,
  formStatus,
  nameInput,
  emailInput,
  messageInput,
  contactSubmitButton,
  nameError,
  emailError,
  messageError,
} from "./dom.js";

/* Contact 폼 유효성 검사 + Formspree로 폼 실제 전송 */
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const setError = (inputElement, errorElement, message) => {
  inputElement.classList.add("error");
  errorElement.textContent = message;
};

const clearError = (inputElement, errorElement) => {
  inputElement.classList.remove("error");
  errorElement.textContent = "";
};

const validateName = () => {
  const nameValue = nameInput.value.trim();

  if (nameValue == "") {
    setError(nameInput, nameError, "이름을 입력해주세요.");
    return false;
  }

  clearError(nameInput, nameError);
  return true;
};

const validateEmail = () => {
  const emailValue = emailInput.value.trim();

  if (emailValue == "") {
    setError(emailInput, emailError, "이메일을 입력해주세요.");
    return false;
  }

  if (!emailPattern.test(emailValue)) {
    setError(emailInput, emailError, "올바른 이메일 형식으로 입력해주세요.");
    return false;
  }

  clearError(emailInput, emailError);
  return true;
};

const validateMessage = () => {
  const messageValue = messageInput.value.trim();

  if (messageValue == "") {
    setError(messageInput, messageError, "메시지를 입력해주세요.");
    return false;
  }

  clearError(messageInput, messageError);
  return true;
};

// Formspree로 폼 실제 전송
const handleContactSubmit = async (event) => {
  event.preventDefault();

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isMessageValid = validateMessage();

  const isFormValid = isNameValid && isEmailValid && isMessageValid;

  if (!isFormValid) {
    formStatus.textContent = "";
    return;
  }

  try {
    contactSubmitButton.disabled = true;
    formStatus.textContent = "메시지를 전송하는 중입니다...";

    const formData = new FormData(contactForm);

    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("폼 전송에 실패했습니다.");
    }

    formStatus.textContent = "메시지가 성공적으로 전송되었습니다. 감사합니다!";
    contactForm.reset();
  } catch (error) {
    console.error(error);
    formStatus.textContent =
      "메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
  } finally {
    contactSubmitButton.disabled = false;
  }
};

export const initContactForm = () => {
    contactForm.addEventListener("submit", handleContactSubmit);
  nameInput.addEventListener("input", () => {
    validateName();
    formStatus.textContent = "";
  });

  emailInput.addEventListener("input", () => {
    validateEmail();
    formStatus.textContent = "";
  });

  messageInput.addEventListener("input", () => {
    validateMessage();
    formStatus.textContent = "";
  });
};
