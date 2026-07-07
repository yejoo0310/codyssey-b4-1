import { navMenu, menuToggleButton } from "./dom.js";

/* 햄버거 메뉴 토글 */
export const initMenu = () => {
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
};


/* 네비게이션 링크 클릭 시 모바일 메뉴 닫기 */
export const closeMobileMenu = () => {
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