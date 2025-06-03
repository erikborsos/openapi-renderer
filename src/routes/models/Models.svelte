<script lang="ts">
	import { Button } from "$lib/components/ui/button"
	import { ChevronRight } from "@lucide/svelte"
	import Markdown from "$lib/components/markdown/Markdown.svelte"
	import Link from "$lib/components/Link.svelte"
	import { spec } from "$lib/openapi"

	const schemas = spec.components?.schemas || {}
</script>

<div class="mb-6 w-full">
	<h2 class="mb-6 w-full pt-1 text-3xl" id="models">Models</h2>
	{#if Object.keys(schemas).length > 0}
		<div>
			{#each Object.entries(schemas) as [schemaName, schema] (schemaName)}
				<Link
					href={`/schemas/${schemaName}`}
					class="hover:bg-card flex w-full items-center justify-between border-y p-4 transition-colors"
				>
					<div>
						<h3 class="font-bold">{schemaName}</h3>
						{#if schema.description}
							<Markdown content={schema.description} class="text-muted-foreground" />
						{/if}
					</div>
					<Button variant="outline" size="icon">
						<ChevronRight />
					</Button>
				</Link>
			{/each}
		</div>
	{:else}
		<p>No models defined in the API specification.</p>
	{/if}
</div>
