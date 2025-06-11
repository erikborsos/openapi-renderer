<script lang="ts">
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Badge from "../ui/badge/badge.svelte"
	import { formatType, getTypeColor, isPrimitiveType } from "$lib/openapi/schema"
	import * as Collapsible from "../ui/collapsible"
	import { ChevronRight } from "@lucide/svelte"
	import { buttonVariants } from "../ui/button"
	import Schema from "./Schema.svelte"
	import { slide } from "svelte/transition"
	import PrimitiveProperty from "./PrimitiveProperty.svelte"

	let {
		schema,
		schemaName,
		root = false
	}: { schema: SchemaObject; schemaName?: string; root?: boolean } = $props()

	let open = $state(true)
</script>

<div class="text-muted-foreground flex flex-col gap-2">
	{#if root}
		<div class="flex w-full flex-col gap-8 pt-4">
			{#if schema.items}
				<Schema schema={schema.items as SchemaObject} />
			{/if}
		</div>
	{:else if isPrimitiveType(schema.items as SchemaObject)}
		<PrimitiveProperty
			schema={schema.items as SchemaObject}
			{schemaName}
			{root}
			type={`array[${formatType(schema.items as SchemaObject)}]`}
		/>
	{:else}
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
					<Badge variant="secondary" class={getTypeColor(schema.type ?? "array")}>
						{formatType(schema)}
					</Badge>
				</div>
			</div>
			<Collapsible.Content forceMount>
				{#snippet child({ props, open })}
					{#if open && schema.items}
						<div {...props} transition:slide={{ duration: 250 }}>
							<Schema schema={schema.items as SchemaObject} root />
						</div>
					{/if}
				{/snippet}
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}
</div>
