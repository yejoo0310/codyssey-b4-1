import {
    projectFilters,
    projectRegion,
} from "./dom.js";


/* GitHub API 연동 + Projects 렌더링 */
const GITHUB_USERNAME = "yejoo0310";
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

// 테스트용 상태
// "" | "loading" | "empty" | "error"
const PROJECT_DEMO_STATE = "";

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

// loading test용 delay 함수
const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const fetchGitHubProjects = async () => {
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