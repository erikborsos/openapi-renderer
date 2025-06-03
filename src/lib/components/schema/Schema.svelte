<script lang="ts">
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Markdown from "../markdown/Markdown.svelte"
	import PrimitiveProperty from "./PrimitiveProperty.svelte"
	import ObjectProperty from "./ObjectProperty.svelte"
	import ArrayProperty from "./ArrayProperty.svelte"
	import { isPrimitiveType } from "$lib/openapi/schema"

	let {
		schema,
		schemaName,
		root = false
	}: { schema: SchemaObject; schemaName?: string; root?: boolean } = $props()
</script>

{#if isPrimitiveType(schema)}
	<PrimitiveProperty {schema} {schemaName} {root} />
{:else if "properties" in schema}
	<ObjectProperty {schema} {schemaName} {root} />
{:else if "items" in schema}
	<ArrayProperty {schema} {schemaName} {root} />
{:else}
	<div>Complex</div>
{/if}
