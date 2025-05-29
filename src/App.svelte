<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "./components/layout/sidebar/Sidebar.svelte";
    import "./app.css"
    import Header from "./components/layout/header/Header.svelte";
    import Overview from "./routes/Overview.svelte";


    let currentPath = $state(window.location.pathname + window.location.search + window.location.hash);

    window.addEventListener("popstate", () => {
        currentPath = window.location.pathname + window.location.search + window.location.hash;
    });

    window.addEventListener("hashchange", () => {
        currentPath = window.location.pathname + window.location.search + window.location.hash;
    });

    let { apiDocs } = $props();

</script>

<Sidebar.Provider>
    <AppSidebar />
    <Sidebar.Inset>
        <Header path={currentPath.replace("#", "")} />
        <main class="flex-1 overflow-y-auto p-4">
            <Overview {apiDocs} />
        </main>
    </Sidebar.Inset>
</Sidebar.Provider>
