import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js";

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        emptyLangClass: 'hljs',
        highlight(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlight(code, { language: "plaintext" }).value;
        },
    })
);

export function renderHTML(markdown: string): string {
    return (marked.parse(markdown) || "") as string;
}