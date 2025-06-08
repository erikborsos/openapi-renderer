<script lang="ts">
	import type { SchemaObject } from "openapi3-ts/oas31"
	import Schema from "./Schema.svelte"

	let {
		schema,
		schemaName,
		root = false
	}: { schema: SchemaObject; schemaName?: string; root?: boolean } = $props()

	function mergeAllOf(schema: SchemaObject): SchemaObject {
		if (!schema || !schema.allOf || !Array.isArray(schema.allOf)) {
			const result = { ...schema }
			if (result.properties) {
				result.properties = Object.fromEntries(
					Object.entries(result.properties).map(([key, prop]) => [
						key,
						mergeAllOf(prop as SchemaObject)
					])
				)
			}
			if (schema.allOf && Array.isArray(schema.allOf)) {
				let mergedSchema: SchemaObject = {}
				for (const subSchema of schema.allOf) {
					const resolved = mergeAllOf(subSchema as SchemaObject)
					mergedSchema = { ...mergedSchema, ...resolved }
				}
				for (const key in schema) {
					if (key !== "allOf" && schema[key as keyof SchemaObject] !== undefined) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						;(mergedSchema as any)[key] = schema[key as keyof SchemaObject]
					}
				}
				return mergedSchema
			}
			return result
		}

		// Initialize merged schema
		const merged: SchemaObject = {
			type: "object",
			properties: {},
			required: []
		}

		// Copy top-level attributes from the original schema (e.g., nullable)
		for (const key in schema) {
			if (key !== "allOf" && schema[key as keyof SchemaObject] !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				;(merged as any)[key] = schema[key as keyof SchemaObject]
			}
		}

		// Process each sub-schema in allOf
		for (const subSchema of schema.allOf) {
			const resolvedSchema = mergeAllOf(subSchema as SchemaObject)

			// Merge properties if the resolved schema is an object with properties
			if (resolvedSchema.properties) {
				Object.assign(merged.properties!, resolvedSchema.properties)
			}

			// Merge required fields if present
			if (resolvedSchema.required && Array.isArray(resolvedSchema.required)) {
				merged.required!.push(...resolvedSchema.required)
			}

			// Merge other top-level attributes (e.g., description, nullable), excluding allOf
			for (const key in resolvedSchema) {
				if (
					key !== "properties" &&
					key !== "required" &&
					key !== "allOf" &&
					resolvedSchema[key as keyof SchemaObject] !== undefined
				) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					;(merged as any)[key] = resolvedSchema[key as keyof SchemaObject]
				}
			}
		}

		// Remove required array if empty
		if (merged.required!.length === 0) {
			delete merged.required
		}

		// Remove properties object if empty
		if (Object.keys(merged.properties!).length === 0) {
			delete merged.properties
		}

		return merged
	}
</script>

<Schema schema={mergeAllOf(schema)} {schemaName} {root} />
