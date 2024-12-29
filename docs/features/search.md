---
sidebar_position: 30
---

# Search

## Overview

FormKiQ provides flexible search capabilities through three powerful search providers:
- [Amazon DynamoDB](https://aws.amazon.com/dynamodb)
- [Amazon OpenSearch](https://aws.amazon.com/opensearch-service)
- [Typesense](https://typesense.org)

## Search Providers

### DynamoDB
Amazon DynamoDB offers:
- Single-digit millisecond response times
- Automatic scaling
- High availability
- Flexible schema design

### OpenSearch
Amazon OpenSearch provides:
- Full-text search capabilities
- Complex search queries
- Advanced analytics
- Automatic updates via DynamoDB change data capture

### Typesense
Deployed via AWS ECS Fargate, Typesense delivers:
- Typo-tolerant search
- Fast response times
- Relevant result ranking
- Simple API integration
- Automatic updates via DynamoDB change data capture

![Typesense Architecture](./img/architecture_typesense.png)

## Search Capabilities

### Supported Search Criteria
- Search by key
- Search by key and exact value
- Search by key and value list
- Search by key and value prefix
- Search by key and value range

## API Reference

### Single Attribute Search
**Endpoint**: `/search`, `/searchFulltext`

#### Search by Key
```json
{
  "query": {
    "attribute": {
      "key": "category"
    }
  }
}
```

#### Search by Key and Value
```json
{
  "query": {
    "attribute": {
      "key": "category",
      "eq": "person"
    }
  }
}
```

#### Search by Key Prefix
```json
{
  "query": {
    "attribute": {
      "key": "category",
      "beginsWith": "p"
    }
  }
}
```

#### Search by Number Range
```json
{
  "query": {
    "attribute": {
      "key": "category",
      "range": {
        "start": 10,
        "end": "90",
        "type": "NUMBER"
      }
    }
  }
}
```

#### Search by String Range
```json
{
  "query": {
    "attribute": {
      "key": "invoice",
      "range": {
        "start": "2024-01-10",
        "end": "2024-01-31",
        "type": "STRING"
      }
    }
  }
}
```

### Multiple Attribute Search
**Endpoint**: `/search`, `/searchFulltext`

:::note
DynamoDB support for multiple attributes requires Composite Keys. All attributes except the last must use "eq" criteria.
:::

#### Multiple Keys and Values
```json
{
  "query": {
    "attributes": [{
      "key": "category",
      "eq": "person"
    }, {
      "key": "name",
      "eq": "John"
    }]
  }
}
```

#### Multiple Keys with Prefix
```json
{
  "query": {
    "attributes": [{
      "key": "category",
      "eq": "person"
    }, {
      "key": "name",
      "beginsWith": "J"
    }]
  }
}
```

#### Multiple Keys with Number Range
```json
{
  "query": {
    "attributes": [{
      "key": "documentType",
      "eq": "invoice"
    }, {
      "key": "total",
      "range": {
        "start": 1000,
        "end": "9000",
        "type": "NUMBER"
      }
    }]
  }
}
```

#### Multiple Keys with String Range
```json
{
  "query": {
    "attributes": [{
      "key": "documentType",
      "eq": "invoice"
    }, {
      "key": "date",
      "range": {
        "start": "2024-01-10",
        "end": "2024-01-31",
        "type": "STRING"
      }
    }]
  }
}
```

### Full-text Search
**Endpoint**: `/search`, `/searchFulltext`  
**Supported by**: OpenSearch, Typesense

```json
{
  "query": {
    "text": "invoice documents"
  }
}
```

### Complex Search
**Endpoint**: `/queryFulltext`  
**Supported by**: OpenSearch

The `/queryFulltext` endpoint supports all OpenSearch query DSL functions, allowing for sophisticated search operations including matches, filters, aggregations, and more.

#### Basic Match Query
```json
{
  "query": {
    "match": {
      "title": "Wind"
    }
  }
}
```

#### Aggregation Example
```json
// Request
{
  "query": {
    "match_all": {}
  },
  "aggs": {
    "document_types": {
      "terms": {
        "field": "documentType.keyword"
      }
    }
  }
}

// Response
{
  "took": 3,
  "hits": {
    "total": {
      "value": 150,
      "relation": "eq"
    },
    "hits": [...]
  },
  "aggregations": {
    "document_types": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "invoice",
          "doc_count": 57
        },
        {
          "key": "contract",
          "doc_count": 43
        },
        {
          "key": "report",
          "doc_count": 29
        },
        {
          "key": "receipt",
          "doc_count": 21
        }
      ]
    }
  }
}
```

#### Combined Query and Filter
```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "content": "invoice" } }
      ],
      "filter": [
        { "term": { "status.keyword": "approved" } },
        { "range": { "amount": { "gte": 1000 } } }
      ]
    }
  }
}
```

For complete OpenSearch query capabilities, refer to the [OpenSearch Documentation](https://opensearch.org/docs/latest/query-dsl).

## Provider Compatibility

| Search Type | DynamoDB | OpenSearch | Typesense |
|-------------|----------|------------|-----------|
| Single Attribute | ✓ | ✓ | ✓ |
| Multiple Attributes | ✓* | ✓ | - |
| Full-text | - | ✓ | ✓ |
| Complex Queries | - | ✓ | - |

*Requires Composite Keys