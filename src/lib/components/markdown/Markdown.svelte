<script lang="ts">
	import SvelteMarkdown from "svelte-markdown"
	import CodeBlockRenderer from "./CodeBlockRenderer.svelte"
	import LinkRenderer from "./LinkRenderer.svelte"
	import { cn } from "$lib/utils"

	let { content, class: className = "" }: { content: string; class?: string } = $props()
</script>

<div class={cn("markdown", className)}>
	<SvelteMarkdown source={content} renderers={{ code: CodeBlockRenderer, link: LinkRenderer }} />
</div>
