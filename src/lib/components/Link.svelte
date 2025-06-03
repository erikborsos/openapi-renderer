<script lang="ts">
	import { path } from "$lib/stores/path"
	import type { WithChildren } from "bits-ui"

	let {
		href,
		class: className = "",
		replace = false,
		children
	}: WithChildren<{ href: string; class?: string; replace?: boolean }> = $props()

	function navigate(event: MouseEvent) {
		let noHashHref = href.replace(/#.*$/, "")
		event.preventDefault()
		if (replace) {
			history.replaceState({}, "", noHashHref)
		} else {
			history.pushState({}, "", noHashHref)
		}
		path.set(href.replace("#", "/"))
	}
</script>

<a {href} class={className} onclick={navigate}>
	{@render children?.()}
</a>
