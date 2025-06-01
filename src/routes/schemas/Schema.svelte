<script lang="ts">
	import CodeBlockRenderer from "$lib/components/markdown/CodeBlockRenderer.svelte"
	import { generateExampleJson, spec } from "$lib/openapi"

	let { schema: schemaName }: { schema: string } = $props()

	const schema = spec.components?.schemas?.[schemaName] || undefined
</script>

{#if schema}
	<div class="grid grid-cols-2 gap-4 p-4">
		<div></div>
		<div class="markdown">
			<CodeBlockRenderer
				text={JSON.stringify(generateExampleJson(schema), null, 2)}
				lang="json"
				title="Example"
			/>
		</div>
	</div>
{/if}
