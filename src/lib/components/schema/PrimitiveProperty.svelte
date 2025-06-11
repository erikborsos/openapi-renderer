<script lang="ts">
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Badge from "../ui/badge/badge.svelte"
	import { formatType, getTypeColor } from "$lib/openapi/schema"
	import Markdown from "../markdown/Markdown.svelte"
	import { generateExample } from "$lib/openapi"

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
		<Badge variant="outline" class={getTypeColor(type ?? schema.type ?? "any")}>
			{type ?? formatType(schema)}
		</Badge>
	</span>

	{#if !root && schema.description}
		{#if schema.readOnly}
			<Badge variant="outline" class="ml-1">readOnly</Badge>
		{/if}
		{#if schema.writeOnly}
			<Badge variant="outline" class="ml-1">writeOnly</Badge>
		{/if}
		<Markdown class="text-muted-foreground" content={schema.description} />
	{/if}

	<div class="flex max-w-fit flex-wrap gap-1">
		{#if schema.minimum}
			<Badge variant="outline">&gt;= {schema.minimum}</Badge>
		{/if}
		{#if schema.exclusiveMinimum}
			<Badge variant="outline">&gt {schema.exclusiveMinimum}</Badge>
		{/if}
		{#if schema.maximum}
			<Badge variant="outline">&lt;= {schema.maximum}</Badge>
		{/if}
		{#if schema.exclusiveMaximum}
			<Badge variant="outline">&lt {schema.exclusiveMaximum}</Badge>
		{/if}
		{#if schema.multipleOf}
			<Badge variant="outline">x {schema.multipleOf}</Badge>
		{/if}
		{#if schema.minLength !== undefined}
			<Badge variant="outline">minLength: {schema.minLength}</Badge>
		{/if}
		{#if schema.maxLength !== undefined}
			<Badge variant="outline">maxLength: {schema.maxLength}</Badge>
		{/if}
		{#if schema.pattern}
			<Badge variant="outline">pattern: {schema.pattern}</Badge>
		{/if}
	</div>
	{#if schema.enum}
		<div class="flex max-w-fit flex-wrap gap-1">
			Allowed values:
			{#each schema.enum as value (value)}
				<Badge variant="outline" class="mr-1">{value}</Badge>
			{/each}
		</div>
	{/if}
	{#if schema.default}
		<span>Default: <Badge variant="outline">{schema.default}</Badge></span>
	{/if}
	{#if schema.example || schema.examples}
		<div class="max-w-full overflow-hidden">
			<span>Example:</span>
			<Badge variant="outline" class="block w-fit break-words whitespace-pre-wrap">
				{generateExample(schema)}
			</Badge>
		</div>
	{/if}
</div>
