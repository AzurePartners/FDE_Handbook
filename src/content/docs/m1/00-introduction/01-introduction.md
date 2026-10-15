---
title: Introduction
---
**In one sentence:** This handbook lists the software systems knowledge a Forward Deployed Engineer (FDE) is expected to have, one topic per page, so you can see the whole map, study what you are missing, and review everything before an interview.

## Where Module 1 fits

[Module 0](../../m0/00-introduction/01-introduction.md) explains the role and is read first. Module 1 is the first of the technical modules. Customer environments are messy. Data sits in old databases, APIs time out, permissions block access, and the demo that worked on a laptop fails on the customer's server. You cannot fix what you cannot picture. Module 1 gives you the picture: how a request moves through a system, how systems exchange data, how code is tracked and tested, how it gets deployed, and what breaks under real use. With that picture, AI coding tools become far more useful, because you can tell the AI what to build and check whether it built the right thing.

## How to use this handbook

This is a reference, not a course. There is no schedule and no project. Open any page and start reading. The left sidebar is the roadmap: each lesson is one area, and each page is one knowledge point.

**If you are new to software ("see the map").** Read the sidebar and note what you have never heard of. On each page, read the **In one sentence** line and **Why an FDE needs this**. That takes about two minutes per page. Then go deeper on the topics that matter for the work you want.

**If you are preparing for an interview ("run through everything").** Read the pages in order; each lesson builds on the ones before it. Read **Common misconceptions**, then answer each **Typical interview question** out loud before you open the model answer.

Page length follows the concept. A small idea like port mapping gets a short page. A broad one like status codes gets a longer page with a table. Unfamiliar terms are collected in the [Glossary](../07-glossary/01-glossary.md).

## The lessons

| Lesson | What it covers |
|---|---|
| 1. AI-assisted development | Working with AI coding tools, reading code, and checking what the AI wrote |
| 2. How web apps run | Clients and servers, HTTP, sessions, HTTPS, and one request's full path |
| 3. APIs, data and integration | Calling other systems, auth, failures, data formats, SQL, and data contracts |
| 4. Git, debugging, testing and security | A history you can undo, finding bugs, testing, and staying safe |
| 5. Containers and deployment | Docker, environments, compute choices, configuration, and deploying |
| 6. Reliability and scale | What breaks when a demo meets real users: queues, retries, duplicates, caching, load |

This first version is text only. Videos, quizzes, demos, and labs will be added to these pages later.

## Related

- [AI Coding Workflow](../01-ai-assisted-development/01-ai-coding-workflow.md)
- [Client-Server Model](../02-how-web-apps-run/01-client-server-model.md)
