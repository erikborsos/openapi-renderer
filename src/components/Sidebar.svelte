<script lang="ts" module>
    export interface NavItem {
        title: string;
        url: string;
        items?: NavItem[];
        isActive?: boolean;
    }
</script>

<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import type { ComponentProps } from "svelte";
    import Search from "./Search.svelte";
    import MenuItem from "./MenuItem.svelte";

    let data = {
        navMain: [
            { title: "API", url: "#", isActive: true },
        ]
    };

    let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root class="!border-r-2 border-dashed p-3" {...restProps} bind:ref>
    <Sidebar.Header>
        <Search />
    </Sidebar.Header>
    <Sidebar.Content>
        <Sidebar.Group>
            <Sidebar.Menu>
                {#each data.navMain as item (item.title)}
                    <MenuItem {item} />
                {/each}
            </Sidebar.Menu>
        </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Rail />
</Sidebar.Root>