<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js"
	import { path } from "$lib/stores/path"
	import AppSidebar from "$lib/components/layout/sidebar/Sidebar.svelte"
	import "./styles/app.css"
	import Header from "$lib/components/layout/header/Header.svelte"
	import Router from "./routes/Router.svelte"
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<Header path={$path} />
		<main class="flex-1 overflow-y-auto p-4">
			<Router />
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
