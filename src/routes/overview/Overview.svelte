<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';;
    import type { OpenAPIDocument } from '$lib/openapi';
    import * as Card from "$lib/components/ui/card";
    import Markdown from "$lib/components/markdown/Markdown.svelte";

    let { apiDocs }: { apiDocs: OpenAPIDocument } = $props();

    const contact = apiDocs.info.contact || {};
    const servers = apiDocs.servers || [];
</script>

<Badge variant="secondary">V{apiDocs.info.version}</Badge>
<Badge variant="secondary">OAS {apiDocs.openapi}</Badge>
<h2 class="text-3xl mb-6 pt-1" id="overview">{apiDocs.info.title}</h2>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <div class="markdown max-w-full overflow-x-auto">
        <Markdown content={apiDocs.info.description || ''} />
    </div>
    <div class="flex flex-col gap-5">
        {#if servers.length > 0}
            <h1 class="text-2xl font-bold">Servers</h1>
            <div class="flex flex-col gap-3">
                {#each servers as server}
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>{server.url}</Card.Title>
                            <Card.Description>{server.description || 'No description'}</Card.Description>
                        </Card.Header>
                    </Card.Root>
                {/each}
            </div>
        {/if}
        <div class="grid grid-cols-2">
            <div>
                {#if contact.name || contact.email || contact.url}
                    <h3 class="text-2xl font-bold mb-4">Contact</h3>
                    {#if contact.name}
                        <p>{contact.name}</p>
                    {/if}
                    {#if contact.email}
                        <p><strong>Email:</strong> <a href="mailto:{contact.email}" class="link">{contact.email}</a></p>
                    {/if}
                    {#if contact.url}
                        <p><strong>Website:</strong> <a href="{contact.url}" class="link" target="_blank">{contact.url}</a></p>
                    {/if}
                {/if}
            </div>
            <div>
                {#if apiDocs.info.license}
                    <h3 class="text-2xl font-bold mb-4">License</h3>
                    <a href={apiDocs.info.license.url} class="link">{apiDocs.info.license.name}</a>
                {/if}
            </div>
        </div>
    </div>
</div>