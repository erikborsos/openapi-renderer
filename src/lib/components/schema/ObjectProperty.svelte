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
</script>

<div class="text-muted-foreground flex flex-col gap-2">
	{#if root}
		<div class="flex w-full flex-col gap-4 pt-4">
			{#each Object.entries(schema.properties ?? {}) as [propertyName, propertySchema], i}
				<Schema schema={propertySchema as SchemaObject} schemaName={propertyName} />
				{#if i < Object.entries(schema.properties ?? {}).length - 1}
					<hr class="-ml-3" />
				{/if}
			{/each}
		</div>
	{:else}
		<Collapsible.Root bind:open>
			<div class="flex items-center gap-2">
				<Collapsible.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
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
						{formatType(schema)}
					</Badge>
				</div>
			</div>
			<Collapsible.Content forceMount>
				{#snippet child({ props, open })}
					{#if open}
						<div
							{...props}
							transition:slide={{ duration: 250 }}
							class="flex w-full flex-col gap-4 border-l-1 pt-4 pl-3"
						>
							{#each Object.entries(schema.properties ?? {}) as [propertyName, propertySchema]}
								<Schema schema={propertySchema as SchemaObject} schemaName={propertyName} />
								<hr class="-ml-3" />
							{/each}
						</div>
					{/if}
				{/snippet}
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}
</div>
