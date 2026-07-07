// 전체 문서의 html 요소
export const html = document.documentElement;

// Header
export const header = document.querySelector(".site-header");

// Navigation
export const navMenu = document.querySelector("[data-menu]");
export const menuToggleButton = document.querySelector("[data-menu-toggle]");
export const navLinks = document.querySelectorAll(".nav-link");

// Theme
export const themeToggleButton = document.querySelector("[data-theme-toggle]");

// Scroll Top
export const scrollTopButton = document.querySelector("[data-scroll-top]");

// Projects
export const projectFilters = document.querySelector("[data-project-filters]");
export const projectRegion = document.querySelector("[data-project-region]");

// Contact Form
export const contactForm = document.querySelector("[data-contact-form]");
export const formStatus = document.querySelector("[data-form-status]");
export const nameInput = document.querySelector("#name");
export const emailInput = document.querySelector("#email");
export const messageInput = document.querySelector("#message");
export const contactSubmitButton = contactForm.querySelector('button[type="submit"]');

// From Error Messages
export const nameError = document.querySelector('[data-error-for="name"]');
export const emailError = document.querySelector('[data-error-for="email"]');
export const messageError = document.querySelector('[data-error-for="message"]');

// Typing-text
export const typingText = document.querySelector(".typing-text");