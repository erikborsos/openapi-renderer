import type {
	OpenAPIObject,
	PathItemObject,
	ReferenceObject,
	SchemaObject
} from "openapi3-ts/oas31"
import type { OperationObject } from "openapi3-ts/oas30"
import { Braces } from "@lucide/svelte"
import type {
	SidebarItem,
	SidebarNode,
	SidebarMenu,
	SidebarGroup
} from "$lib/components/layout/sidebar/Sidebar.svelte"
import $RefParser from "@apidevtools/json-schema-ref-parser"

export let spec: OpenAPIObject

export async function setSpec(newSpec: OpenAPIObject) {
	const parser = new $RefParser()
	try {
		spec = (await parser.dereference(newSpec)) as unknown as OpenAPIObject
	} catch (error) {
		console.error("Error dereferencing OpenAPI spec:", error)
		spec = newSpec
	}
}

// === SIDEBAR GENERATION ===

const httpMethods = ["get", "post", "put", "delete", "patch", "options", "head", "trace"]
export function generateSidebarFromOpenAPI(): SidebarNode[] {
	const sidebar: SidebarNode[] = [
		{
			type: "item",
			name: "Overview",
			href: "/"
		}
	]

	const tagMap = new Map<string, SidebarItem[]>()
	const untaggedOperations: SidebarItem[] = []

	// Iterate through paths and operations
	for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
		const pathItemTyped: PathItemObject = pathItem as PathItemObject
		for (const [method, operation] of Object.entries(pathItemTyped)) {
			// Skip non-HTTP methods (e.g., parameters)
			if (!httpMethods.includes(method.toLowerCase())) continue

			const operationTyped: OperationObject | undefined = operation as OperationObject | undefined
			if (operationTyped && typeof operationTyped === "object") {
				const operationId: string =
					operationTyped.operationId ?? `${method}-${path.replace(/[/{}]/g, "_")}`
				const item: SidebarItem = {
					type: "item",
					name: operationTyped.summary ?? operationId,
					href: `/operations/${operationId}`
				}

				if (
					"tags" in operationTyped &&
					Array.isArray(operationTyped.tags) &&
					operationTyped.tags.length > 0
				) {
					operationTyped.tags.forEach((tag: string) => {
						if (!tagMap.has(tag)) {
							tagMap.set(tag, [])
						}
						tagMap.get(tag)!.push(item)
					})
				} else {
					untaggedOperations.push(item)
				}
			}
		}
	}

	if (spec["x-tagGroups"] && Array.isArray(spec["x-tagGroups"]) && spec["x-tagGroups"].length > 0) {
		const tagGroups = spec["x-tagGroups"] as { name: string; tags: string[] }[]
		const groupedTags = new Set<string>(tagGroups.flatMap((group) => group.tags))

		if (untaggedOperations.length > 0) {
			sidebar.push({
				type: "group",
				name: "Default",
				items: [
					{
						type: "menu",
						name: "Default",
						items: untaggedOperations
					}
				]
			})
		}

		const ungroupedTags = Array.from(tagMap.keys()).filter((tag) => !groupedTags.has(tag))
		if (ungroupedTags.length > 0) {
			const miscGroup: SidebarGroup = {
				type: "group",
				name: "Miscellaneous",
				items: ungroupedTags.map((tagName) => ({
					type: "menu",
					name: tagName,
					items: tagMap.get(tagName)!
				}))
			}
			sidebar.push(miscGroup)
		}

		// Process x-tagGroups
		const tagGroupsItems: SidebarGroup[] = tagGroups.map((group) => {
			const groupItems: (SidebarMenu | SidebarItem)[] = group.tags
				.map((tagName: string) => {
					const operations = tagMap.get(tagName)
					if (!operations || operations.length === 0) return null

					return {
						type: "menu",
						name: tagName,
						items: operations
					}
				})
				.filter((item): item is SidebarMenu => item !== null)

			return {
				type: "group",
				name: group.name,
				items: groupItems
			}
		})

		sidebar.push(...tagGroupsItems)
	} else {
		const operationsGroup: SidebarGroup = {
			type: "group",
			name: "Operations",
			items: []
		}

		// Add untagged operations as a Default menu at the top
		if (untaggedOperations.length > 0) {
			operationsGroup.items.push({
				type: "menu",
				name: "Default",
				items: untaggedOperations
			})
		}

		// Convert tagMap to SidebarMenu items
		operationsGroup.items.push(
			...Array.from(tagMap.entries()).map(([tagName, items]) => ({
				type: "menu" as const,
				name: tagName,
				items
			}))
		)

		if (operationsGroup.items.length > 0) {
			sidebar.push(operationsGroup)
		}
	}

	// Add Schemas group
	const schemas = spec.components?.schemas ?? {}
	const schemaItems: SidebarItem[] = Object.keys(schemas).map((schemaName: string) => ({
		type: "item",
		name: schemaName,
		href: `/schemas/${schemaName}`,
		icon: Braces
	}))

	if (schemaItems.length > 0) {
		sidebar.push({
			type: "group",
			name: "Schemas",
			items: schemaItems
		})
	}

	return sidebar
}

// === SCHEMA EXAMPLE GENERATION ===

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[]

function fitString(str: string, min: number = 1, max: number = 50): string {
	while (str.length < min) {
		str += "a"
	}
	if (str.length > max) {
		str = str.slice(0, max)
	}
	return str
}

function generateStringForPattern(
	pattern: string,
	minLength: number = 1,
	maxLength: number = 50
): string {
	pattern = pattern.replace(/^\/|\/$/g, "")
	try {
		if (pattern === "^[a-z0-9._]+$") {
			return fitString("example", minLength, maxLength)
		}
		return fitString("example", minLength, maxLength)
	} catch (e) {
		console.warn(`Invalid pattern: ${pattern}, using default string`, e)
		return fitString("example", minLength, maxLength)
	}
}

export function generateExampleJson(schema: SchemaObject | ReferenceObject): JsonValue {
	if ("$ref" in schema) {
		console.warn(`Circular reference marker found: ${schema.$ref}`)
		return null
	}

	if ("example" in schema && schema.example !== undefined) {
		return schema.example as JsonValue
	}

	if ("default" in schema && schema.default !== undefined) {
		return schema.default as JsonValue
	}

	if (schema.allOf) {
		const example: JsonValue = {}
		for (const subSchema of schema.allOf as SchemaObject[]) {
			const subExample = generateExampleJson(subSchema)
			if (typeof subExample === "object" && subExample !== null) {
				Object.assign(example, subExample)
			} else if (subExample !== null) {
				return subExample
			}
		}
		return Object.keys(example).length > 0 ? example : null
	}

	if (schema.anyOf || schema.oneOf) {
		const variants = schema.anyOf ?? schema.oneOf
		for (const subSchema of variants as SchemaObject[]) {
			const subExample = generateExampleJson(subSchema)
			if (subExample !== null) {
				return subExample
			}
		}
		return null
	}

	if (schema.properties) {
		const example: JsonValue = {}
		for (const [propName, propSchema] of Object.entries(schema.properties)) {
			example[propName] = generateExampleJson(propSchema as SchemaObject)
		}
		return example
	}

	if (
		schema.type === "object" &&
		schema.additionalProperties &&
		typeof schema.additionalProperties === "object"
	) {
		return {
			key: generateExampleJson(schema.additionalProperties as SchemaObject)
		}
	}

	if (schema.type === "array" && schema.items) {
		const itemExample = generateExampleJson(schema.items as SchemaObject)
		return itemExample !== null ? [itemExample] : []
	}

	if (schema.enum) {
		return schema.enum[0] ?? null
	}

	switch (schema.type) {
		case "integer":
		case "number": {
			let value = 42
			if (typeof schema.minimum === "number") {
				value = Math.max(schema.minimum, value)
			}
			if (typeof schema.maximum === "number") {
				value = Math.min(schema.maximum, value)
			}
			return schema.type === "integer" ? Math.floor(value) : value
		}
		case "string": {
			const maxLength = typeof schema.maxLength === "number" ? schema.maxLength : 50
			const minLength = typeof schema.minLength === "number" ? schema.minLength : 1

			switch (schema.format) {
				case "date-time":
					return "2025-05-30T17:13:00Z"
				case "date":
					return "2025-05-30"
				case "time":
					return "17:13:00Z"
				case "url":
					return fitString("https://example.com", minLength, maxLength)
				case "hostname":
					return fitString("example.com", minLength, maxLength)
				case "email":
					return fitString("user@example.com", minLength, maxLength)
				case "uuid":
					return "123e4567-e89b-12d3-a456-426614174000"
				case "ipv4":
					return "192.168.1.1"
				case "ipv6":
					return "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
				case "binary":
					return "binary-data"
				case "byte":
					return btoa("example")
				case "password":
					return fitString("securePass123", minLength, maxLength)
			}

			if (schema.pattern) {
				return generateStringForPattern(schema.pattern, minLength, maxLength)
			}

			return fitString("example", minLength, maxLength)
		}
		case "boolean":
			return true
		default:
			return null
	}
}
