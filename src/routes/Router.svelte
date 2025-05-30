<script lang="ts">
    import { path } from "$lib/stores/path";
    import type { OpenAPIDocument } from "$lib/openapi";
    import Overview from "./Overview.svelte";

    let { apiDocs }: { apiDocs: OpenAPIDocument } = $props();

    if (typeof window !== "undefined") {
        window.addEventListener("popstate", () => {
            path.set(window.location.pathname + window.location.search + window.location.hash);
        });

        window.addEventListener("hashchange", () => {
            path.set(window.location.pathname + window.location.search + window.location.hash);
        });
    }
</script>

{#if $path === "/overview"}
    <Overview {apiDocs} />
{:else if $path === "/models"}
    <Overview {apiDocs} />
{/if}