<script lang="ts">
    import * as Collapsible from '$lib/components/ui/collapsible';
    import type { OpenAPIDocument } from '$lib/openapi';
    import { Button } from "$lib/components/ui/button";
    import { ChevronsUpDown } from '@lucide/svelte';
    import CodeBlockRenderer from "$lib/components/markdown/CodeBlockRenderer.svelte";
    import { slide } from "svelte/transition";

    let { apiDocs }: { apiDocs: OpenAPIDocument } = $props();

    const schemas = apiDocs.components?.schemas || {};

    function resolveRef(ref: string, schemas: Record<string, any>, visitedRefs: Set<string>): any {
        const refPath = ref.replace('#/components/schemas/', '');
        const pathParts = refPath.split('/properties/');
        let schema = schemas[pathParts[0]];
        if (!schema) {
            console.warn(`Schema not found for ref: ${ref}`);
            return {};
        }
        for (let i = 1; i < pathParts.length; i++) {
            schema = schema.properties?.[pathParts[i]] || {};
        }
        if (visitedRefs.has(refPath)) {
            return `[Circular *${refPath}]`;
        }
        visitedRefs.add(refPath);
        return schema;
    }

    function generateStringForPattern(pattern: string, minLength: number = 1, maxLength: number = 50): string {
        pattern = pattern.replace(/^\/|\/$/g, '');
        try {
            if (pattern === '^[a-z0-9._]+$') {
                let result = 'example';
                while (result.length < minLength) {
                    result += 'a';
                }
                if (result.length > maxLength) {
                    result = result.slice(0, maxLength);
                }
                return result;
            }
            let result = 'example';
            while (result.length < minLength) {
                result += 'a';
            }
            if (result.length > maxLength) {
                result = result.slice(0, maxLength);
            }
            return result;
        } catch (e) {
            console.warn(`Invalid pattern: ${pattern}, using default string`);
            return 'example'.slice(0, Math.min(maxLength, Math.max(minLength, 7)));
        }
    }

    function generateExampleJson(schema: any, schemas: Record<string, any>, visitedRefs: Set<string> = new Set()): any {
        if (schema.example !== undefined) {
            return schema.example;
        }

        if (schema.$ref) {
            const resolvedSchema = resolveRef(schema.$ref, schemas, visitedRefs);
            return generateExampleJson(resolvedSchema, schemas, new Set(visitedRefs));
        }

        if (schema.allOf) {
            const example: Record<string, any> = {};
            for (const subSchema of schema.allOf) {
                const subExample = generateExampleJson(subSchema, schemas, new Set(visitedRefs));
                if (typeof subExample === 'object' && subExample !== null) {
                    Object.assign(example, subExample);
                } else if (subExample !== null) {
                    return subExample;
                }
            }
            return Object.keys(example).length > 0 ? example : null;
        }

        if (schema.anyOf) {
            for (const subSchema of schema.anyOf) {
                const subExample = generateExampleJson(subSchema, schemas, new Set(visitedRefs));
                if (subExample !== null) {
                    return subExample;
                }
            }
            return null;
        }

        if (schema.properties) {
            const example: Record<string, any> = {};
            for (const [propName, propSchema] of Object.entries(schema.properties)) {
                example[propName] = generateExampleJson(propSchema, schemas, new Set(visitedRefs));
            }
            return example;
        }

        if (schema.type === 'array' && schema.items) {
            const itemExample = generateExampleJson(schema.items, schemas, new Set(visitedRefs));
            return itemExample !== null ? [itemExample] : [];
        }

        if (schema.enum) {
            return schema.enum[0] ?? null;
        }

        switch (schema.type) {
            case 'integer':
            case 'number': {
                let value = 42;
                if (typeof schema.minimum === 'number') {
                    value = Math.max(schema.minimum, value);
                }
                if (typeof schema.maximum === 'number') {
                    value = Math.min(schema.maximum, value);
                }
                return schema.type === 'integer' ? Math.floor(value) : value;
            }
            case 'string': {
                if (schema.format === 'date-time') {
                    return '2025-05-30T17:13:00Z';
                } else if (schema.format === 'url') {
                    let url = 'https://example.com';
                    const maxLength = typeof schema.maxLength === 'number' ? schema.maxLength : url.length;
                    const minLength = typeof schema.minLength === 'number' ? schema.minLength : 1;
                    while (url.length < minLength) {
                        url += '/a';
                    }
                    if (url.length > maxLength) {
                        url = url.slice(0, maxLength);
                    }
                    return url;
                } else if (schema.format === 'hostname') {
                    let hostname = 'example.com';
                    const maxLength = typeof schema.maxLength === 'number' ? schema.maxLength : hostname.length;
                    const minLength = typeof schema.minLength === 'number' ? schema.minLength : 1;
                    while (hostname.length < minLength) {
                        hostname += '.a';
                    }
                    if (hostname.length > maxLength) {
                        hostname = hostname.slice(0, maxLength);
                    }
                    return hostname;
                }
                if (schema.pattern) {
                    return generateStringForPattern(
                        schema.pattern,
                        typeof schema.minLength === 'number' ? schema.minLength : 1,
                        typeof schema.maxLength === 'number' ? schema.maxLength : 50
                    );
                }
                let str = 'example';
                const maxLength = typeof schema.maxLength === 'number' ? schema.maxLength : str.length;
                const minLength = typeof schema.minLength === 'number' ? schema.minLength : 1;
                while (str.length < minLength) {
                    str += 'a';
                }
                if (str.length > maxLength) {
                    str = str.slice(0, maxLength);
                }
                return str;
            }
            case 'boolean':
                return true;
            default:
                return null;
        }
    }
</script>

<div class="mb-6 w-full">
    <h2 class="text-3xl mb-6 pt-1 w-full" id="models">Models</h2>
    {#if Object.keys(schemas).length > 0}
        <div>
            {#each Object.entries(schemas) as [schemaName, schema]}
                <Collapsible.Root>
                    <Collapsible.Trigger class="w-full text-left">
                        <div class="p-4 w-full border-y flex justify-between items-center">
                            <div>
                                <h3 class="font-bold">{schemaName}</h3>
                                {#if schema.description}
                                    <p class="text-muted-foreground">{schema.description}</p>
                                {/if}
                            </div>
                            <Button variant="outline" size="icon">
                                <ChevronsUpDown />
                            </Button>
                        </div>
                    </Collapsible.Trigger>
                    <Collapsible.Content forceMount>
                        {#snippet child({ props, open })}
                            {#if open}
                                <div class="grid grid-cols-2 gap-4 p-4" transition:slide={{duration: 300}} {...props}>
                                    <div>

                                    </div>
                                    <div class="markdown">
                                        <CodeBlockRenderer text={JSON.stringify(generateExampleJson(schema, schemas), null, 2)} lang="json" title="Example"/>
                                    </div>
                                </div>
                            {/if}
                        {/snippet}
                        <!---->
                    </Collapsible.Content>
                </Collapsible.Root>
            {/each}
        </div>
    {:else}
        <p>No models defined in the API specification.</p>
    {/if}
</div>