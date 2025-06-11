<script lang="ts">
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Badge from "../ui/badge/badge.svelte"
	import { formatType, getTypeColor } from "$lib/openapi/schema"
	import * as Collapsible from "../ui/collapsible"
	import { ChevronRight } from "@lucide/svelte"
	import { buttonVariants } from "../ui/button"
	import Schema from "./Schema.svelte"
	import { slide } from "svelte/transition"

	let {
		schema,
		schemaName,
		root = false
	}: { schema: SchemaObject; schemaName?: string; root?: boolean } = $props()

	let open = $state(true)

	// Determine if schema has only additionalProperties (no properties)
	const hasOnlyAdditionalProperties =
		!schema.properties || Object.keys(schema.properties).length === 0
	const additionalPropertiesSchema =
		typeof schema.additionalProperties === "boolean"
			? {}
			: (schema.additionalProperties as SchemaObject)
	const displayType =
		hasOnlyAdditionalProperties && schema.additionalProperties
			? `dictionary[string, ${formatType(additionalPropertiesSchema)}]`
			: formatType(schema)
	// Check if additionalProperties is an object schema
	const isAdditionalPropertiesObject =
		schema.additionalProperties &&
		(additionalPropertiesSchema.type === "object" ||
			"properties" in additionalPropertiesSchema ||
			"additionalProperties" in additionalPropertiesSchema)
</script>

<div class="text-muted-foreground flex flex-col gap-2">
	{#if hasOnlyAdditionalProperties && schema.additionalProperties}
		{#if isAdditionalPropertiesObject}
			<!-- Render collapsible object for additionalProperties -->
			<Collapsible.Root bind:open>
				<div class="flex items-center gap-2">
					<Collapsible.Trigger class={buttonVariants({ variant: "ghost" }) + " !h-6 !w-6"}>
						<ChevronRight class={`transition-transform ${open ? "rotate-90" : ""}`} />
						<span class="sr-only">Toggle</span>
					</Collapsible.Trigger>
					{#if schemaName}
						<span class="text-foreground font-semibold">{schemaName}</span>
						{#if schema.required}
							<span class="text-red-500">*</span>
						{/if}
					{/if}
					<div>
						<Badge variant="secondary" class={getTypeColor("dictionary")}>
							{displayType}
						</Badge>
					</div>
				</div>
				<Collapsible.Content forceMount>
					{#snippet child({ props, open })}
						{#if open}
							<div
								{...props}
								transition:slide={{ duration: 250 }}
								class="flex w-full flex-col gap-4 border-l-1 pt-4"
							>
								{#each Object.entries(additionalPropertiesSchema.properties ?? {}) as [propertyName, propertySchema] (propertyName)}
									<div class="flex gap-2">
										<div class="mt-3 w-3 border-t-1"></div>
										<Schema schema={propertySchema as SchemaObject} schemaName={propertyName} />
									</div>
								{/each}
								{#if additionalPropertiesSchema.additionalProperties}
									<div class="flex gap-2">
										<div class="mt-3 w-3 border-t-1"></div>
										<Schema
											schema={typeof additionalPropertiesSchema.additionalProperties === "boolean"
												? {}
												: (additionalPropertiesSchema.additionalProperties as SchemaObject)}
											schemaName="[key: string]"
										/>
									</div>
								{/if}
							</div>
						{/if}
					{/snippet}
				</Collapsible.Content>
			</Collapsible.Root>
		{:else}
			<!-- Render non-object additionalProperties schema directly -->
			<div class="flex items-center gap-2">
				{#if schemaName}
					<span class="text-foreground font-semibold">{schemaName}</span>
					{#if schema.required}
						<span class="text-red-500">*</span>
					{/if}
				{/if}
				<div>
					<Badge variant="secondary" class={getTypeColor("dictionary")}>
						{displayType}
					</Badge>
				</div>
			</div>
			<Schema schema={additionalPropertiesSchema} {schemaName} {root} />
		{/if}
	{:else if root}
		<!-- Render root object with properties and/or additionalProperties -->
		<div class="flex w-full flex-col gap-4 border-l-1 pt-4">
			{#each Object.entries(schema.properties ?? {}) as [propertyName, propertySchema] (propertyName)}
				<div class="flex gap-2">
					<div class="mt-3 w-3 border-t-1"></div>
					<Schema schema={propertySchema as SchemaObject} schemaName={propertyName} />
				</div>
			{/each}
			{#if schema.additionalProperties}
				<div class="flex gap-2">
					<div class="mt-3 w-3 border-t-1"></div>
					<Schema
						schema={typeof schema.additionalProperties === "boolean"
							? {}
							: (schema.additionalProperties as SchemaObject)}
						schemaName="[key: string]"
					/>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Render non-root object with collapsible structure -->
		<Collapsible.Root bind:open>
			<div class="flex items-center gap-2">
				<Collapsible.Trigger class={buttonVariants({ variant: "ghost" }) + " !h-6 !w-6"}>
					<ChevronRight class={`transition-transform ${open ? "rotate-90" : ""}`} />
					<span class="sr-only">Toggle</span>
				</Collapsible.Trigger>
				{#if schemaName}
					<span class="text-foreground font-semibold">{schemaName}</span>
					{#if schema.required}
						<span class="text-red-500">*</span>
					{/if}
				{/if}
				<div>
					<Badge variant="secondary" class={getTypeColor(schema.type ?? "any")}>
						{displayType}
					</Badge>
				</div>
			</div>
			<Collapsible.Content forceMount>
				{#snippet child({ props, open })}
					{#if open}
						<div
							{...props}
							transition:slide={{ duration: 250 }}
							class="flex w-full flex-col gap-4 border-l-1 pt-4"
						>
							{#each Object.entries(schema.properties ?? {}) as [propertyName, propertySchema] (propertyName)}
								<div class="flex gap-2">
									<div class="mt-3 w-3 border-t-1"></div>
									<Schema schema={propertySchema as SchemaObject} schemaName={propertyName} />
								</div>
							{/each}
							{#if schema.additionalProperties}
								<div class="flex gap-2">
									<div class="mt-3 w-3 border-t-1"></div>
									<Schema
										schema={typeof schema.additionalProperties === "boolean"
											? {}
											: (schema.additionalProperties as SchemaObject)}
										schemaName="[key: string]"
									/>
								</div>
							{/if}
						</div>
					{/if}
				{/snippet}
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}
</div>
