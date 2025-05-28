export default function toggleMode(mode?: string) {
    if (mode === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.theme = "dark"
    } else if (mode === "light") {
        document.documentElement.classList.remove("dark");
        localStorage.theme = "light"
    } else  {
        document.documentElement.classList.toggle(
            "dark",
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches));
    }
}