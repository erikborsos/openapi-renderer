<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar"
	import * as Breadcrumb from "$lib/components/ui/breadcrumb"

	import ModeToggle from "./ModeToggle.svelte"
	import { pathPartToTitle } from "$lib/stores/path"
	import Link from "$lib/components/Link.svelte"

	let { path = $bindable() }: { path: string } = $props()

	let pathParts = $derived(path.split("/").filter((part) => part.length > 0))
</script>

<header
	class="bg-background/70 sticky top-0 z-[100] flex h-16 shrink-0 items-center gap-2 border-b-2 border-dashed px-4 backdrop-blur-lg"
>
	<Sidebar.Trigger class="-ml-1" />
	<div class="mr-2 h-full border-r-2 border-dashed"></div>
	<Breadcrumb.Root>
		<Breadcrumb.List>
			{#each pathParts as part, i (i)}
				<Breadcrumb.Item>
					{#if i < pathParts.length - 1}
						<Breadcrumb.Link class="hidden md:block">
							<Link href={`/${pathParts.slice(0, i + 1).join("/")}`}>
								{pathPartToTitle(part)}
							</Link>
						</Breadcrumb.Link>
						<Breadcrumb.Separator class="hidden md:block" />
					{:else}
						<Breadcrumb.Page>{pathPartToTitle(part)}</Breadcrumb.Page>
					{/if}
				</Breadcrumb.Item>
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<div class="flex h-full flex-1 items-center justify-end">
		<div class="mr-3 h-full border-l-2 border-dashed"></div>
		<ModeToggle />
	</div>
</header>
