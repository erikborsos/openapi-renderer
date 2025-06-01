<script lang="ts">
	import { path } from "$lib/stores/path"
	import Overview from "./overview/Overview.svelte"
	import Models from "./models/Models.svelte"
	import Schema from "./schemas/Schema.svelte"

	if (typeof window !== "undefined") {
		window.addEventListener("popstate", () => {
			path.set(window.location.pathname + window.location.search + window.location.hash)
		})

		window.addEventListener("hashchange", () => {
			path.set(window.location.pathname + window.location.search + window.location.hash)
		})
	}
</script>

{#if $path === "/"}
	<Overview />
{:else if $path === "/schemas"}
	<Models />
{:else if $path.startsWith("/schemas/")}
	{#key $path}
		<Schema schema={$path.split("/")[$path.split("/").length - 1]} />
	{/key}
{/if}
