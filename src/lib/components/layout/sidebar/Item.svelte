<script lang="ts">
	import type { SidebarItem } from "./Sidebar.svelte"

	import * as Sidebar from "$lib/components/ui/sidebar/"

	import Item from "./Item.svelte"

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
		<Sidebar.MenuButton class="text-muted-foreground">
			{#snippet child({ props })}
				<a href={item.href} {...props}>
					{#if item.icon}
						<item.icon />
					{/if}
					<span>{item.name}</span>
				</a>
			{/snippet}
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{:else if position === "menu"}
	<Sidebar.MenuSubItem>
		<Sidebar.MenuSubButton class="text-muted-foreground">
			{#snippet child({ props })}
				<a href={item.href} {...props}>
					{#if item.icon}
						<item.icon />
					{/if}
					<span>{item.name}</span>
				</a>
			{/snippet}
		</Sidebar.MenuSubButton>
	</Sidebar.MenuSubItem>
{/if}
