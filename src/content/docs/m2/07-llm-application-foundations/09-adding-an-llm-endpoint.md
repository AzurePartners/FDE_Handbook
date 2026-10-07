---
title: Adding an LLM Endpoint to an Existing Service
row: M2-L1.9
---
**In one sentence:** An LLM endpoint is one narrow new route in an existing backend, such as `POST /triage`, that calls a model behind cost limits, turns each model outcome into a clear HTTP response, and can be switched off.

## What it is

Clients rarely need a new AI app. They need one new ability, such as ticket category suggestions, in software that already has login, logging and deployment. You add one route.

The call is easy; the controls are the work. A billing alert is your bank texting you after a big charge; a spending limit is the card being declined. Your endpoint needs the declined card.

Module 1 covers the basics: call from the server (the official Anthropic and OpenAI TypeScript SDKs refuse browsers without a `dangerouslyAllowBrowser` flag), read the key from configuration, set your own timeout instead of the SDKs' 10-minute default ([Timeouts](../../m1/06-reliability-scale/04-timeouts.md)), and move slow work to a background job.

## Why an FDE needs this

A software company wants AI triage in its helpdesk: `POST /tickets/{id}/triage` returns `{category, priority, summary}`, and the demo works. In week one, a customer pastes a multi-megabyte log, and the endpoint forwards it all. Truncated JSON becomes a 500 that a partner integration retries three times, and the SDK twice more. A mid-stream refusal leaves half a summary on screen. Finance spots the bill first; the only control was an alert. (Illustrative scenario.)

## Key concepts

### Gates before the call

OWASP's LLM Top 10 2026 (August 2026) names runaway usage LLM06:2026 Unbounded Consumption, including Denial of Wallet attacks, and warns: "Traditional request-rate limiting alone is no longer sufficient." After authentication, add four gates:

- **Input cap:** characters, then a pre-flight token count.
- **Output ceiling:** a fixed `max_tokens`, "a strict limit" in Anthropic's words, thinking tokens included, so worst-case cost is known upfront.
- **Quota:** tokens or dollars per day for each customer account (tenant).
- **Provider spend limit:** a backstop that fails calls, not just alerts.

```python
@app.post("/tickets/{ticket_id}/triage")
def triage(ticket_id: str, user=Depends(current_user)):
    if flags.is_on("triage_off"):              # kill switch
        return manual_queue(ticket_id)
    text = load_ticket(ticket_id)
    if len(text) > MAX_CHARS or count_tokens(text) > MAX_IN:
        raise HTTPException(413, f"Limit: {MAX_IN} tokens")
    if quota.used_today(user.tenant) >= DAILY_TOKENS:
        raise HTTPException(429, headers={"Retry-After": str(secs_to_reset())})
    return triage_ticket(text, max_tokens=400)
```

### Mapping outcomes to HTTP

Refusals and truncation arrive from the provider as 200s, and provider errors describe your server, not the caller (a provider 401 means your key is broken). Return your own outcome instead. One defensible convention:

| Outcome | Response |
|---|---|
| Input over the cap | 413, limit in body |
| Quota used up | 429, `Retry-After` |
| Provider overloaded or timed out | 503 with `Retry-After`, or 504 |
| Provider auth or spend-limit error | 500 or 503, plus an alert |
| Truncated, or invalid after the repair loop | 200 `needs_review`, or 502 |
| Refused | 200 `refused`, safe message |
| Fallback model answered | 200, `fallback_used: true` |

Include the request ID, and make non-transient outcomes non-retryable: 3 client × 3 repair-loop × 3 SDK attempts is up to 27 billed calls per click.

### Streaming vs one validated response

Streaming sends text as it is written, usually as server-sent events. After the first byte you are committed to a 200, so a late refusal or truncation must arrive as a final event, and the client must mark or remove the partial text. JSON cannot be validated until complete: stream prose people read, and return one validated response for fields code acts on.

### Kill switch and contract

A kill switch is a runtime flag, checked first, that routes to a fallback such as the manual queue without a redeploy (one needing a restart is too slow). Test it in staging. Document the contract too, for example in OpenAPI 3.2 (which can describe event streams): limits, outcome enum, status codes, retry rules, quotas and kill-switch behavior.

## Common misconceptions

- **"Requests-per-minute limits keep cost under control."** One request can carry a pasted log or a long reasoning run. Add token caps, an output ceiling and quotas.
- **"The model returned 200, so my endpoint returns 200."** Truncated, refused and invalid replies are 200s too. Check the stop reason and validate first.
- **"Invalid model output deserves a 422."** A 422 blames the caller. Bad model output is an upstream failure: 502, or 200 `needs_review`.

## Typical interview questions

<details>
<summary>What checks belong in front of the model call?</summary>

An input cap and pre-flight token count, a fixed `max_tokens`, a per-tenant quota, and a provider spend limit as backstop.

</details>

<details>
<summary>What is the difference between a spend alert and a spend limit?</summary>

An alert notifies while traffic flows. A limit stops requests; I treat that error as non-retryable and may trip the kill switch.

</details>

<details>
<summary>When would you stream a reply, and when return one validated response?</summary>

Stream prose people read, ending with an outcome event. Fields that code writes to the ticket get one validated JSON response.

</details>

<details>
<summary>The bill tripled overnight with no errors logged. What do you do?</summary>

Contain it with lower quotas or the kill switch, then break usage down by key and tenant to find loops, huge inputs or multiplying retries.

</details>

## Learn more

- Practice: [Build and deploy an Azure OpenAI (Flask) chatbot](https://learn.microsoft.com/en-us/azure/app-service/tutorial-ai-openai-chatbot-python) (Microsoft Learn, about 45 min)
- Reference: [LLM06:2026 Unbounded Consumption](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM06_UnboundedConsumption.md) (OWASP GenAI Security Project, about 8 min)

## Related

- [Frontend / Backend / Database Layers](../../m1/02-how-web-apps-run/10-frontend-backend-database-layers.md)
- [Status Codes](../../m1/02-how-web-apps-run/06-status-codes.md)
- [Sync vs. Async](../../m1/06-reliability-scale/01-sync-vs-async.md)
- [Programmatic LLM Interfaces (Inputs, Outputs, Errors, Retries, Logs)](./08-programmatic-llm-interfaces.md)
- [LLM APIs (Requests, Responses, Streaming, SDKs)](./03-llm-apis.md)
