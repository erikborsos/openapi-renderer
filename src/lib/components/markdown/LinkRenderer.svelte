<script lang="ts">
	import Link from "$lib/components/Link.svelte"

	export let href: string
	export let text: string

	let blankTarget =
		!href.startsWith("/") &&
		!href.startsWith("#") &&
		!href.startsWith("mailto:") &&
		!href.startsWith("tel:")

	let appLink = href.startsWith("/") || href.startsWith("#")
</script>

{#if appLink}
	<Link {href}>
		{text || href}
	</Link>
{:else}
	<a {href} target={blankTarget ? "_blank" : ""}>{text || href}</a>
{/if}
