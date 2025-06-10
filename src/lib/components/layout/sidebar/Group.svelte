<script lang="ts">
	import type { SidebarGroup } from "./Sidebar.svelte"

	import * as Sidebar from "$lib/components/ui/sidebar/"
	import * as Collapsible from "$lib/components/ui/collapsible/"
	import Menu from "$lib/components/layout/sidebar/Menu.svelte"
	import Item from "$lib/components/layout/sidebar/Item.svelte"
	import { ChevronRight } from "@lucide/svelte"

	import { slide } from "svelte/transition"

	let { group }: { group: SidebarGroup } = $props()
</script>

<Collapsible.Root open class="group/collapsible">
	<Sidebar.Group class="py-0">
		<Sidebar.GroupLabel class="uppercase">
			{#snippet child({ props })}
				<Collapsible.Trigger {...props}>
					{group.name}
					<ChevronRight
						class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
					/>
				</Collapsible.Trigger>
			{/snippet}
		</Sidebar.GroupLabel>
		<Collapsible.Content forceMount>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} transition:slide={{ duration: 250 }}>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each group.items as item (item.name)}
									{#if item.type === "item"}
										<Item {item} position="group" />
									{:else if item.type === "menu"}
										<Menu menu={item} position="group" />
									{/if}
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</div>
				{/if}
			{/snippet}
		</Collapsible.Content>
	</Sidebar.Group>
</Collapsible.Root>
