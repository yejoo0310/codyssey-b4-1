import { header, scrollTopButton, navLinks, typingText } from "./dom.js";

import { closeMobileMenu } from "./menu.js";

/* 스크롤 이벤트 (스크롤 탑 버튼 + 스크롤 시 헤더 스타일 바꾸기) */

const SCROLL_TOP_VISIBLE_OFFSET = 300;
const HEADER_SCROLLED_OFFSET = 60;

const handleScroll = () => {
  const scrollY = window.scrollY;

  const shouldShowScrollTopButton = scrollY >= SCROLL_TOP_VISIBLE_OFFSET;
  const shouldShowHeaderStyle = scrollY >= HEADER_SCROLLED_OFFSET;

  scrollTopButton.classList.toggle("visible", shouldShowScrollTopButton);
  scrollTopButton.dataset.visible = String(shouldShowScrollTopButton);

  header.classList.toggle("scrolled", shouldShowHeaderStyle);
};

const initScrollEvents = () => {
  window.addEventListener("scroll", handleScroll);

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  handleScroll();
};

/* 네비게이션 링크 부드러운 스크롤 */
const initSmoothScroll = () => {
  navLinks.forEach((navLink) => {
    navLink.addEventListener("click", (event) => {
      event.preventDefault();

      const targetId = navLink.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      closeMobileMenu();
    });
  });
};

/* 스크롤 애니메이션 */
const initRevealAnimation = () => {
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
};


/*  Hero 타이핑 효과 */
const startTypingEffect = () => {
  if (!typingText) {
    return;
  }

  const fullText = typingText.textContent.trim();

  let currentIndex = 0;
  let isDeleting = false;

  const typingSpeed = 80;
  const deletingSpeed = 80;
  const pauseAfterTyping = 1200;
  const pauseAfterDeleting = 500;

  typingText.textContent = "";

  const type = () => {
    if (!isDeleting) {
      currentIndex += 1;
      typingText.textContent = fullText.slice(0, currentIndex);

      if (currentIndex === fullText.length) {
        isDeleting = true;
        setTimeout(type, pauseAfterTyping);
        return;
      }

      setTimeout(type, typingSpeed);
      return;
    }

    currentIndex -= 1;
    typingText.textContent = fullText.slice(0, currentIndex);

    if (currentIndex === 0) {
      isDeleting = false;
      setTimeout(type, pauseAfterDeleting);
      return;
    }

    setTimeout(type, deletingSpeed);
  };

  type();
};

export const initAnimation = () => {
  initScrollEvents();
  initSmoothScroll();
  initRevealAnimation();
  startTypingEffect();
};
