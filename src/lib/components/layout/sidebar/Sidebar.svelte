<script lang="ts" module>
	import type { Component } from "svelte"
	export type SidebarItem = {
		type: "item"
		name: string
		href: string
		icon?: Component
	}

	export type SidebarMenu = {
		type: "menu"
		name: string
		items: SidebarItem[]
	}

	export type SidebarGroup = {
		type: "group"
		name: string
		items: (SidebarMenu | SidebarItem)[]
	}

	export type SidebarNode = SidebarItem | SidebarMenu | SidebarGroup
</script>

<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/"
	import Search from "$lib/components/layout/sidebar/Search.svelte"
	import type { ComponentProps } from "svelte"
	import Item from "./Item.svelte"
	import Menu from "./Menu.svelte"
	import Group from "./Group.svelte"
	import { generateSidebarFromOpenAPI } from "$lib/openapi"

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props()
</script>

<Sidebar.Root collapsible="offcanvas" class="!border-r-2 border-dashed" {...restProps}>
	<Sidebar.Header class="mb-2 h-16 border-b-2 border-dashed">
		<Search />
	</Sidebar.Header>
	<Sidebar.Content>
		{#each generateSidebarFromOpenAPI() as item (item.name)}
			{#if item.type === "item"}
				<Item {item} position="standalone" />
			{:else if item.type === "menu"}
				<Menu menu={item} position="standalone" />
			{:else if item.type === "group"}
				<Group group={item} />
			{/if}
			<div class="w-full border-b-2 border-dashed"></div>
		{/each}
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
