import {mount} from 'svelte'
import './styles/app.css'
import App from './App.svelte'
import toggleMode from "./lib/mode";

toggleMode()

const apiDocs = document.getElementById('api-docs')!;
const url = apiDocs.getAttribute('data-url')!;

async function init() {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load JSON from ${url}`);

  const data = await res.json();

  return mount(App, {
    target: document.getElementById('app')!,
    props: {
      apiDocs: data
    }
  });
}

export default init();
