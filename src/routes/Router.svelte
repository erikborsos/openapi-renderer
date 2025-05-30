<script lang="ts">

    import type {OpenAPIDocument} from "$lib/openapi";
    import Overview from "./Overview.svelte";

    let { path = $bindable(), apiDocs }: { path: string, apiDocs: OpenAPIDocument } = $props();
</script>

{#if path === "/" || path === "/overview"}
    <Overview {apiDocs} />
{:else}
    <Overview {apiDocs} />
{/if}
