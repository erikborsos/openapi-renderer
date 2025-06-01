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

export let spec: OpenAPIObject

export function setSpec(newSpec: OpenAPIObject) {
	spec = newSpec
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

function resolveRef(ref: string, visitedRefs: Set<string>): SchemaObject {
	const refPath = ref.replace("#/components/schemas/", "")
	const pathParts = refPath.split("/properties/")
	let schema = spec.components?.schemas?.[pathParts[0]]
	if (!schema) {
		console.warn(`Schema not found for ref: ${ref}`)
		return {}
	}
	for (let i = 1; i < pathParts.length; i++) {
		if ("properties" in schema) {
			schema = schema.properties?.[pathParts[i]] || {}
		} else {
			schema = {}
		}
	}
	/*if (visitedRefs.has(refPath)) {
		return `[Circular *${refPath}]`
	}*/
	visitedRefs.add(refPath)
	return schema as SchemaObject
}

function generateStringForPattern(
	pattern: string,
	minLength: number = 1,
	maxLength: number = 50
): string {
	pattern = pattern.replace(/^\/|\/$/g, "")
	try {
		if (pattern === "^[a-z0-9._]+$") {
			let result = "example"
			while (result.length < minLength) {
				result += "a"
			}
			if (result.length > maxLength) {
				result = result.slice(0, maxLength)
			}
			return result
		}
		let result = "example"
		while (result.length < minLength) {
			result += "a"
		}
		if (result.length > maxLength) {
			result = result.slice(0, maxLength)
		}
		return result
	} catch (e) {
		console.warn(`Invalid pattern: ${pattern}, using default string`, e)
		return "example".slice(0, Math.min(maxLength, Math.max(minLength, 7)))
	}
}
export function generateExampleJson(
	schema: SchemaObject | ReferenceObject,
	visitedRefs: Set<string> = new Set()
): JsonValue | null {
	if ("$ref" in schema) {
		const resolvedSchema = resolveRef(schema.$ref, visitedRefs)
		return generateExampleJson(resolvedSchema, new Set(visitedRefs))
	}

	if ("example" in schema && schema.example !== undefined) {
		return schema.example as JsonValue // Ensure example is treated as JsonValue
	}

	if (schema.allOf) {
		const example: JsonValue = {}
		for (const subSchema of schema.allOf) {
			const subExample = generateExampleJson(subSchema, new Set(visitedRefs))
			if (typeof subExample === "object" && subExample !== null) {
				Object.assign(example, subExample)
			} else if (subExample !== null) {
				return subExample
			}
		}
		return Object.keys(example).length > 0 ? example : null
	}

	if (schema.anyOf) {
		for (const subSchema of schema.anyOf) {
			const subExample = generateExampleJson(subSchema, new Set(visitedRefs))
			if (subExample !== null) {
				return subExample
			}
		}
		return null
	}

	if (schema.properties) {
		const example: JsonValue = {}
		for (const [propName, propSchema] of Object.entries(schema.properties)) {
			example[propName] = generateExampleJson(propSchema, new Set(visitedRefs))
		}
		return example
	}

	if (schema.type === "array" && schema.items) {
		const itemExample = generateExampleJson(schema.items, new Set(visitedRefs))
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
			if (schema.format === "date-time") {
				return "2025-05-30T17:13:00Z"
			} else if (schema.format === "date") {
				return "2025-05-30"
			} else if (schema.format === "time") {
				return "17:13:00Z"
			} else if (schema.format === "url") {
				let url = "https://example.com"
				const maxLength = typeof schema.maxLength === "number" ? schema.maxLength : url.length
				const minLength = typeof schema.minLength === "number" ? schema.minLength : 1
				while (url.length < minLength) {
					url += "/a"
				}
				if (url.length > maxLength) {
					url = url.slice(0, maxLength)
				}
				return url
			} else if (schema.format === "hostname") {
				let hostname = "example.com"
				const maxLength = typeof schema.maxLength === "number" ? schema.maxLength : hostname.length
				const minLength = typeof schema.minLength === "number" ? schema.minLength : 1
				while (hostname.length < minLength) {
					hostname += ".a"
				}
				if (hostname.length > maxLength) {
					hostname = hostname.slice(0, maxLength)
				}
				return hostname
			} else if (schema.format === "email") {
				let email = "user@example.com"
				const maxLength = typeof schema.maxLength === "number" ? schema.maxLength : email.length
				const minLength = typeof schema.minLength === "number" ? schema.minLength : 1
				while (email.length < minLength) {
					email = "u" + email
				}
				if (email.length > maxLength) {
					email = email.slice(0, maxLength)
				}
				return email
			} else if (schema.format === "uuid") {
				return "123e4567-e89b-12d3-a456-426614174000"
			} else if (schema.format === "ipv4") {
				return "192.168.1.1"
			} else if (schema.format === "ipv6") {
				return "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
			} else if (schema.format === "binary") {
				return "binary-data"
			} else if (schema.format === "byte") {
				return Buffer.from("example").toString("base64")
			} else if (schema.format === "password") {
				let password = "securePass123"
				const maxLength = typeof schema.maxLength === "number" ? schema.maxLength : password.length
				const minLength = typeof schema.minLength === "number" ? schema.minLength : 1
				while (password.length < minLength) {
					password += "x"
				}
				if (password.length > maxLength) {
					password = password.slice(0, maxLength)
				}
				return password
			}
			if (schema.pattern) {
				return generateStringForPattern(
					schema.pattern,
					typeof schema.minLength === "number" ? schema.minLength : 1,
					typeof schema.maxLength === "number" ? schema.maxLength : 50
				)
			}
			let str = "example"
			const maxLength = typeof schema.maxLength === "number" ? schema.maxLength : str.length
			const minLength = typeof schema.minLength === "number" ? schema.minLength : 1
			while (str.length < minLength) {
				str += "a"
			}
			if (str.length > maxLength) {
				str = str.slice(0, maxLength)
			}
			return str
		}
		case "boolean":
			return true
		default:
			return null
	}
}
