const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const capabilitySearchInput = document.querySelector("#capability-search-input");
const sidebar = document.querySelector(".sidebar");
const navToggle = document.querySelector("#nav-toggle");
const navStateKey = "ccv-nav-collapsed";
const logoAssetPath = "assets/salesforce-logo.jpg";
const faviconAssetPath = "assets/blackbaud-favicon.png";

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

const trailheadEnablementByPage = {
  "capability-support-brief.html": {
    title: "Suggested Trailhead Enablement",
    summary: "Build rapid service-readiness capability with role-specific learning paths aligned to support briefing and knowledge-led case resolution.",
    tracks: [
      {
        role: "Service Admin",
        links: [
          { label: "Enhance Agentforce Service with Lightning Knowledge", href: "https://trailhead.salesforce.com/en/content/learn/trails/enhance-service-cloud-with-lightning-knowledge" },
          { label: "Implement Agentforce Service", href: "https://trailhead.salesforce.com/en/content/learn/trails/implement-agentforce-service" },
        ],
      },
      {
        role: "Service Operations",
        links: [
          { label: "Build with Agentforce for Service", href: "https://trailhead.salesforce.com/en/content/learn/trails/build-with-agentforce-for-service" },
          { label: "Discover Agentforce Service", href: "https://trailhead.salesforce.com/en/content/learn/trails/discover-agentforce-service" },
        ],
      },
    ],
  },
  "capability-knowledge-grounding.html": {
    title: "Suggested Trailhead Enablement",
    summary: "Strengthen grounded response quality with prompt design, agent builder fluency, and trust-aware orchestration skills.",
    tracks: [
      {
        role: "Prompt Designer",
        links: [
          { label: "Get Started with Prompts and Prompt Builder", href: "https://trailhead.salesforce.com/en/content/learn/trails/get-started-with-prompts-and-prompt-studio" },
          { label: "Take a Tour of the New Agentforce Builder", href: "https://trailhead.salesforce.com/en/content/learn/trails/get-ready-for-the-new-agentforce-builder" },
        ],
      },
      {
        role: "Builder",
        links: [
          { label: "Build an AI Agent with Agentforce", href: "https://trailhead.salesforce.com/en/content/learn/trails/build-ai-assistants-with-einstein-copilot" },
          { label: "Build with Agentforce for Service", href: "https://trailhead.salesforce.com/en/content/learn/trails/build-with-agentforce-for-service" },
        ],
      },
    ],
  },
  "capability-stakeholder-map.html": {
    title: "Suggested Trailhead Enablement",
    summary: "Improve stakeholder intelligence and renewal planning with learning paths focused on pipeline analytics, selling models, and account optimization.",
    tracks: [
      {
        role: "Sales Leader",
        links: [
          { label: "Agentforce Sales: Drive Pipeline Efficiency", href: "https://trailhead.salesforce.com/en/content/learn/trails/agentforce-sales-drive-pipeline-efficiency-with-analytics-and-ai" },
          { label: "Optimize Sales Features for Lightning Experience", href: "https://trailhead.salesforce.com/en/content/learn/trails/sales_admin" },
        ],
      },
      {
        role: "Revenue Strategy",
        links: [
          { label: "Agentforce Sales: Become a Selling Specialist", href: "https://trailhead.salesforce.com/en/content/learn/trails/become-a-selling-specialist" },
          { label: "Succeed with Relationship Selling", href: "https://trailhead.salesforce.com/en/content/learn/trails/succeed-with-relationship-selling" },
        ],
      },
    ],
  },
  "capability-delegated-action.html": {
    title: "Suggested Trailhead Enablement",
    summary: "Operationalize delegated actions through low-code automation, flow control patterns, and agent action design.",
    tracks: [
      {
        role: "Automation Admin",
        links: [
          { label: "Build Flows with Flow Builder", href: "https://trailhead.salesforce.com/en/content/learn/trails/build-flows-with-flow-builder" },
          { label: "Implement Low-Code Automation", href: "https://trailhead.salesforce.com/en/content/learn/trails/implement-low-code-automation" },
        ],
      },
      {
        role: "Agent Builder",
        links: [
          { label: "Build Agentforce Solutions with Low-Code Tools", href: "https://trailhead.salesforce.com/en/content/learn/trails/build-agentforce-solutions-with-low-code-tools" },
          { label: "Build an AI Agent with Agentforce", href: "https://trailhead.salesforce.com/en/content/learn/trails/build-ai-assistants-with-einstein-copilot" },
        ],
      },
    ],
  },
  "capability-map.html": {
    title: "Enablement Sequencing by Phase",
    summary: "Use this learning path sequence to align delivery waves with workforce readiness, governance confidence, and measurable execution quality.",
    tracks: [
      {
        role: "Phase 1: Foundations",
        links: [
          { label: "Get Started with Prompts and Prompt Builder", href: "https://trailhead.salesforce.com/en/content/learn/trails/get-started-with-prompts-and-prompt-studio" },
          { label: "Build Agentforce Solutions with Low-Code Tools", href: "https://trailhead.salesforce.com/en/content/learn/trails/build-agentforce-solutions-with-low-code-tools" },
        ],
      },
      {
        role: "Phase 2: Data + Trust",
        links: [
          { label: "Unlock Your Data with Data Cloud", href: "https://trailhead.salesforce.com/en/content/learn/trails/unlock-your-data-with-data-cloud" },
          { label: "Administer Data 360", href: "https://trailhead.salesforce.com/en/content/learn/trails/administer-customer-data-platform" },
        ],
      },
      {
        role: "Phase 3: Scale + Governance",
        links: [
          { label: "Build Your Architect Career on Salesforce", href: "https://trailhead.salesforce.com/en/content/learn/trails/salesforce-architect-careers" },
          { label: "Secure Your Apps with Salesforce Shield", href: "https://trailhead.salesforce.com/en/content/learn/trails/shield" },
        ],
      },
    ],
  },
  "salesforce-summary.html": {
    title: "Role-Based Trailhead Enablement",
    summary: "Curated learning recommendations connect each Salesforce domain to the skills required for durable adoption and governed scale.",
    tracks: [
      {
        role: "Data & AI Domain",
        links: [
          { label: "Model Data in Data 360", href: "https://trailhead.salesforce.com/en/content/learn/trails/model-data-in-customer-data-platform" },
          { label: "Use Data Insights Across Salesforce", href: "https://trailhead.salesforce.com/en/content/learn/trails/use-data-insights-across-cloud" },
        ],
      },
      {
        role: "Service Domain",
        links: [
          { label: "Build with Agentforce for Service", href: "https://trailhead.salesforce.com/en/content/learn/trails/build-with-agentforce-for-service" },
          { label: "Enhance Agentforce Service with Lightning Knowledge", href: "https://trailhead.salesforce.com/en/content/learn/trails/enhance-service-cloud-with-lightning-knowledge" },
        ],
      },
      {
        role: "Integration Domain",
        links: [
          { label: "Get Started with MuleSoft Composer", href: "https://trailhead.salesforce.com/en/content/learn/trails/get-started-with-mulesoft-composer" },
          { label: "Deliver IT Success with MuleSoft Catalyst", href: "https://trailhead.salesforce.com/en/content/learn/trails/deliver-it-success-with-mulesoft-catalyst" },
        ],
      },
    ],
  },
};

const normalize = (value) => value.toLowerCase().trim();
const currentPath = window.location.pathname.split("/").pop() || "index.html";

const existingFavicon = document.querySelector('link[rel="icon"]');
if (existingFavicon) {
  existingFavicon.setAttribute("href", faviconAssetPath);
} else {
  const faviconLink = document.createElement("link");
  faviconLink.setAttribute("rel", "icon");
  faviconLink.setAttribute("type", "image/png");
  faviconLink.setAttribute("href", faviconAssetPath);
  document.head.appendChild(faviconLink);
}

if (navToggle) {
  const setToggleState = (collapsed) => {
    document.body.classList.toggle("nav-collapsed", collapsed);
    navToggle.textContent = collapsed ? "Show Navigation" : "Hide Navigation";
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
  logo.classList.add("brand-logo");
});

const brandBlock = document.querySelector(".sidebar .brand");
const sidebarLogoWrap = document.querySelector(".sidebar .salesforce-logo-wrap");
if (brandBlock && sidebarLogoWrap && !brandBlock.contains(sidebarLogoWrap)) {
  sidebarLogoWrap.classList.add("logo-pill");
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

const enablementContent = trailheadEnablementByPage[currentPath];
if (enablementContent) {
  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    const section = document.createElement("section");
    section.className = "section trailhead-enablement";

    const tracksHtml = enablementContent.tracks
      .map(
        (track) => `
          <article class="card">
            <h4>${track.role}</h4>
            <ul>
              ${track.links
                .map(
                  (link) =>
                    `<li><a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a></li>`,
                )
                .join("")}
            </ul>
          </article>
        `,
      )
      .join("");

    section.innerHTML = `
      <h3>${enablementContent.title}</h3>
      <p class="section-intro">${enablementContent.summary}</p>
      <div class="card-grid three-up">${tracksHtml}</div>
      <p class="trailhead-source-note">Enablement recommendations are curated from Salesforce Trailhead search results using the Trailhead MCP server.</p>
    `;
    mainContent.appendChild(section);
  }
}
