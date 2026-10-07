---
title: Logs, Metrics, Traces, Health Checks & Alerts
row: M4-L5.2
---
**In one sentence:** Observability is answering "what is the system doing right now, and is it healthy?" from the outside, through logs (events), metrics (numbers over time), traces (one request's path), health checks (is it up?), and alerts (tell me when something's wrong).

## What it is

The signals that make a running system legible (Module 1 covers deployment **logs** as a basic, [Deployment Logs](../../m1/05-containers-deployment/08-deployment-logs.md); this page adds metrics, traces, health checks, alerts, and AI-specific signals):

- **Logs:** timestamped records of events ("request received," "model call failed").
- **Metrics:** aggregated numbers over time (requests/sec, error rate, p95 latency; for AI: tokens, cost, quality).
- **Traces:** the path of a single request across steps/services, showing where time and failures happen.
- **Health checks:** a simple endpoint reporting whether the service is alive and its dependencies reachable.
- **Alerts:** automated notifications when a metric crosses a threshold, so you learn of problems before users report them.

For AI systems, add signals like tokens, cost, model/prompt version, and quality indicators.

## Why an FDE needs this

When a feature misbehaves in production, "it gave a weird answer yesterday" is unactionable without observability. Logging (redacted), tracing, and metrics are what let you reproduce and fix it, and alerts are how you catch problems proactively. An FDE who instruments from the start can operate and debug the system; one who didn't is guessing in the dark.

## Key concepts

| Signal | Answers |
| --- | --- |
| Logs | What happened? |
| Metrics | Is it healthy over time? |
| Traces | Where did time go / where did it fail? |
| Health checks | Is it up right now? |
| Alerts | Notify me when something breaks |

- **Correlation IDs:** tie a request's logs/traces together.
- **Redact PII/secrets:** never log sensitive data.

## Common misconceptions

- **"Logs are enough."** Logs give events; you also need metrics for trends, traces for paths, and alerts to be told proactively.
- **"Instrument later if there's a problem."** You can't debug an incident you didn't instrument; add it up front.
- **"Log everything, including the full prompt/PII."** Redact sensitive data; log what you need to debug, safely.

## Typical interview questions

<details>
<summary>What do logs, metrics, and traces each tell you?</summary>

Logs record discrete events (what happened). Metrics aggregate numbers over time (is it healthy and trending). Traces follow one request across services (where time went and where it failed). Together with health checks (is it up) and alerts (notify on threshold breaches), they answer "what's the system doing now, and is it healthy?"

</details>

<details>
<summary>A customer reports a bad output from yesterday. What must you have captured to investigate?</summary>

The request with a correlation ID, the redacted prompt and retrieved context, the model and prompt version, the output, and the latency/token metrics, so I can reproduce the exact conditions. Without those logged at the time, I'm guessing.

</details>

## Learn more

- Article: [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) (Google SRE; the four golden signals)
- Docs: [OpenTelemetry observability primer](https://opentelemetry.io/docs/concepts/observability-primer/) (logs, metrics, traces)

## Related

- [Module 1 → Deployment Logs](../../m1/05-containers-deployment/08-deployment-logs.md) (logging basics)
- [Version Records & Reproducing Incident State](./03-version-records-model-prompt-data-tools-and-config.md)
- [Build, Test, Deploy & Rollback](./01-build-test-deploy-and-rollback-ci-cd-basics.md)
