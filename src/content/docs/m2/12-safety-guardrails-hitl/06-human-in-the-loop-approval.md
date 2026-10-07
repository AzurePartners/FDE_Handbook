---
title: Human-in-the-Loop Approval
row: M2-L6.6
---
**In one sentence:** Human-in-the-loop approval is a checkpoint where your code pauses a specific, already permitted AI action until a person confirms it, reserved for actions that are costly or hard to undo.

## What it is

An assistant with tools can act: refund a charge, send an email, cancel a service. Human-in-the-loop approval makes some actions wait for a person's yes. (The phrase also describes people labeling training data; here it means run-time approval.)

A good contractor buys nails without asking but gets your signature before knocking down a wall. Asked about every nail, you would soon sign without looking, even for the wrong wall.

Precisely: the action gate decides whether this user may do this at all; approval decides which permitted actions still need a person. OpenAI's agent guide rates tools by write access, reversibility, permissions and financial impact, keeping high-risk ones under human oversight "until confidence in the agent's reliability grows."

## Why an FDE needs this

To look safe, an internet provider's support assistant sent every write action for approval. Within weeks, team leads faced about 400 requests a day, mostly $5 credits, each approved in two seconds from a card reading "Apply credit per customer request." One identical card, a $900 credit to an account the customer did not own, was approved like the rest.

The FDE rated every tool with the client, automated small credits with daily sampling, had the action gate block other people's accounts and rebuilt the card. The queue fell to about 30 a day, few enough to read. (Illustrative scenario.)

## Key concepts

### Rating actions by impact and reversibility

| Tier | Example | Default |
|---|---|---|
| Read-only query | Look up a bill | Automate, log |
| Reversible write | Add a note, small credit | Automate under a limit, monitor |
| Costly or permanent | Large refund, payment, deletion | Named approver first |
| Never automated | Change bank details | Assistant drafts, staff act |

Thresholds move a tool between tiers: a $15 credit runs alone, a $150 one waits, at limits the client sets. Major agent toolkits (OpenAI, Anthropic, Google, Microsoft, LangChain) ship this pause, most with rules that read the call's arguments.

### Enforcing approval in code

A prompt line like "ask before big refunds" is not a control: the model can misjudge or be manipulated by injected text. Code decides before any side effect, on every call, even inside a batch:

```python
def run_tool(call, user):
    gate.check(call, user)                # allowed at all?
    if needs_approval(call):              # rule on tool name and arguments
        rec = approvals.get(call.id)
        if rec is None:
            return approvals.request(call)    # pause, show the card
        if rec.decision != "approve" or rec.args != call.args:
            return rejected(call, rec)
    return tools.run(call, idempotency_key=call.id)
```

The idempotency key makes a double click harmless. The card shows the account holder, amount, the customer's words, the policy clause, recent credits and whether it can be undone. Log every decision (who, when, what, why) and expire unanswered requests as rejections.

### Approval fatigue

Anthropic reported in March 2026 that Claude Code users approve 93% of permission prompts, and warned of approval fatigue, "where people stop paying close attention to what they're approving." Ask less, and track approval rate and time-to-decide. A model approver is no substitute: Anthropic's auto-mode classifier missed 17% of real overeager actions.

### In the loop vs on the loop

In the loop, nothing happens until a person says yes. On the loop, the system acts while a person watches and can stop or undo it, like a driving instructor with a foot over the second brake. Anthropic found experienced Claude Code users auto-approve more but interrupt more. Use in-the-loop for rare, high-impact actions, on-the-loop for high-volume, reversible ones.

## Common misconceptions

- **"The safest design is a person approving every action."** People then approve out of habit. Save approvals for the few actions that matter.
- **"Once a human is in the loop, the system is safe."** People over-trust confident machine output (automation bias), and a vague card makes a rubber stamp.
- **"If a manager approves it, the action is allowed."** Approval never widens permissions or lifts a hard cap.
- **"A tool labeled read-only is always safe."** Labels like `readOnlyHint` are only hints, and some reads send data outside the company.

## Typical interview questions

<details>
<summary>What is human-in-the-loop approval, and when is it mandatory?</summary>

A person confirms a specific, already permitted action before code runs it. It is mandatory for costly or permanent actions like large refunds, payments and deletions; reads and cheap reversible writes run automatically, logged.

</details>

<details>
<summary>How does human-in-the-loop differ from human-on-the-loop?</summary>

In the loop, the action waits for a yes, which suits rare, high-impact actions. On the loop, the system acts while a person monitors and can intervene, which suits high-volume, reversible ones.

</details>

<details>
<summary>Approvers accept 99% of requests within three seconds. What do you do?</summary>

Treat it as fatigue or a threshold set too low. Automate low-value reversible actions with monitoring, show the exact action and evidence on the card, and track approval rate weekly.

</details>

<details>
<summary>An approved $50 refund ran as $500, and another ran twice. What went wrong?</summary>

The approval was not bound to the exact arguments, and execution was not idempotent. Run only the stored call whose arguments match the approval, with an idempotency key.

</details>

## Learn more

- Article: [Trustworthy agents in practice](https://www.anthropic.com/research/trustworthy-agents) (Anthropic, about 12 min)
- Article: [A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) (OpenAI, about 45 min)

## Related

- [Unauthorized Requests, Per-User Access and Action Gates](./05-action-gates.md)
- [Escalation Paths and Human Takeover](./08-escalation-and-human-takeover.md)
- [Read-Only Lookup Tools](../10-tool-calling-deterministic-logic/08-read-only-lookup-tools.md)
- [Human Evaluation](../11-ai-evaluation/06-human-evaluation.md)
- [Idempotency](../../m1/06-reliability-scale/05-idempotency.md)
