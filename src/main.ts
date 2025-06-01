import { mount } from "svelte"
import "./styles/app.css"
import App from "./App.svelte"
import toggleMode from "./lib/mode"
import { setSpec } from "$lib//openapi"

toggleMode()

const spec = document.getElementById("api-docs")!
const url = spec.getAttribute("data-url")!

async function init() {
	const res = await fetch(url)
	if (!res.ok) throw new Error(`Failed to load JSON from ${url}`)

	const data = await res.json()

	setSpec(data)

	return mount(App, {
		target: document.getElementById("app")!
	})
}

export default init()
