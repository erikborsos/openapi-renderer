<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "./components/layout/sidebar/Sidebar.svelte";
    import "./styles/app.css"
    import Header from "./components/layout/header/Header.svelte";
    import Overview from "./routes/Overview.svelte";
    import Router from "./routes/Router.svelte";
    import type {OpenAPIDocument} from "$lib/openapi";

    let { apiDocs }: { apiDocs: OpenAPIDocument } = $props();

    let path = $state(window.location.pathname + window.location.search + window.location.hash);

    window.addEventListener("popstate", () => {
        path = window.location.pathname + window.location.search + window.location.hash;
    });

    window.addEventListener("hashchange", () => {
        path = window.location.pathname + window.location.search + window.location.hash;
    });

</script>

<Sidebar.Provider>
    <AppSidebar />
    <Sidebar.Inset>
        <Header path={path} />
        <main class="flex-1 overflow-y-auto p-4">
            <Router {path} {apiDocs} />
        </main>
    </Sidebar.Inset>
</Sidebar.Provider>
