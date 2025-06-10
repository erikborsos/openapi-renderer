<script lang="ts">
	import type { SidebarMenu } from "./Sidebar.svelte"

	import * as Sidebar from "$lib/components/ui/sidebar/"
	import * as Collapsible from "$lib/components/ui/collapsible/"

	import Menu from "./Menu.svelte"
	import Item from "./Item.svelte"
	import { ChevronRight } from "@lucide/svelte"
	import { slide } from "svelte/transition"

	let { menu, position = "standalone" }: { menu: SidebarMenu; position: "standalone" | "group" } =
		$props()
</script>

{#if position === "standalone"}
	<Sidebar.Group class="py-0">
		<Sidebar.GroupContent>
			<Sidebar.Menu>
				<Menu {menu} position="group" />
			</Sidebar.Menu>
		</Sidebar.GroupContent>
	</Sidebar.Group>
{:else}
	<Collapsible.Root class="group/collapsibleMenu">
		{#snippet child({ props })}
			<Sidebar.MenuItem {...props}>
				<Collapsible.Trigger>
					{#snippet child({ props })}
						<Sidebar.MenuButton {...props} class="font-semibold">
							<span>{menu.name}</span>
							<ChevronRight
								class="ml-auto transition-transform group-data-[state=open]/collapsibleMenu:rotate-90"
							/>
						</Sidebar.MenuButton>
					{/snippet}
				</Collapsible.Trigger>
				<Collapsible.Content forceMount>
					{#snippet child({ props, open })}
						{#if open}
							<div {...props} transition:slide={{ duration: 250 }}>
								<Sidebar.MenuSub>
									{#each menu.items as item (item.name)}
										<Item {item} position="menu" />
									{/each}
								</Sidebar.MenuSub>
							</div>
						{/if}
					{/snippet}
				</Collapsible.Content>
			</Sidebar.MenuItem>
		{/snippet}
	</Collapsible.Root>
{/if}
