/**
 * The description of OpenAPI v3.1.x
 */
export interface OpenAPIDocument {
    components?:        Components;
    externalDocs?:      ExternalDocs;
    info:               Info;
    jsonSchemaDialect?: string;
    openapi:            string;
    paths?:             { [key: string]: any };
    security?:          { [key: string]: string[] }[];
    servers?:           ServerElement[];
    tags?:              TagElement[];
    webhooks?:          { [key: string]: WebhookValue };
    [property: string]: any;
}

export interface Components {
    callbacks?:       { [key: string]: any };
    examples?:        { [key: string]: any };
    headers?:         { [key: string]: any };
    links?:           { [key: string]: any };
    parameters?:      { [key: string]: any };
    pathItems?:       { [key: string]: WebhookValue };
    requestBodies?:   { [key: string]: any };
    responses?:       { [key: string]: any };
    schemas?:         { [key: string]: any };
    securitySchemes?: { [key: string]: any };
    [property: string]: any;
}

export interface WebhookValue {
    $ref?:        string;
    delete?:      Delete;
    description?: string;
    get?:         Delete;
    head?:        Delete;
    options?:     Delete;
    parameters?:  any[];
    patch?:       Delete;
    post?:        Delete;
    put?:         Delete;
    servers?:     ServerElement[];
    summary?:     string;
    trace?:       Delete;
    [property: string]: any;
}

export interface Delete {
    callbacks?:    { [key: string]: any };
    deprecated?:   boolean;
    description?:  string;
    externalDocs?: ExternalDocs;
    operationId?:  string;
    parameters?:   any[];
    requestBody?:  any;
    responses?:    Responses;
    security?:     { [key: string]: string[] }[];
    servers?:      ServerElement[];
    summary?:      string;
    tags?:         string[];
    [property: string]: any;
}

export interface ExternalDocs {
    description?: string;
    url:          string;
    [property: string]: any;
}

export interface Responses {
    default?: any;
    [property: string]: any;
}

export interface ServerElement {
    description?: string;
    url:          string;
    variables?:   { [key: string]: VariableValue };
    [property: string]: any;
}

export interface VariableValue {
    default:      string;
    description?: string;
    enum?:        string[];
    [property: string]: any;
}

export interface Info {
    contact?:        Contact;
    description?:    string;
    license?:        License;
    summary?:        string;
    termsOfService?: string;
    title:           string;
    version:         string;
    [property: string]: any;
}

export interface Contact {
    email?: string;
    name?:  string;
    url?:   string;
    [property: string]: any;
}

export interface License {
    identifier?: string;
    name:        string;
    url?:        string;
    [property: string]: any;
}

export interface TagElement {
    description?:  string;
    externalDocs?: ExternalDocs;
    name:          string;
    [property: string]: any;
}
