import { writable } from "svelte/store";

export const path = writable(
    typeof window !== "undefined"
        ? window.location.pathname + window.location.search + window.location.hash
        : "/"
);

export function pathPartToTitle(part: string): string {
    return part
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
}

export function titleToPathPart(title: string): string {
    return title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/_/g, "-")
        .replace(/[^\w-]/g, "");
}