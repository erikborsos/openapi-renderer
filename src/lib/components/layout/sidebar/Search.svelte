<script lang="ts">
	import { Laptop, Moon, Sun, Search } from "@lucide/svelte"
	import { onMount } from "svelte"
	import { cn } from "$lib/utils.js"
	import { Button } from "$lib/components/ui/button"
	import * as Command from "$lib/components/ui/command"
	import toggleMode from "$lib/mode.js"

	let open = $state(false)

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				open = true
			}
		}
		document.addEventListener("keydown", handleKeydown)

		return () => {
			document.removeEventListener("keydown", handleKeydown)
		}
	})

	function runCommand(cmd: () => void) {
		open = false
		cmd()
	}
</script>

<Button
	variant="outline"
	class={cn("text-muted-foreground relative w-full justify-start text-sm sm:pr-12")}
	onclick={() => (open = true)}
>
	<Search class="size-4 shrink-0" />
	<span>Search...</span>
	<kbd
		class="bg-muted pointer-events-none absolute top-1.5 right-1.5 flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
	>
		<span class="text-xs">⌘</span>K
	</kbd>
</Button>

<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search" />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Links"></Command.Group>
		<Command.Separator />
		<Command.Group heading="Theme">
			<Command.Item value="light" onSelect={() => runCommand(() => toggleMode("light"))}>
				<Sun class="mr-2 h-4 w-4" />
				Light
			</Command.Item>
			<Command.Item value="dark" onSelect={() => runCommand(() => toggleMode("dark"))}>
				<Moon class="mr-2 h-4 w-4" />
				Dark
			</Command.Item>
			<Command.Item value="system" onSelect={() => runCommand(() => toggleMode())}>
				<Laptop class="mr-2 h-4 w-4" />
				System
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
