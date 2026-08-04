const navLinks = Array.from(document.querySelectorAll("#primary-nav a"));
const capabilitySearchInput = document.querySelector("#capability-search-input");

const normalize = (value) => value.toLowerCase().trim();
const currentPath = window.location.pathname.split("/").pop() || "index.html";
const currentHash = window.location.hash;

navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (!href) return;
  const [path, hash] = href.split("#");
  const targetPath = path || currentPath;
  const hashMatch = hash ? `#${hash}` === currentHash : true;
  const pathMatch = targetPath === currentPath;
  link.classList.toggle("active", pathMatch && hashMatch);
});

if (capabilitySearchInput) {
  capabilitySearchInput.addEventListener("input", () => {
    const term = normalize(capabilitySearchInput.value);
    const capabilityLinks = navLinks.filter((link) => link.dataset.capability);
    capabilityLinks.forEach((link) => {
      const haystack = normalize(`${link.textContent} ${link.dataset.capability}`);
      const show = !term || haystack.includes(term);
      link.style.display = show ? "block" : "none";
    });
  });

  capabilitySearchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const visibleCapability = navLinks.find(
      (link) => link.dataset.capability && link.style.display !== "none",
    );
    if (visibleCapability) window.location.href = visibleCapability.href;
  });
}
