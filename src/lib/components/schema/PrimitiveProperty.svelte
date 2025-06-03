<script lang="ts">
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Badge from "../ui/badge/badge.svelte"
	import { formatType, getTypeColor } from "$lib/openapi/schema"
	import Markdown from "../markdown/Markdown.svelte"
	import { generateExample } from "$lib/openapi/exapmple"

	let {
		schema,
		schemaName,
		root = false,
		type
	}: { schema: SchemaObject; schemaName?: string; root?: boolean; type?: string } = $props()
</script>

<div class="text-muted-foreground flex flex-col gap-1">
	<span>
		{#if schemaName && !root}
			<span class="text-foreground font-semibold">{schemaName}</span>
			{#if schema.required}
				<span class="text-red-500">*</span>
			{/if}
		{/if}
		<Badge variant="secondary" class={getTypeColor(type ?? schema.type ?? "any")}>
			{type ?? formatType(schema)}
		</Badge>
	</span>

	{#if !root && schema.description}
		{#if schema.readOnly}
			<Badge variant="secondary" class="ml-1">readOnly</Badge>
		{/if}
		{#if schema.writeOnly}
			<Badge variant="secondary" class="ml-1">writeOnly</Badge>
		{/if}
		<Markdown class="text-muted-foreground" content={schema.description} />
	{/if}

	<div class="flex max-w-fit flex-wrap gap-1">
		{#if schema.minimum}
			<Badge variant="secondary">&gt;= {schema.minimum}</Badge>
		{/if}
		{#if schema.exclusiveMinimum}
			<Badge variant="secondary">&gt {schema.exclusiveMinimum}</Badge>
		{/if}
		{#if schema.maximum}
			<Badge variant="secondary">&lt;= {schema.maximum}</Badge>
		{/if}
		{#if schema.exclusiveMaximum}
			<Badge variant="secondary">&lt {schema.exclusiveMaximum}</Badge>
		{/if}
		{#if schema.multipleOf}
			<Badge variant="secondary">x {schema.multipleOf}</Badge>
		{/if}
		{#if schema.minLength !== undefined}
			<Badge variant="secondary">minLength: {schema.minLength}</Badge>
		{/if}
		{#if schema.maxLength !== undefined}
			<Badge variant="secondary">maxLength: {schema.maxLength}</Badge>
		{/if}
		{#if schema.pattern}
			<Badge variant="secondary">pattern: {schema.pattern}</Badge>
		{/if}
	</div>
	{#if schema.enum}
		<div class="flex gap-1">
			Allowed values:
			{#each schema.enum as value}
				<Badge variant="secondary" class="mr-1">{value}</Badge>
			{/each}
		</div>
	{/if}
	{#if schema.default}
		<span>default: <Badge variant="secondary">{schema.default}</Badge></span>
	{/if}
	<span>example: <Badge variant="secondary">{generateExample(schema)}</Badge></span>
</div>
