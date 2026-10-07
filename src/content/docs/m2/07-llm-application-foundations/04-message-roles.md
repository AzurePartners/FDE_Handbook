---
title: Message Roles, System Prompts and Conversation History
row: M2-L1.4
---
**In one sentence:** An LLM request is an ordered list of messages tagged by who wrote them, and because the model remembers nothing between calls, your app resends the conversation every turn.

## What it is

A model call is a list of messages, each tagged with a role. The system prompt holds the operator's standing instructions (the operator is whoever builds the app). User messages are the end user's turns plus data the app attaches. Assistant messages are what the model said earlier.

Think of a temp worker with no memory: every shift you hand over the case file, standing orders on top, and pay them to reread it all.

The model is stateless. In Anthropic's words, "The Messages API is stateless, which means that you always send the full conversational history to the API." A chat seems to remember only because the app appends each turn to a list and resends it.

## Why an FDE needs this

A regional insurer's claims assistant let the browser post the full `messages` array, system prompt included, to a backend on three containers. An adjuster edited the prompt in DevTools to allow "payouts of any size," and the bot drafted an approval letter. A later fix kept history in container memory, so the bot "forgot" claim numbers whenever a request hit another container or a deploy restarted.

The FDE moved the system prompt into server config, history into Postgres keyed by conversation ID, and the payout limit into code.

## Key concepts

### Roles across providers

| Job | Anthropic | OpenAI | Gemini |
|---|---|---|---|
| Operator instructions | Top-level `system` field | `developer` message (`system` still accepted) or Responses `instructions` | `system_instruction` |
| Model's earlier turns | `assistant` | `assistant` | `model` |
| Tool results | `tool_result` block in a `user` message | `tool` role, or Responses `function_call_output` | A function response part |

Anthropic's newest models also accept a mid-conversation system message.

### Priority is trained, not guaranteed

Models are trained to favor operator instructions: Anthropic says "system instructions take precedence" over conflicting user turns. Microsoft warns, "System messages don't guarantee the model follows every rule," and the 2025 "Control Illusion" study found the split unreliable across six models. Enforce hard limits in code; keep secrets out of prompts.

### "Context" is not a third role

Documents, retrieved passages and tool results are data, sent as labeled user-role content (document, image or `tool_result` blocks on Anthropic) or in a tool role. Anthropic advises keeping "untrusted content inside tool_result blocks rather than system prompts or plain user text blocks." The model cannot tell whether assistant turns are really its own, so whoever edits the history can forge them. The server, not the browser, must own the prompt and history.

### The app is the memory

```python
def chat(conversation_id, user_text):
    history = db.load(conversation_id)  # database, not process memory
    history.append({"role": "user", "content": user_text})
    reply = client.messages.create(
        model=os.environ["LLM_MODEL"], max_tokens=1024,
        system=SYSTEM_PROMPT,  # server config, never the browser
        messages=history,
    )
    history.append({"role": "assistant", "content": reply.content})
    db.save(conversation_id, history)
    return reply
```

Save every content block, not just text, so tool-use and thinking blocks survive; some of the newest models reject edited history.

With a 1,000-token system prompt, 100-token user turns and 300-token replies, turn 20 sends 8,700 input tokens, so later turns cost more and start slower; the whole chat totals about 98,000. Prompt caching cuts the price of a repeated prefix, not its window use. Provider-stored state (OpenAI `previous_response_id`, Gemini `previous_interaction_id`) saves resending, not processing; OpenAI still bills the chain as input.

## Common misconceptions

- **"The model remembers earlier turns."** The app resends them. Consumer "memory" features just add stored notes to the context; the model never changes.
- **"The system prompt is a safe place for security limits."** It raises priority without guaranteeing compliance, and it can leak.
- **"Documents belong in the system prompt so the model takes them seriously."** That grants untrusted text operator authority and breaks caching; send them as user content.
- **"Provider-stored conversations make long chats cheap."** The full history is still processed every turn, and OpenAI bills it as input.

## Typical interview questions

<details>
<summary>What is a system prompt, and how is it different from a user message?</summary>

It is the operator's standing instruction for the whole conversation, set by the application in its own field. A user message is the end user's turn plus attached data. Models are trained to favor the system prompt when they conflict.

</details>

<details>
<summary>Where do tool results go in Anthropic's API versus OpenAI Chat Completions?</summary>

Anthropic uses `tool_result` blocks in a `user` message, matched by `tool_use_id`. Chat Completions uses a `tool` role message with a `tool_call_id`. Adapters must map between them.

</details>

<details>
<summary>Your assistant runs on three load-balanced containers. Where does history live?</summary>

In a database keyed by conversation ID; the browser sends only that ID and the new message. Process memory breaks across containers and restarts, and a browser-built `messages` array lets users rewrite the system prompt.

</details>

<details>
<summary>A user says the bot forgot the order number from two messages ago. How do you debug it?</summary>

I check whether the earlier message is in the logged `messages`. Likely causes: a reply never appended, per-container history, a restart, trimming or the wrong conversation ID. If it is there but ignored, that is a context-quality problem, not a state bug.

</details>

## Learn more

- Reference: [Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages) (Anthropic, about 10 min)
- Reference: [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state) (OpenAI, about 15 min)

## Related

- [LLM APIs (Requests, Responses, Streaming, SDKs)](./03-llm-apis.md)
- [Tokens and Context Windows](./02-tokens-and-context-windows.md)
- [Prompt Structure](../08-prompting-context-structured-output/01-prompt-structure.md)
- [Context Engineering](../08-prompting-context-structured-output/04-context-engineering.md)
- [Volumes and Persistence](../../m1/05-containers-deployment/02-volumes-and-persistence.md)
