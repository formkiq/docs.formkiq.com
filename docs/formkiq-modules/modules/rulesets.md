---
sidebar_position: 1
---

# Ruleset

The Ruleset module is a decision-making engine for documents based on a set of pre-defined or user-defined criteria that allow for the automatic triggering of workflows and processes.

A ruleset consists of individual rules, each defining a specific condition and the corresponding action to be taken when that condition is met. These rules can encompass a wide range of criteria, from basic conditions like a document's content type to more complex conditions like matching barcodes or specific metadata. 

Additionally, there is the flexibility to assign priorities to both rules and rulesets within the system. This prioritization enables fine-tuning of the workflow, ensuring that certain conditions take precedence over others when multiple rulesets or rules are applicable simultaneously. By adjusting the priority levels, organizations can tailor the automation process to align with their strategic objectives and operational requirements effectively.

## Supported Conditions

Rule support the following conditions:

| Attribute    | Supports  | Supported Operations |
| -------- | ------- | ------- |
| CONTENT_TYPE | * | EQ, CONTAINS |
| TEXT | application/pdf, text/* | EQ, CONTAINS |
| BARCODE | application/pdf | EQ, CONTAINS |
| FIELD | application/pdf | EQ, CONTAINS |


## Use Cases
 
Here are some examples illustrating the importance of rulesets and rules in document processing:

**Document Classification**: Rulesets can be employed to classify incoming documents based on their content, format, or metadata. For instance, a rule might specify that any document containing specific keywords related to financial reports should be classified as "Financial Documents". This classification enables efficient organization and routing of documents for further processing.

**Data Extraction**: Rulesets can facilitate the extraction of key information from documents, such as invoices or forms. By defining rules that identify and extract data fields like invoice numbers, dates, and total amounts, organizations can automate data entry tasks and reduce manual errors.

**Validation and Verification**: Rulesets can include rules for validating the accuracy and completeness of document content. For instance, a rule might verify that an invoice's total amount matches the sum of individual line items. If discrepancies are detected, the system can trigger alerts or require manual intervention to resolve the issue.

**Routing and Workflow Automation**: Rulesets can determine the routing of documents through different stages of a workflow based on predefined criteria. For example, rules can specify that purchase orders above a certain amount require approval from a manager before proceeding to the next step in the procurement process.

**Compliance and Regulatory Requirements**: Rulesets are crucial for ensuring compliance with regulatory standards and internal policies governing document processing. Organizations can establish rules that flag documents containing sensitive information, such as personally identifiable information (PII) or financial data, to ensure proper handling and adherence to data protection regulations.

In each of these scenarios, rulesets and rules play a vital role in automating document processing tasks, improving efficiency, accuracy, and compliance across various business processes.

## Next Steps

To learn more about how you can use Rulesets, check out the following links:

* [Ruleset tutorial](/docs/tutorials/ruleset)
