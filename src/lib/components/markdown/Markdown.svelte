<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    import CodeBlockRenderer from "./CodeBlockRenderer.svelte";
    import LinkRenderer from "./LinkRenderer.svelte";

    let { content }: {content: string} = $props();
</script>

<div class="markdown">
    <SvelteMarkdown source={content} renderers={{code: CodeBlockRenderer, link: LinkRenderer}}/>
</div>