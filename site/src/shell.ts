const routeTitle = document.title.split(" — ")[0] || "Trajectory Test Cases";

function focusRouteHeading(): void {
  const heading = document.querySelector<HTMLHeadingElement>("main h1");
  const announcement = document.querySelector<HTMLElement>("#route-announcer");
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  if (announcement) announcement.textContent = `${routeTitle} page loaded`;
}

function setTheme(theme: "light" | "dark"): void {
  document.documentElement.dataset.theme = theme;
  const toggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
  toggle?.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
}

export function initializeShell(options: { demo?: boolean } = {}): void {
  const storage = options.demo ? sessionStorage : localStorage;
  const storageKey = options.demo ? "demo:ttc-theme" : "ttc-theme";
  const initial = storage.getItem(storageKey);
  const painted = document.documentElement.dataset.theme;
  setTheme(initial === "dark" || initial === "light" ? initial : painted === "dark" ? "dark" : "light");

  document.querySelector<HTMLButtonElement>("#theme-toggle")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    storage.setItem(storageKey, next);
    setTheme(next);
  });

  focusRouteHeading();
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) focusRouteHeading();
  });
}
