<script lang="ts">
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Property from "./Property.svelte"

	let {
		schema,
		name,
		required = false
	}: { schema: SchemaObject; name?: string; required?: boolean } = $props()
</script>

<div class="mb-2">
	{#if name}
		<div class="font-semibold">
			{name}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
			<span class="text-gray-500"> ({schema.type ?? "object"})</span>
		</div>
	{/if}

	<!-- Description -->
	{#if schema.description}
		<div class="text-sm text-gray-600">{schema.description}</div>
	{/if}

	<!-- Additional Schema Details (for non-object/array schemas) -->
	{#if schema.type && !schema.properties && !schema.items && !schema.allOf && !schema.anyOf}
		<div class="text-sm text-gray-500">
			{#if schema.format}
				<span>Format: {schema.format}</span>
			{/if}
			{#if schema.enum}
				<span>Enum: {schema.enum.join(", ")}</span>
			{/if}
			{#if schema.default}
				<span>Default: {JSON.stringify(schema.default)}</span>
			{/if}
			{#if schema.minimum !== undefined}
				<span>Minimum: {schema.minimum}</span>
			{/if}
			{#if schema.maximum !== undefined}
				<span>Maximum: {schema.maximum}</span>
			{/if}
			{#if schema.minLength !== undefined}
				<span>Min Length: {schema.minLength}</span>
			{/if}
			{#if schema.maxLength !== undefined}
				<span>Max Length: {schema.maxLength}</span>
			{/if}
			{#if schema.pattern}
				<span>Pattern: {schema.pattern}</span>
			{/if}
		</div>
	{/if}

	<!-- AllOf Combinator -->
	{#if schema.allOf}
		<div class="">
			<div class="font-semibold text-blue-600">All Of</div>
			{#each schema.allOf as subSchema, index (index)}
				<div class="">
					<div class="text-sm text-gray-500">Schema {index + 1}</div>
					<Property schema={subSchema} />
				</div>
			{/each}
		</div>
	{/if}

	<!-- AnyOf Combinator -->
	{#if schema.anyOf}
		<div class="">
			<div class="font-semibold text-yellow-500">Any Of</div>
			{#each schema.anyOf as subSchema, index (index)}
				<div class="">
					<div class="text-sm text-gray-500">Schema {index + 1}</div>
					<Property schema={subSchema} />
				</div>
			{/each}
		</div>
	{/if}

	<!-- Nested Properties (for objects) -->
	{#if schema.properties}
		<div class="">
			{#each Object.entries(schema.properties) as [propertyName, property] (propertyName)}
				<Property
					schema={property}
					name={propertyName}
					required={schema.required?.includes(propertyName) ?? false}
				/>
			{/each}
		</div>
	{/if}

	<!-- Array Items -->
	{#if schema.items}
		<div class="">
			<div class="font-semibold">Items</div>
			<Property schema={schema.items} required={schema.required?.includes(name ?? "") ?? false} />
		</div>
	{/if}
</div>
