---
title: JSON
row: M1-L2.2
---
**In one sentence:** JSON is a plain-text way of writing structured data that both a browser's JavaScript and a backend's Python can read and write without confusion.

## What it is

JSON stands for JavaScript Object Notation. It is a text format for representing data: numbers, text, true/false values, lists, and nested groups of named values. It looks like this:

```json
{
  "city": "Lahore",
  "temp_c": 32.1,
  "is_daytime": true,
  "forecast": [29.5, 31.0, 33.2]
}
```

Almost every modern API sends and receives JSON in the body of its HTTP requests and responses. It became the standard because it is readable at a glance, and because nearly every language has a built-in way to turn JSON text into that language's native data structures, and back again. In Python that structure is usually a dictionary, in JavaScript an object. The text itself is neutral, which is why it works between a browser and a server written in different languages.

JSON supports exactly six kinds of values: strings (double quotes), numbers, booleans (`true` or `false`), `null`, objects (key-value pairs in curly braces), and arrays (ordered lists in square brackets). There are no comments, no dates as a native type, and no trailing commas allowed.

## Why an FDE needs this

Most integration bugs an FDE sees are JSON shape mismatches: the backend expects a field called `city_name` but the frontend sends `city`. Reading raw JSON in the Network tab and comparing it field by field against what the code expects turns a vague "the data isn't showing up" complaint into a precise diagnosis.

## Key concepts

### JSON in a Python backend

```python
import json

data = {"city": "Lahore", "temp_c": 32.1}
json_text = json.dumps(data)   # Python dict to JSON text
parsed = json.loads(json_text) # JSON text back to Python dict
```

## Common misconceptions

- **"JSON and a Python dictionary are the same thing."** JSON is text. A Python dictionary is an in-memory data structure. Code has to explicitly convert between them, using `json.dumps` or `json.loads`.
- **"If the JSON parses, the data is correct."** Parsing only confirms the text is valid JSON. It says nothing about whether the fields have the names or values the receiving code expects.

## Typical interview questions

<details>
<summary>What is JSON, and why is it used for APIs?</summary>

JSON is a plain-text format for structured data, built from strings, numbers, booleans, null, objects, and arrays. It is used for APIs because it is human-readable and nearly every programming language can convert it to and from its own native data structures.

</details>

<details>
<summary>A backend endpoint returns data but the frontend shows nothing. What would you check first?</summary>

Open the Network tab, look at the raw response body, and compare the field names and types against what the frontend code expects to read. A common cause is a field name mismatch, like the backend sending `city_name` while the frontend reads `city`.

</details>

## Learn more

- Article: [Working with JSON](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON) (MDN)

## Related

- [HTTP Requests and Responses](./04-http-request-response.md)
- [Status Codes](./06-status-codes.md)
- [CSV and Tables](../03-apis-data-integration/08-csv-and-tables.md)
- [Schema and Data Contracts](../03-apis-data-integration/10-schema-and-data-contracts.md)
