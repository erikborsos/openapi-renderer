<script lang="ts">
	import type { SchemaObject } from "openapi3-ts/oas31"
	import PrimitiveProperty from "./PrimitiveProperty.svelte"
	import ObjectProperty from "./ObjectProperty.svelte"
	import ArrayProperty from "./ArrayProperty.svelte"
	import { isPrimitiveType } from "$lib/openapi/schema"
	import AllOfProperty from "./AllOfProperty.svelte"
	import AnyOrOneOfProperty from "./AnyOrOneOfProperty.svelte"

	let {
		schema,
		schemaName,
		root = false
	}: { schema: SchemaObject; schemaName?: string; root?: boolean } = $props()
</script>

{#if isPrimitiveType(schema)}
	<PrimitiveProperty {schema} {schemaName} {root} />
{:else if "allOf" in schema}
	<AllOfProperty {schema} {schemaName} {root} />
{:else if "oneOf" in schema || "anyOf" in schema}
	<AnyOrOneOfProperty {schema} {schemaName} {root} />
{:else if "properties" in schema}
	<ObjectProperty {schema} {schemaName} {root} />
{:else if "items" in schema}
	<ArrayProperty {schema} {schemaName} {root} />
{:else}
	<div>Complex</div>
{/if}
