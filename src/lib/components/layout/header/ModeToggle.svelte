<script lang="ts">
	import { Sun, Moon } from "@lucide/svelte"

	import { buttonVariants } from "$lib/components/ui/button"
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
	import toggleMode from "$lib/mode"
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
		<Sun
			class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => toggleMode("light")}>Light</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => toggleMode("dark")}>Dark</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => toggleMode()}>System</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
