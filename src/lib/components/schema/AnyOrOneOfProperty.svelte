<script lang="ts">
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Schema from "./Schema.svelte"
	import { formatType } from "$lib/openapi/schema"
	import Badge from "../ui/badge/badge.svelte"
	import { getTypeColor } from "$lib/openapi/schema"
	import * as ToggleGroup from "../ui/toggle-group"

	let {
		schema,
		schemaName,
		root = false
	}: { schema: SchemaObject; schemaName?: string; root?: boolean } = $props()

	const isAnyOf = "anyOf" in schema
	const schemas = (isAnyOf ? schema.anyOf : schema.oneOf) as SchemaObject[] | undefined
	const schemaCount = schemas?.length ?? 0

	let selectedIndex = $state("0")

	const schemaLabels =
		schemas?.map((s, i) => {
			const type = formatType(s)
			return s.title || type + " " + (i + 1) || `Option ${i + 1}`
		}) ?? []
</script>

<div class="text-muted-foreground flex flex-col gap-2">
	{#if schemaName && !root}
		<div class="flex items-center gap-2">
			<span class="text-foreground font-semibold">{schemaName}</span>
			{#if schema.required}
				<span class="text-red-500">*</span>
			{/if}
			<Badge variant="secondary" class={getTypeColor(isAnyOf ? "anyOf" : "oneOf")}>
				{isAnyOf ? "anyOf" : "oneOf"}
			</Badge>
		</div>
	{/if}

	{#if schemas && schemaCount > 0}
		<div class="flex flex-col gap-2">
			<div class="text-muted-foreground text-sm">
				{#if schema.anyOf}
					Any of:
				{:else if schema.oneOf}
					One of:
				{/if}
			</div>
			{#if schemaCount > 1}
				<ToggleGroup.Root size="sm" type="single" bind:value={selectedIndex}>
					{#each schemaLabels as label, i (i)}
						<ToggleGroup.Item
							value={i + ""}
							aria-label={label}
							class="max-w-full flex-1 truncate px-2 py-1 text-center text-sm"
						>
							<span class="block truncate">{label}</span>
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			{/if}
			<div class="pl-3">
				{#key selectedIndex}
					<Schema schema={schemas[+selectedIndex]} {schemaName} {root} />
				{/key}
			</div>
		</div>
	{:else}
		<div>No valid {isAnyOf ? "anyOf" : "oneOf"} schemas found</div>
	{/if}
</div>
