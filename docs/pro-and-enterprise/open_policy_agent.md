---
sidebar_position: 1
---

# Open Policy Agent (OPA)

[Open Policy Agent (OPA)](https://www.openpolicyagent.org/) is an open-source policy engine that enables organizations to define and enforce policies across their software applications and infrastructure. 

FormKiQ uses OPA as a decision engine that evaluates policies against incoming requests or data. By using FormKiQ with OPA, organizations can apply fine-grained attribute-based access controls (ABAC), ensuring that only authorized users or systems can interact with specific resources.

OPA facilitates centralized policy management, making it easier for organizations to maintain and update policies across different services and APIs consistently.

## Architecture

![FormKiQ File Sync Module](./img/architecture_formkiq_open_policy_agent.png)

Open Policy Agent can be enabled during the FormKiQ CloudFormation installation. Once enabled, every request that successfully passes through the API to the backend system is then evaluated by OPA's policy decision engine to assess whether the request aligns with the defined policies.

:::note
OPA policy can be configured globally or per FormKiQ site.
:::

## Open Policy Agent API

Open Policy Agent has specific endpoints that allow for the configuration of policies.

### Configure Open Policy Agent

Open Policy Agent's policy decisions can be set at a site-wide global level or at an individual site level.

The `PUT /configuration/opa` endpoint allows the setting of the OPA policy.
```
{
  "policy": "string",
  "siteId": "string"
}
```

:::note
Endpoint can only be called with `Admins` role
:::

### Get Open Policy Agent

The `GET /configuration/opa` endpoint allow for the retrival of the OPA policy.

:::note
Endpoint can only be called with `Admins` role
:::

### Delete Open Policy Agent

The `DELETE /configuration/opa` endpoint allow for the removal of the OPA policy.

:::note
Endpoint can only be called with `Admins` role
:::

## Access Control

Open Policy Agent (OPA) evaluates a policy through a declarative and rule-based approach. There are two parts to this process. 

* A policy which defines the rules and conditions that dictate whether a given request is allowed or denied.
* A input data, which includes information about the requestor, the resource being accessed, and other relevant contextual details

Both of these pieces of information are sent to the OPA's policy evaluation process to determine whether the request is allowed or not.

### Input Data Format

The Open Policy Input refers to the data or information that is provided to OPA for evaluation against the defined policies.

FormKiQ creates the following Input structure for the OPA's policy decision engine.

```
{
    "resource": "<resource path specifies the endpoint>",
    "httpMethod": "<http method>",
    "pathParameters": <map of parameters from the request URL>
    "queryParameters": <map of query from the request URL>
    "user": {
        "username": <user name>
        "roles": <string list of roles>
    }
}
```

An example of the Open Policy Input for a document resources.

```
{
    "resource": "/documents/{documentId}",
    "httpMethod": "GET",
    "pathParameters": {
        "documentId": "fe03fe66-1338-4163-a86b-ab455202fd57"
    },
    "queryParameters":{
        "siteId": "default"
    }, 
    "user":{
        "username": "<email>@yourcompany.com",
        "roles": ["Admins"]
    }
}
```

### Role-Based Access Control (RBAC)

FormKiQ, by default, uses a role based structured approach to define and enforce access policies. Using Open Policy Agent, these rules can be expanded and customized to meet security requirements.

The following is an example of a role based access control (RBAC) Open Policy Agent data file. 

```
package formkiq

import future.keywords.if
import future.keywords.in

default allow := false

#
# Allow Admins role
#
allow if {
    "Admins" in input.user.roles
}

#
# Allow User Role in SiteId
#
allow if {
    input.queryParameters.siteId in input.user.roles
}

#
# Allow User Read Role in SiteId
#
allow if {
    input.httpMethod == "GET"
    concat("_read", [input.queryParameters.siteId, ""]) in input.user.roles
}

#
# Allow User Read Role in SiteId access to /search
#
allow if {
    input.httpMethod == "POST"
    input.resource == "/search"
    concat("_read", [input.queryParameters.siteId, ""]) in input.user.roles
}
```

### Attribute-Based Access Control (ABAC)

Attribute-Based Access Control (ABAC) allows to designing and implementing policies that govern access based on resource attributes. OPA's policy language allows for the definition of complex attribute-based rules.

These "accessAttributes" can be added when the document is originally created via the `POST /documents` endpoint.

Additionally the `POST /documents/{documentId}/accessAttributes` and `PUT /documents/{documentId}/accessAttributes`

:::note
The `/documents/{documentId}/accessAttributes` endpoint(s) can only be called with `Admins` role
:::

When the Open Policy Agent evaluates an policy that requires "accessAttributes" to be evaluated, it returns a "partial" evaluation. Attached to this "partial" evaluation are additional criteria that need to be evaluated to fulfill the request. FormKiQ automatically adds these criteria to any queries / lookups and completes the evaluation.

The following is an example of a attribute-based access control (RBAC) Open Policy Agent data file that adds a "documentType" access attribute requirement.

```
package formkiq

import future.keywords.if
import future.keywords.in

default allow := false

#
# Allow users with the customer_service role access to documents that have
# the access control 'documentType' = "customerService"
#
allow if {
    "customer_service" in input.user.roles
    data.documents.documentType = "customerService"
}
```

## Limitations

Due to Open Policy Agent's flexible nature, there are some limitations depending on your policy.

### Partial Evaluations

Partial evaluation is where OPA evaluates a policy against some input data and generates a partially evaluated policy. The part of the policy that could not be evaluated needs to be evaluated at the data store layer. DynamoDb is built for performance on predictable data access patterns. Therefore API endpoints like `POST /search` are unable to complete the evaluation and will return no results.

Instead, services like OpenSearch using the `POST /searchFulltext` or `POST /queryFulltext` can be used to search for documents using partially evaluated policies.