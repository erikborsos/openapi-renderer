<script lang="ts">
	import CodeBlockRenderer from "$lib/components/markdown/CodeBlockRenderer.svelte"
	import { generateExampleJson, spec } from "$lib/openapi"
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Property from "./Property.svelte"

	let { schema: schemaName }: { schema: string } = $props()

	const schema = (spec.components?.schemas?.[schemaName] as SchemaObject) || undefined
</script>

{#if schema}
	<div class="p-4">
		<h1 class="mb-4 text-2xl font-bold">{schemaName}</h1>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<Property {schema} />
			</div>
			<div class="markdown">
				<CodeBlockRenderer
					text={JSON.stringify(
						schema.example ?? schema.examples?.[0] ?? generateExampleJson(schema),
						null,
						2
					)}
					lang="json"
					title="Example"
				/>
			</div>
		</div>
	</div>
{/if}
