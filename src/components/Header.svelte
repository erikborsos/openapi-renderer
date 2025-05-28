<script lang="ts">

import * as Sidebar from "$lib/components/ui/sidebar/index.js";
import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

import ModeToggle from "./ModeToggle.svelte";

let { path  = $bindable()}: { path: string } = $props();

let pathParts = $derived(path.split("/").filter(part => part.length > 0));

</script>

<header class="flex h-16 shrink-0 items-center gap-2 border-b-2 border-dashed px-4">
    <Sidebar.Trigger class="-ml-1" />
    <div class="h-full border-r-2 border-dashed mr-2"></div>
    <Breadcrumb.Root>
        <Breadcrumb.List>
            {#each pathParts as part, i (part)}
                <Breadcrumb.Item>
                    {#if i < pathParts.length - 1}
                        <Breadcrumb.Link class="hidden md:block" href={`#${pathParts.slice(0, i + 1).join("/")}`}>
                            {part}
                        </Breadcrumb.Link>
                        <Breadcrumb.Separator class="hidden md:block" />
                    {:else}
                    <Breadcrumb.Page>{part}</Breadcrumb.Page>
                    {/if}
                </Breadcrumb.Item>
            {/each}
        </Breadcrumb.List>
    </Breadcrumb.Root>
    <div class="justify-end flex h-full items-center flex-1">
        <div class="h-full border-l-2 border-dashed mr-3"></div>
        <ModeToggle />
    </div>
</header>