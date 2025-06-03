import type { OpenAPIObject, SchemaObject } from "openapi3-ts/oas31"

export const getTypeColor = (type: string | string[]): string => {
	if (Array.isArray(type)) {
		type = type.filter((t) => t !== "null")
		if (type.length === 1) type = type[0]
		else return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
	}

	if (type.includes("array")) {
		return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
	}

	switch (type) {
		case "string":
			return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
		case "number":
		case "integer":
			return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
		case "boolean":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
		case "array":
			return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
		case "object":
			return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
	}
}

export const formatType = (schema: SchemaObject): string => {
	const type = schema.type ?? "any"
	if (Array.isArray(type)) {
		return type.filter((t) => t !== "null").join(" | ")
	}

	if (type === "any") {
		if (schema.anyOf) {
			return schema.anyOf.map((subSchema) => formatType(subSchema as SchemaObject)).join(" | ")
		} else if (schema.oneOf) {
			return schema.oneOf.map((subSchema) => formatType(subSchema as SchemaObject)).join(" | ")
		} else if (schema.properties) {
			return "object"
		} else if (schema.items) {
			return `array<${formatType(schema.items as SchemaObject)}>`
		}
	}

	if (type === "array") {
		if (schema.items) {
			return `array[${formatType(schema.items as SchemaObject)}]`
		}
	}

	if (type !== "object" && type !== "array" && type !== "null") {
		if (schema.format) {
			return `${type} <${schema.format}>`
		}
	}

	return type
}

export function isPrimitiveType(schema: SchemaObject): boolean {
	const primitiveTypes = ["string", "number", "integer", "boolean", "null"]

	if (schema.type) {
		if (Array.isArray(schema.type)) {
			return schema.type.every((type) => primitiveTypes.includes(type))
		} else if (primitiveTypes.includes(schema.type)) {
			return true
		}
	}

	if (schema.enum) {
		return !schema.type || primitiveTypes.includes(schema.type as string)
	}

	return (
		!schema.allOf &&
		!schema.anyOf &&
		!schema.oneOf &&
		!schema.properties &&
		!schema.items &&
		!schema.additionalProperties
	)
}
