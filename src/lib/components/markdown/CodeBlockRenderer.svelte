<script lang="ts">
	import hljs from "highlight.js"
	import * as Card from "$lib/components/ui/card"
	import { Button } from "$lib/components/ui/button"
	import { Clipboard } from "@lucide/svelte"
	import { cn } from "$lib/utils"

	export let text: string = ""
	export let lang: string = "plaintext"
	export let title: string | undefined = undefined

	let code = hljs.highlight(text, { language: lang || "plaintext" }).value
</script>

<Card.Root class="gap-0 p-0">
	{#if title}
		<Card.Header class="bg-muted rounded-t-xl p-6 pb-2">
			<Card.Title>{title}</Card.Title>
		</Card.Header>
	{/if}
	<Card.Content class="group relative overflow-hidden px-6 pt-4">
		<pre class={cn("pb-4", "language-" + lang)}>
            <code class="hljs">{@html code}</code>
        </pre>
		<Button
			class="pointer-events-none absolute top-2 right-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100"
			size="icon"
			variant="outline"
		>
			<Clipboard />
		</Button>
	</Card.Content>
</Card.Root>
