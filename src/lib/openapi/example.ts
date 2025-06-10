import type { ReferenceObject, SchemaObject } from "openapi3-ts/oas31"

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

	return generateExample(schema)
}

export function generateExample(schema: SchemaObject): JsonValue {
	if ("example" in schema && schema.example !== undefined) {
		return schema.example as JsonValue
	}

	if ("default" in schema && schema.default !== undefined) {
		return schema.default as JsonValue
	}

	const type = Array.isArray(schema.type) ? schema.type[0] : schema.type
	switch (type) {
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
