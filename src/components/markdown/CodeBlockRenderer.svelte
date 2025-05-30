<script lang="ts">
    import hljs from 'highlight.js';
    import * as Card from "$lib/components/ui/card/index.js";
    import {Button} from "$lib/components/ui/button";
    import {Clipboard} from "@lucide/svelte";

    export let text: string = "";
    export let lang: string = "plaintext";
    export let title: string | undefined = undefined;

    let code = hljs.highlight(text, { language: lang || 'plaintext' }).value;
</script>


<Card.Root class="p-0 gap-2">
    {#if title}
        <Card.Header class="p-6 pb-2 bg-muted rounded-t-xl">
            <Card.Title>{title}</Card.Title>
        </Card.Header>
    {/if}
    <Card.Content class="pt-4 px-6 group relative overflow-hidden">
        <pre class={`pb-4 language-` + lang}>
            <code class="hljs">{@html code}</code>
        </pre>
        <Button
                class="absolute right-2 top-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                size="icon"
                variant="outline"
        >
            <Clipboard />
        </Button>
    </Card.Content>
</Card.Root>
