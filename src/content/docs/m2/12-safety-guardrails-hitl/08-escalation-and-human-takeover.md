---
title: Escalation Paths and Human Takeover
row: M2-L6.8
---
**In one sentence:** An escalation path is the designed route that hands a conversation from an AI assistant to the right person, triggered by code checks and carrying a summary, after which the assistant goes quiet.

## What it is

Some conversations an assistant should not finish alone: evidence is missing, the topic is sensitive, it keeps failing, or the user wants a person. Escalation moves the conversation to a human team. In a takeover, staff then own it and the assistant stops replying.

Think of a doctor's referral letter: who you are, what is wrong, what was tried. The specialist does not start from zero and you do not repeat your story.

Precisely, a path has four parts: triggers, routing, a handoff summary and takeover state. Beware the word "handoff": in the OpenAI Agents SDK it passes work to another AI agent, not a person.

## Why an FDE needs this

A university's student-support assistant drew three first-month complaints. A student asked for "a real person" three times and got handbook quotes each time, a "doom loop" in the US Consumer Financial Protection Bureau's phrase. A student citing a medical condition for extra exam time got the general extension policy; the disability office never heard. A fees dispute reached finance as "Student needs help with fees," so staff made the student explain again.

None of this needs a better model, just plumbing the FDE builds. (Illustrative scenario.)

## Key concepts

### Triggers your code can check

| Trigger | Signal your code sees |
|---|---|
| Insufficient evidence | Retrieval flags that sources cannot support an answer |
| Sensitive topic | A policy classifier matches, however sure the model sounds |
| Repeated failure | A counter hits, say, two failed attempts on one issue |
| User asks for a person | A "human" or "real person" detector; always wins |

Self-rated confidence is missing on purpose. Xiong et al. (ICLR 2024) found LLMs stating confidence in words "tend to be overconfident," and all methods struggled with specialist knowledge, exactly a client's domain. Thresholds and topic lists belong elsewhere (see Related).

### Routing and the handoff summary

Route on topic, urgency and language, and check staff availability before promising live help. A cold transfer makes the user explain again; a warm transfer sends context first:

```json
{
  "student_id": "S-20417",
  "queue": "finance",
  "trigger": "user_requested_human",
  "recap": "Disputes a late fee; says a payment plan was agreed.",
  "transcript_url": "https://support.example.edu/t/8812"
}
```

Code fills identity, queue and trigger from the session. Only the recap is model-written; it can hallucinate, so the transcript link lets staff check it.

### Takeover: one voice at a time

Give the conversation record an `owner` field and check it on every path that calls the model:

```python
def handle_message(conv, text):
    conv.save_user_message(text)
    if conv.owner != "assistant":     # "waiting" or "human"
        notify_staff(conv)            # assistant stays silent
        return
    trigger = check_triggers(conv, text)
    if trigger:
        escalate(conv, trigger)       # sets owner = "waiting"
    else:
        reply_with_model(conv)
```

Google's handoff docs describe the virtual agent becoming "silent" as a human joins; it may still draft private notes for staff. Tell the user who is joining, the likely wait and the after-hours option (a ticket and email reply).

### Escalation logs close the loop

Log each escalation's reason code, topic, team and outcome, and review weekly with the client. Topic clusters are knowledge gaps for content owners; cases staff mark "not needed" tune triggers. Anthropic's support guide measures "escalation efficiency" (correct escalations versus missed ones) and suggests aiming for 95% or higher.

## Common misconceptions

- **"Just ask the model how confident it is and escalate below 70%."** Stated confidence is poorly calibrated. Trigger on signals your code can observe.
- **"A lower escalation rate means a better assistant."** It can hide missed escalations: users who needed a person but stayed with the bot.
- **"If the bot is good enough, offering a human is optional."** In a 2024 Gartner survey, 60% of customers worried AI would make reaching a person harder, and Spain's Law 10/2025 requires covered companies to offer a human operator.

## Typical interview questions

<details>
<summary>What is an escalation path, and what usually triggers one?</summary>

A designed route from the assistant to the right human team, with context. Common triggers: insufficient evidence, a sensitive topic, repeated failure and a request for a person, all checked in code rather than by the model's judgment.

</details>

<details>
<summary>How does escalation differ from refusal and from human-in-the-loop approval?</summary>

A refusal ends one request with a reason and next step, and no person joins. Approval pauses one action, like a large refund, until a person confirms, then the assistant continues. Escalation hands the whole conversation to a person.

</details>

<details>
<summary>How would you design a handoff so staff do not start from zero?</summary>

Route by topic, urgency and language after checking availability. Attach code-filled fields (user ID, trigger), a short model recap and a transcript link. On acceptance, an owner flag silences the assistant and the user hears the likely wait.

</details>

<details>
<summary>During takeover, users see bot replies mixed with the staff member's. What went wrong?</summary>

Some path, like a retry, a webhook or a second worker, calls the model without checking takeover state. Keep one owner field per conversation, check it before every user-facing reply, and add a test that sends messages during takeover.

</details>

## Learn more

- Reference: [Customer support agent (use-case guide)](https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat) (Anthropic, about 35 min)
- Reference: [Configure Azure agents to escalate and end conversations](https://learn.microsoft.com/en-us/dynamics365/customer-service/develop/bot-escalate-end-conversation) (Microsoft Learn, about 10 min)

## Related

- [Knowledge Gaps and Insufficient Evidence](../09-rag-knowledge-bases/08-knowledge-gaps.md)
- [Content Boundaries and Sensitive Requests](./02-content-boundaries.md)
- [Human-in-the-Loop Approval](./06-human-in-the-loop-approval.md)
- [Refusals and Fallbacks](./07-refusals-and-fallbacks.md)
