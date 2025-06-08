<script lang="ts">
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Schema from "./Schema.svelte"
	import * as Select from "../ui/select"
	import { formatType } from "$lib/openapi/schema"
	import Badge from "../ui/badge/badge.svelte"
	import { getTypeColor } from "$lib/openapi/schema"

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
			{#if schemaCount > 1}
				<Select.Root type="single" bind:value={selectedIndex}>
					<Select.Trigger class="w-[200px]">
						{schemaLabels[+selectedIndex]}
					</Select.Trigger>
					<Select.Content>
						{#each schemaLabels as label, i (i)}
							<Select.Item value={i + ""} {label}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/if}
			<div class="border-l-1 pl-3">
				{#key selectedIndex}
					<Schema schema={schemas[+selectedIndex]} {schemaName} {root} />
				{/key}
			</div>
		</div>
	{:else}
		<div>No valid {isAnyOf ? "anyOf" : "oneOf"} schemas found</div>
	{/if}
</div>
