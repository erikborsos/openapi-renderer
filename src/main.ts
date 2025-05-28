import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import toggleMode from "./lib/mode";

toggleMode()

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
