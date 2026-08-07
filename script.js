const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const capabilitySearchInput = document.querySelector("#capability-search-input");
const sidebar = document.querySelector(".sidebar");
const navToggle = document.querySelector("#nav-toggle");
const navStateKey = "ccv-nav-collapsed";
const logoAssetPath = "assets/salesforce-logo.jpg";

function safeGetStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures in restricted embed contexts.
  }
}

const capabilitySearchIndex = [
  { code: "C1", name: "Support Engineer Brief", description: "Creates an instant pre-case brief from CRM service history, open issues, and recent interactions.", location: "Vignette 1", pageTitle: "Capability: Support Engineer Brief", pageHref: "capability-support-brief.html" },
  { code: "C2", name: "Knowledge Grounded Answers", description: "Returns trusted responses grounded in internal documentation and approved knowledge guidance.", location: "Vignette 2", pageTitle: "Capability: Knowledge Grounded Answers", pageHref: "capability-knowledge-grounding.html" },
  { code: "C3", name: "Stakeholder Relationship Mapping", description: "Synthesizes stakeholders, engagement history, and exposure gaps ahead of renewal leadership meetings.", location: "Vignette 3", pageTitle: "Capability: Stakeholder Relationship Mapping", pageHref: "capability-stakeholder-map.html" },
  { code: "C4", name: "Delegated Action Loop", description: "Combines grounded retrieval and delegated write actions to move from insight to execution in one flow.", location: "Vignette 4", pageTitle: "Capability: Delegated Action Loop", pageHref: "capability-delegated-action.html" },
];

const normalize = (value) => value.toLowerCase().trim();
const currentPath = window.location.pathname.split("/").pop() || "index.html";

if (navToggle) {
  const applySidebarLayout = (collapsed) => {
    if (!sidebar) return;
    sidebar.style.display = collapsed ? "none" : "";
    const appShell = document.querySelector(".app-shell");
    if (appShell) {
      appShell.style.gridTemplateColumns = collapsed ? "0 1fr" : "";
    }
  };

  const setToggleState = (collapsed) => {
    document.body.classList.toggle("nav-collapsed", collapsed);
    navToggle.textContent = collapsed ? "Show Navigation" : "Hide Navigation";
    applySidebarLayout(collapsed);
  };

  const storedState = safeGetStorage(navStateKey) === "true";
  setToggleState(storedState);

  navToggle.addEventListener("click", () => {
    const collapsed = !document.body.classList.contains("nav-collapsed");
    setToggleState(collapsed);
    safeSetStorage(navStateKey, String(collapsed));
  });
}

navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (!href) return;
  const [path] = href.split("#");
  link.classList.toggle("active", (path || "index.html") === currentPath);
});

document.querySelectorAll(".card").forEach((card) => card.classList.add("card-floating"));
document.querySelectorAll(".salesforce-logo-wrap img").forEach((logo) => {
  if (!logo.getAttribute("src") || logo.getAttribute("src").includes("public/salesforce-logo.jpg")) {
    logo.src = logoAssetPath;
  }
});

const brandBlock = document.querySelector(".sidebar .brand");
const sidebarLogoWrap = document.querySelector(".sidebar .salesforce-logo-wrap");
if (brandBlock && sidebarLogoWrap && !brandBlock.contains(sidebarLogoWrap)) {
  brandBlock.appendChild(sidebarLogoWrap);
}

if (capabilitySearchInput && sidebar) {
  const searchCard = document.createElement("div");
  searchCard.className = "capability-results-card hidden";
  searchCard.innerHTML = `<div class="capability-results-header"><p>Capability Search Results</p><button type="button" class="capability-results-close" aria-label="Close capability search results">Close</button></div><ul class="capability-results-list" role="listbox" aria-label="Capability search results"></ul>`;
  capabilitySearchInput.parentElement.appendChild(searchCard);

  const closeButton = searchCard.querySelector(".capability-results-close");
  const resultsList = searchCard.querySelector(".capability-results-list");
  let highlightedIndex = -1;
  let lastQuery = "";
  let lastResults = [];

  const renderResults = () => {
    resultsList.innerHTML = "";
    if (!lastResults.length) {
      resultsList.innerHTML = `<li class="capability-results-empty">No capabilities match this search yet.</li>`;
      return;
    }
    lastResults.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "capability-result-item";
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(index === highlightedIndex));
      li.innerHTML = `<a href="${item.pageHref}"><div class="capability-result-top"><span class="capability-result-code">${item.code}</span><strong>${item.name}</strong></div><p>${item.description}</p><small>${item.location} · ${item.pageTitle}</small></a>`;
      resultsList.appendChild(li);
    });
  };

  const openResultsCard = () => searchCard.classList.remove("hidden");
  const closeResultsCard = () => searchCard.classList.add("hidden");

  const updateSearch = (query) => {
    lastQuery = query;
    const term = normalize(query);
    lastResults = capabilitySearchIndex.filter((item) => {
      const haystack = normalize(`${item.code} ${item.name} ${item.description} ${item.location} ${item.pageTitle}`);
      return !term || haystack.includes(term);
    });
    highlightedIndex = lastResults.length ? 0 : -1;
    renderResults();
    openResultsCard();
  };

  capabilitySearchInput.addEventListener("input", (event) => updateSearch(event.target.value));
  capabilitySearchInput.addEventListener("focus", () => {
    capabilitySearchInput.value = lastQuery;
    if (!lastResults.length && !lastQuery) {
      lastResults = capabilitySearchIndex;
      highlightedIndex = 0;
      renderResults();
    }
    openResultsCard();
  });

  capabilitySearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") return closeResultsCard();
    if (!lastResults.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % lastResults.length;
      return renderResults();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      highlightedIndex = (highlightedIndex - 1 + lastResults.length) % lastResults.length;
      return renderResults();
    }
    if (event.key === "Enter" && highlightedIndex >= 0) {
      window.location.href = lastResults[highlightedIndex].pageHref;
    }
  });

  closeButton.addEventListener("click", closeResultsCard);
  document.addEventListener("click", (event) => {
    const clickInsideSearch = capabilitySearchInput.contains(event.target) || searchCard.contains(event.target);
    if (!clickInsideSearch) closeResultsCard();
  });

  updateSearch("");
  closeResultsCard();
}
