const links = Array.from(document.querySelectorAll(".nav-links a"));
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const target = link.getAttribute("href").replace("#", "");
        link.classList.toggle("active", target === entry.target.id);
      });
    });
  },
  { rootMargin: "-30% 0px -58% 0px", threshold: [0, 0.2, 0.5] },
);

sections.forEach((section) => observer.observe(section));
