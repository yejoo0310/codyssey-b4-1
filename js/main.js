/* =========================
   1. DOM 요소 선택
========================= */

// 전체 문서의 html 요소
const html = document.documentElement;

// Header
const header = document.querySelector(".site-header");

// Navigation
const navMenu = document.querySelector("[data-menu]");
const menuToggleButton = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".nav-link");

// Theme
const themeToggleButton = document.querySelector("[data-theme-toggle]");

// Scroll Top
const scrollTopButton = document.querySelector("[data-scroll-top]");

// Projects
const projectFilters = document.querySelector("[data-project-filters]");
const projectRegion = document.querySelector("[data-project-region]");

// Contact Form
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");
const contactSubmitButton = contactForm.querySelector('button[type="submit"]');

// From Error Messages
const nameError = document.querySelector('[data-error-for="name"]');
const emailError = document.querySelector('[data-error-for="email"]');
const messageError = document.querySelector('[data-error-for="message"]');

// Typing-text
const typingText = document.querySelector(".typing-text");

/* =========================
   2. 햄버거 메뉴 토글
========================= */

menuToggleButton.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  const isOpen = navMenu.classList.contains("active");

  menuToggleButton.setAttribute("aria-expanded", String(isOpen));
  menuToggleButton.setAttribute(
    "aria-label",
    isOpen ? "메뉴 닫기" : "메뉴 열기",
  );

  navMenu.dataset.open = String(isOpen);
});

/* =========================
   2-1. 네비게이션 링크 클릭 시 모바일 메뉴 닫기
========================= */

const closeMobileMenu = () => {
  navMenu.classList.remove("active");
  navMenu.dataset.open = "false";

  menuToggleButton.setAttribute("aria-expanded", "false");
  menuToggleButton.setAttribute("aria-label", "메뉴 열기");
};

/* 기본 앵커 이동 동작을 막고 JS로 구현
navLinks.forEach((navLink) => {
  navLink.addEventListener("click", () => {
    closeMobileMenu();
  });
});
*/

/* =========================
   3. 다크 모드 토글 + localStorage 저장 + 시스템 설정 감지
========================= */

const THEME_STORAGE_KEY = "portfolio-theme";

const applyTheme = (theme) => {
  html.dataset.theme = theme;

  themeToggleButton.textContent = theme === "dark" ? "☀️" : "🌙";

  themeToggleButton.setAttribute(
    "aria-label",
    theme === "dark" ? "라이트 모드 전환" : "다크 모드 전환",
  );
};

const getSystemTheme = () => {
  const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return preferDark ? "dark" : "light";
};

const initTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
    return;
  }

  const systemTheme = getSystemTheme();
  /* 기존에는 localStorage에 테마가 저장되어 있지 않으면 기본 라이트 모드로 설정했음
  applyTheme("light");
  */
  applyTheme(systemTheme);
};

const systemThemeMedia = window.matchMedia("(prefers-color-scheme: dark)");

systemThemeMedia.addEventListener("change", () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    return;
  }

  applyTheme(getSystemTheme());
});

themeToggleButton.addEventListener("click", () => {
  const currentTheme = html.dataset.theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});

initTheme();

/* =========================
   4. 스크롤 이벤트 (스크롤 탑 버튼 + 스크롤 시 헤더 스타일 바꾸기)
========================= */

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

window.addEventListener("scroll", handleScroll);

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

handleScroll();

/* =========================
   5. 네비게이션 링크 부드러운 스크롤
========================= */

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

/* =========================
   6. 스크롤 애니메이션
========================= */

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

/* =========================
   7. Contact 폼 유효성 검사 + Formspree로 폼 실제 전송
========================= */

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
contactForm.addEventListener("submit", async (event) => {
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
});

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

/* =========================
   8. GitHub API 연동 + Projects 렌더링
========================= */

const GITHUB_USERNAME = "yejoo0310";
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

let githubRepos = [];
let selectedLanguage = "All";

const renderProjectLoading = () => {
  projectRegion.innerHTML = `
    <div class="project-status">
      <p class="loading-message">프로젝트 불러오는 중...</p>
    </div>
  `;
};

const renderProjectError = () => {
  projectRegion.innerHTML = `
    <div class="project-status">
      <p class="error-message">프로젝트를 불러올 수 없습니다.</p>
      <button type="button" class="button secondary-button" data-project-retry>
        다시 시도
      </button>
    </div>
  `;

  const retryButton = projectRegion.querySelector("[data-project-retry]");

  retryButton.addEventListener("click", () => {
    fetchGitHubProjects();
  });
};

const renderProjectEmpty = () => {
  projectRegion.innerHTML = `
    <div class="project-status">
      <p>표시할 프로젝트가 없습니다.</p>
    </div>
  `;
};

const createProjectCard = (repo) => {
  const {
    name,
    description,
    html_url,
    language,
    stargazers_count,
    forks_count,
  } = repo;

  return `
    <article class="project-card">
      <div class="project-card-header">
        <h3>${name}</h3>
        <span class="project-language">${language || "기타"}</span>
      </div>

      <p class="project-description">
        ${description || "저장소 설명이 없습니다."}
      </p>

      <ul class="project-meta">
        <li>⭐ ${stargazers_count}</li>
        <li>🍴 ${forks_count}</li>
      </ul>

      <a
        href="${html_url}"
        class="project-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub에서 보기
      </a>
    </article>
  `;
};

const renderProjectList = (repos) => {
  const projectCards = repos.map((repo) => createProjectCard(repo)).join("");

  projectRegion.innerHTML = `
    <div class="project-grid">
      ${projectCards}
    </div>
  `;
};

const renderProjectFilters = (repos) => {
  const languages = repos
    .map((repo) => repo.language)
    .filter((language) => language !== null);

  const uniqueLanguages = ["All", ...new Set(languages)];

  const filterButtons = uniqueLanguages
    .map((language) => {
      const isActive = language === selectedLanguage;

      return `
        <button
          type="button"
          class="project-filter-button ${isActive ? "active" : ""}"
          data-project-filter="${language}"
        >
          ${language}
        </button>
      `;
    })
    .join("");

  projectFilters.innerHTML = filterButtons;
};

const renderFilteredProjects = () => {
  const filteredRepos =
    selectedLanguage === "All"
      ? githubRepos
      : githubRepos.filter((repo) => repo.language === selectedLanguage);

  if (filteredRepos.length === 0) {
    renderProjectEmpty();
    return;
  }

  renderProjectList(filteredRepos);
};

const bindProjectFilterEvents = () => {
  const filterButtons = projectFilters.querySelectorAll(
    "[data-project-filter]",
  );

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedLanguage = button.dataset.projectFilter;

      renderProjectFilters(githubRepos);
      bindProjectFilterEvents();
      renderFilteredProjects();
    });
  });
};

// test
PROJECT_DEMO_STATE = "";

// loading test용 delay 함수
const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const fetchGitHubProjects = async () => {
  if (PROJECT_DEMO_STATE === "loading") {
    projectFilters.innerHTML = "";
    renderProjectLoading();
    return;
  }

  if (PROJECT_DEMO_STATE === "empty") {
    projectFilters.innerHTML = "";
    renderProjectEmpty();
    return;
  }

  if (PROJECT_DEMO_STATE === "error") {
    projectFilters.innerHTML = "";
    renderProjectError();
    return;
  }

  try {
    renderProjectLoading();

    // 로딩 상태 확인용 지연 시간
    await delay(1500);

    const response = await fetch(GITHUB_REPOS_URL);

    // 테스트용: 레이트 리밋 상황을 강제로 만든다.
    // throw new Error('GitHub API rate limit 테스트');

    if (!response.ok) {
      throw new Error("GitHub API 요청에 실패했습니다.");
    }

    const repos = await response.json();

    if (repos.length === 0) {
      projectFilters.innerHTML = "";
      renderProjectEmpty();
      return;
    }

    githubRepos = repos;
    selectedLanguage = "All";

    renderProjectFilters(githubRepos);
    bindProjectFilterEvents();
    renderFilteredProjects();
  } catch (error) {
    console.error(error);
    projectFilters.innerHTML = "";
    renderProjectError();
  }
};

fetchGitHubProjects();

/* =========================
   9. Hero 타이핑 효과
========================= */

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

startTypingEffect();
