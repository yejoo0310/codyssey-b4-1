import { html, themeToggleButton } from "./dom.js";

/* 다크 모드 토글 + localStorage 저장 + 시스템 설정 감지 */
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

export const initThemeToggle = () => {
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
};
