import type { OperationObject } from "openapi3-ts/oas30"
import { Braces } from "@lucide/svelte"
import type {
	SidebarItem,
	SidebarNode,
	SidebarMenu,
	SidebarGroup
} from "$lib/components/layout/sidebar/Sidebar.svelte"
import { spec } from "."
import type { PathItemObject } from "openapi3-ts/oas31"

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
					href: `/operations/${operationId}`,
					method: method.toUpperCase() as string
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
