<script lang="ts">
	export let href: string
	export let text: string

	let blankTarget =
		!href.startsWith("/") &&
		!href.startsWith("#") &&
		!href.startsWith("mailto:") &&
		!href.startsWith("tel:")
</script>

<a {href} target={blankTarget ? "_blank" : ""}>{text || href}</a>
