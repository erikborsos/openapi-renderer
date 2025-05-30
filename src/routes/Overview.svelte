<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';
    import { Marked } from 'marked';
    import { markedHighlight } from 'marked-highlight';
    import hljs from 'highlight.js';
    import DOMPurify from 'dompurify';
    import * as Card from '$lib/components/ui/card/index.js';
    import type { OpenAPIDocument } from '$lib/openapi';

    let { apiDocs }: { apiDocs: OpenAPIDocument } = $props();

    const marked = new Marked(
        markedHighlight({
            langPrefix: 'hljs language-',
            emptyLangClass: 'hljs',
            highlight(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlight(code, { language: "plaintext" }).value;
            },
        })
    );

    // Parse and sanitize markdown
    const md = marked.parse(apiDocs.info.description || '') as string;

    const contact = apiDocs.info.contact || {};
    const servers = apiDocs.servers || [];
</script>

<Badge variant="secondary">V{apiDocs.info.version}</Badge>
<Badge variant="secondary">OAS {apiDocs.openapi}</Badge>
<h2 class="text-3xl mb-6 pt-1" id="overview">{apiDocs.info.title}</h2>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <div class="markdown max-w-full overflow-x-auto">
        {@html md}
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
