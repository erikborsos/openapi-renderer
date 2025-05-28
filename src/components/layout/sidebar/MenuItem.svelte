<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import { ChevronsUpDown } from "@lucide/svelte";
    import type { NavItem } from "./Sidebar.svelte";

    export let item: NavItem;
</script>

{#if item.items && item.items.length > 0}
    <Collapsible.Root class="w-full">
        <Sidebar.MenuItem class="w-full">
            <Collapsible.Trigger class="w-full">
                <Sidebar.MenuButton isActive={item.isActive} class="w-full flex items-center">
                    {item.title}
                    <ChevronsUpDown class="ml-auto text-muted-foreground" />
                </Sidebar.MenuButton>
            </Collapsible.Trigger>
            <Collapsible.Content class="w-full">
                <Sidebar.MenuSub class="w-full">
                    {#each item.items as subItem (subItem.title)}
                        <Sidebar.MenuSubItem class="w-full">
                            <svelte:self item={subItem} />
                        </Sidebar.MenuSubItem>
                    {/each}
                </Sidebar.MenuSub>
            </Collapsible.Content>
        </Sidebar.MenuItem>
    </Collapsible.Root>
{:else}
    <Sidebar.MenuItem class="w-full">
        <Sidebar.MenuButton isActive={item.isActive} class="w-full">
            <a href={item.url} class="w-full">{item.title}</a>
        </Sidebar.MenuButton>
    </Sidebar.MenuItem>
{/if}