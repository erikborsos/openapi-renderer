<script lang="ts">
	import type { SidebarItem } from "./Sidebar.svelte"

	import * as Sidebar from "$lib/components/ui/sidebar/"

	import Item from "./Item.svelte"
	import Link from "$lib/components/Link.svelte"
	import MethodBadge from "$lib/components/badges/MethodBadge.svelte"
	import { cn } from "$lib/utils"
	import { getBadgeColor } from "$lib/openapi"

	let {
		item,
		position = "standalone"
	}: { item: SidebarItem; position: "standalone" | "group" | "menu" } = $props()
</script>

{#if position === "standalone"}
	<Sidebar.Group class="py-0">
		<Sidebar.GroupContent>
			<Sidebar.Menu><Item {item} position="group" /></Sidebar.Menu>
		</Sidebar.GroupContent>
	</Sidebar.Group>
{:else if position === "group"}
	<Sidebar.MenuItem>
		<Sidebar.MenuButton class="!h-auto min-h-7">
			{#snippet child({ props })}
				<Link href={item.href} {...props}>
					{#if item.icon}
						<item.icon />
					{/if}
					<span class="!break-words !whitespace-normal">{item.name}</span>
					{#if item.method}
						<MethodBadge class="ml-auto min-w-[6ch] px-1 py-0 text-xs" method={item.method} />
					{/if}
				</Link>
			{/snippet}
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{:else if position === "menu"}
	<Sidebar.MenuSubItem class="-mr-6">
		<Sidebar.MenuSubButton class="h-auto min-h-7">
			{#snippet child({ props })}
				<Link href={item.href} {...props}>
					{#if item.icon}
						<item.icon />
					{/if}
					<div class="flex w-full items-center justify-between">
						<span class="!break-words !whitespace-normal">{item.name}</span>
						{#if item.method}
							<span class={cn(getBadgeColor(item.method), "font-mono text-xs")}>{item.method}</span>
						{/if}
					</div>
				</Link>
			{/snippet}
		</Sidebar.MenuSubButton>
	</Sidebar.MenuSubItem>
{/if}
