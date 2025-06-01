<script lang="ts">
	import { Badge } from "$lib/components/ui/badge"
	import * as Card from "$lib/components/ui/card"
	import Markdown from "$lib/components/markdown/Markdown.svelte"
	import { spec } from "$lib/openapi"

	const contact = spec.info.contact || {}
	const servers = spec.servers || []
</script>

<Badge variant="secondary">V{spec.info.version}</Badge>
<Badge variant="secondary">OAS {spec.openapi}</Badge>
<h2 class="mb-6 pt-1 text-3xl" id="overview">{spec.info.title}</h2>
<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
	<div class="markdown max-w-full overflow-x-auto">
		<Markdown content={spec.info.description || ""} />
	</div>
	<div class="flex flex-col gap-5">
		{#if servers.length > 0}
			<h1 class="text-2xl font-bold">Servers</h1>
			<div class="flex flex-col gap-3">
				{#each servers as server (server.url)}
					<Card.Root>
						<Card.Header>
							<Card.Title>{server.url}</Card.Title>
							<Card.Description>{server.description || "No description"}</Card.Description>
						</Card.Header>
					</Card.Root>
				{/each}
			</div>
		{/if}
		<div class="grid grid-cols-2">
			<div>
				{#if contact.name || contact.email || contact.url}
					<h3 class="mb-4 text-2xl font-bold">Contact</h3>
					{#if contact.name}
						<p>{contact.name}</p>
					{/if}
					{#if contact.email}
						<p>
							<strong>Email:</strong>
							<a href="mailto:{contact.email}" class="link">{contact.email}</a>
						</p>
					{/if}
					{#if contact.url}
						<p>
							<strong>Website:</strong>
							<a href={contact.url} class="link" target="_blank">{contact.url}</a>
						</p>
					{/if}
				{/if}
			</div>
			<div>
				{#if spec.info.license}
					<h3 class="mb-4 text-2xl font-bold">License</h3>
					<a href={spec.info.license.url} class="link">{spec.info.license.name}</a>
				{/if}
			</div>
		</div>
	</div>
</div>
