import type { OpenAPIObject } from "openapi3-ts/oas31"

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

export * from "./generation"
export * from "./schema"
export * from "./example"
export * from "./badge"
