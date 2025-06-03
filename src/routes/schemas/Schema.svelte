<script lang="ts">
	import CodeBlockRenderer from "$lib/components/markdown/CodeBlockRenderer.svelte"
	import { generateExampleJson } from "$lib/openapi/exapmple"
	import Schema from "$lib/components/schema/Schema.svelte"
	import { spec } from "$lib/openapi"
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Markdown from "$lib/components/markdown/Markdown.svelte"
	let { schema: schemaName }: { schema: string } = $props()

	const schema = (spec.components?.schemas?.[schemaName] as SchemaObject) || undefined
</script>

{#if schema}
	<div class="p-4">
		<div class="grid gap-20 lg:grid-cols-2">
			<div>
				<div class="mb-6">
					<h2 class="text-3xl font-bold">{schemaName}</h2>
					{#if schema.description}
						<Markdown class="text-muted-foreground" content={schema.description} />
					{/if}
				</div>
				<Schema {schema} {schemaName} root />
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
