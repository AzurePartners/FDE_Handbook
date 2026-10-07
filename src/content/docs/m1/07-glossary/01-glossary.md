---
title: Glossary
---
**In one sentence:** Short definitions of the terms used across Module 1, each linked to the page that explains it.

## A to C

- **API (Application Programming Interface):** A defined way for one program to ask another for data or actions. See [REST Conventions](../03-apis-data-integration/01-rest-conventions.md).
- **API key:** A secret string a client sends to prove which account is calling an API. See [API Authentication](../03-apis-data-integration/02-auth.md).
- **Async (asynchronous):** Work that runs in the background so the caller does not wait for it to finish. See [Sync vs. Async](../06-reliability-scale/01-sync-vs-async.md).
- **Authentication vs. authorization:** Authentication checks who you are; authorization checks what you are allowed to do. See [API Authentication](../03-apis-data-integration/02-auth.md).
- **Backoff:** Waiting longer between each retry so a struggling service can recover. See [Retries and Backoff](../06-reliability-scale/03-retries-and-backoff.md).
- **Bearer token:** A token sent in the `Authorization` header; whoever holds it is treated as the logged-in caller. See [API Authentication](../03-apis-data-integration/02-auth.md).
- **Branch:** A separate line of work in Git that can be merged back later. See [Branches and Merging](../04-git-debugging-testing-security/02-branches-and-merging.md).
- **Cache:** A fast copy of data kept closer to where it is needed, so it does not have to be fetched or computed again. See [Caching](../06-reliability-scale/08-caching.md).
- **Certificate (TLS):** A file that proves a server owns a domain, issued by a certificate authority. See [HTTPS, Domains and Certificates](../05-containers-deployment/07-domains-and-certificates.md).
- **CLI (Command-Line Interface):** A tool you use by typing commands in a terminal. See [AI Coding Tools](../01-ai-assisted-development/02-tool-forms.md).
- **Client / server:** The client asks for something; the server answers. See [Client-Server Model](../02-how-web-apps-run/01-client-server-model.md).
- **Commit:** A saved snapshot of changes in Git, with a message explaining why. See [Git Mental Model](../04-git-debugging-testing-security/01-git-mental-model.md).
- **Connection pool:** A set of open database connections that requests reuse instead of opening new ones. See [Connection Limits and Pooling](../06-reliability-scale/07-connection-limits-and-pooling.md).
- **Container:** A running, isolated copy of an image, with its own filesystem and processes. See [Images, Containers, Registries](../05-containers-deployment/01-images-containers-registries.md).
- **Context window:** The text an AI model can see at one time; anything outside it, the model does not know. See [Context Management](../01-ai-assisted-development/05-context-management.md).
- **Cookie:** A small piece of data the server asks the browser to store and send back with later requests. See [API Authentication](../03-apis-data-integration/02-auth.md).
- **CSV:** A plain-text table format where each line is a row and commas separate columns. See [CSV and Tables](../03-apis-data-integration/08-csv-and-tables.md).

## D to H

- **Data contract:** An agreement between systems about field names, types, units, and meaning. See [Schema and Data Contracts](../03-apis-data-integration/10-schema-and-data-contracts.md).
- **Dependency:** Outside code your project uses, such as a Python package. See [Dependency Risk](../04-git-debugging-testing-security/12-dependency-risk.md).
- **Diff:** The line-by-line difference between two versions of code. See [Diff and Revert](../04-git-debugging-testing-security/03-diff-and-revert.md).
- **DNS (Domain Name System):** The system that turns a name like `example.com` into an IP address. See [HTTPS, Domains and Certificates](../05-containers-deployment/07-domains-and-certificates.md).
- **Docker:** The most common tool for building images and running containers. See [Images, Containers, Registries](../05-containers-deployment/01-images-containers-registries.md).
- **Edge case:** An unusual but valid input at the boundary of what the code expects, such as a name with accents. Input that should be rejected, such as an empty required field, is a failure case. See [Test Case Types](../04-git-debugging-testing-security/07-three-kinds-of-test-case.md).
- **Environment (local, staging, production):** Separate copies of a system for building, testing, and real use. See [Deployment Environments](../05-containers-deployment/04-environments.md).
- **Environment variable:** A setting passed to a program from outside its code, often used for config and secrets. See [Configuration](../05-containers-deployment/06-config-and-env-vars.md).
- **Foreign key:** A column that points to the primary key of a row in another table. See [Relational Model](../03-apis-data-integration/09-relational-model.md).
- **Frontend / backend:** The frontend runs in the user's browser; the backend runs on a server. See [Web App Layers](../02-how-web-apps-run/10-frontend-backend-database-layers.md).
- **Horizontal scaling:** Handling more load by adding more servers instead of a bigger one. See [Load Balancing and Horizontal Scaling](../06-reliability-scale/09-load-balancing-and-horizontal-scaling.md).
- **HTTP:** The protocol browsers and servers use to send requests and responses. See [HTTP Requests and Responses](../02-how-web-apps-run/04-http-request-response.md).
- **HTTP method:** The verb of a request, such as GET, POST, PUT, PATCH, or DELETE. See [HTTP Methods](../02-how-web-apps-run/05-http-methods.md).
- **HTTPS:** HTTP sent over an encrypted TLS connection. See [HTTPS, Domains and Certificates](../05-containers-deployment/07-domains-and-certificates.md).

## I to P

- **Idempotency:** Doing the same operation twice has the same effect as doing it once. See [Idempotency](../06-reliability-scale/05-idempotency.md).
- **IDE (Integrated Development Environment):** An editor with built-in tools for writing, running, and debugging code, such as VS Code. See [AI Coding Tools](../01-ai-assisted-development/02-tool-forms.md).
- **Image:** A packaged, read-only template of an app and everything it needs to run. See [Images, Containers, Registries](../05-containers-deployment/01-images-containers-registries.md).
- **Input validation:** Checking that incoming data has the expected shape and values before using it. See [Input Validation](../04-git-debugging-testing-security/10-input-validation.md).
- **Integration test:** A test that checks several parts working together, such as code plus a database. See [Unit vs. Integration Tests](../04-git-debugging-testing-security/08-unit-vs-integration-tests.md).
- **IP address:** The numeric address of a machine on a network. See [IP Addresses and Ports](../02-how-web-apps-run/02-dns-ip-ports.md).
- **JOIN:** A SQL operation that combines rows from two tables using a shared key. See [SQL Basics](../03-apis-data-integration/11-sql-basics.md).
- **JSON:** A text format for structured data made of objects, arrays, strings, numbers, booleans, and null. See [JSON](../02-how-web-apps-run/07-json.md).
- **JWT (JSON Web Token):** A signed token that carries claims about a user, often used instead of a session cookie. See [API Authentication](../03-apis-data-integration/02-auth.md).
- **Least privilege:** Giving each person or program only the access it needs, and nothing more. See [Least Privilege](../04-git-debugging-testing-security/11-least-privilege.md).
- **Load balancer:** A component that spreads incoming requests across several servers. See [Load Balancing and Horizontal Scaling](../06-reliability-scale/09-load-balancing-and-horizontal-scaling.md).
- **Log:** A timestamped record of what a program did, used to find out what went wrong. See [Logs and Stack Traces](../04-git-debugging-testing-security/05-logs-and-stack-traces.md) and [Deployment Logs](../05-containers-deployment/08-deployment-logs.md).
- **Merge conflict:** When two branches change the same lines and Git needs a person to choose. See [Branches and Merging](../04-git-debugging-testing-security/02-branches-and-merging.md).
- **Mock:** A fake stand-in for a real dependency, used in tests. See [Unit vs. Integration Tests](../04-git-debugging-testing-security/08-unit-vs-integration-tests.md).
- **Normalization:** Structuring a database so each fact is stored once; also, converting data from several sources into one format. See [Data Normalization](../03-apis-data-integration/12-data-normalization.md).
- **OAuth:** A standard that lets a user grant an app limited access to their account without sharing a password. See [API Authentication](../03-apis-data-integration/02-auth.md).
- **Polling:** Asking another system for updates on a schedule. See [Webhook vs. Polling](../03-apis-data-integration/05-webhook-vs-polling.md).
- **Port:** A number that identifies which program on a machine should receive network traffic. See [IP Addresses and Ports](../02-how-web-apps-run/02-dns-ip-ports.md).
- **Port mapping:** Connecting a port on the host machine to a port inside a container, as in `-p 8000:80`. See [Port Mapping](../05-containers-deployment/03-port-mapping.md).
- **Primary key:** A column whose value uniquely identifies each row in a table. See [Relational Model](../03-apis-data-integration/09-relational-model.md).
- **Process:** A running program; a service is a process that keeps running and waits for requests. See [Processes and Services](../02-how-web-apps-run/03-processes-and-services.md).
- **Pull request (PR):** A proposal to merge a branch, where others review the changes first. See [Pull Request Workflow](../04-git-debugging-testing-security/04-pull-request-workflow.md).

## Q to Z

- **Queue:** A list of jobs waiting to be processed by workers. See [Queues and Workers](../06-reliability-scale/02-queues-and-workers.md).
- **Race condition:** A bug where the result depends on which of two simultaneous actions finishes first. See [Race Conditions](../06-reliability-scale/06-race-conditions.md).
- **Rate limit:** A cap on how many requests a client may send in a time window, usually answered with `429`. See [Rate Limits](../03-apis-data-integration/04-rate-limits.md).
- **Registry:** A place that stores and serves container images, such as Docker Hub or Azure Container Registry. See [Images, Containers, Registries](../05-containers-deployment/01-images-containers-registries.md).
- **REST:** A common style for web APIs built around resources, URLs, and HTTP methods. See [REST Conventions](../03-apis-data-integration/01-rest-conventions.md).
- **Retry:** Trying a failed operation again, ideally with backoff and only for errors that may be temporary. See [Retries and Backoff](../06-reliability-scale/03-retries-and-backoff.md).
- **Revert:** Undoing a commit by adding a new commit that reverses it. See [Diff and Revert](../04-git-debugging-testing-security/03-diff-and-revert.md).
- **Schema:** The defined structure of data: fields, types, and rules. See [Schema and Data Contracts](../03-apis-data-integration/10-schema-and-data-contracts.md).
- **Secret:** A password, key, or token that grants access and must never be committed to code. See [Secrets Management](../04-git-debugging-testing-security/09-secrets-management.md).
- **Serverless:** Running code without managing servers; the platform starts it on demand. See [Compute Options](../05-containers-deployment/05-compute-options.md).
- **Session:** How a server remembers a user across requests, using a cookie or a token. See [API Authentication](../03-apis-data-integration/02-auth.md).
- **SQL:** The language used to query and change data in relational databases. See [SQL Basics](../03-apis-data-integration/11-sql-basics.md).
- **Stack trace:** The list of function calls that were running when an error happened. See [Logs and Stack Traces](../04-git-debugging-testing-security/05-logs-and-stack-traces.md).
- **Staging area:** The Git area where you collect changes before committing them. See [Git Mental Model](../04-git-debugging-testing-security/01-git-mental-model.md).
- **Stateless:** A server that keeps nothing between requests; each request carries what it needs. See [API Authentication](../03-apis-data-integration/02-auth.md).
- **Status code:** The three-digit number in an HTTP response that says how the request went. See [Status Codes](../02-how-web-apps-run/06-status-codes.md).
- **Timeout:** The longest a program will wait for a response before giving up. See [Timeouts](../06-reliability-scale/04-timeouts.md).
- **TLS:** The encryption protocol behind HTTPS. See [HTTPS, Domains and Certificates](../05-containers-deployment/07-domains-and-certificates.md).
- **Unit test:** A test that checks one small piece of code in isolation. See [Unit vs. Integration Tests](../04-git-debugging-testing-security/08-unit-vs-integration-tests.md).
- **VM (Virtual Machine):** A software-emulated computer with its own operating system, often rented from a cloud provider. See [Compute Options](../05-containers-deployment/05-compute-options.md).
- **Volume:** Storage attached to a container that survives when the container is removed or replaced. See [Volumes and Persistence](../05-containers-deployment/02-volumes-and-persistence.md).
- **Webhook:** An HTTP call another system makes to you when something happens. See [Webhook vs. Polling](../03-apis-data-integration/05-webhook-vs-polling.md).
- **Worker:** A process that takes jobs from a queue and runs them. See [Queues and Workers](../06-reliability-scale/02-queues-and-workers.md).
- **Working tree:** The files in your project folder as they are right now, including changes not yet staged. See [Git Mental Model](../04-git-debugging-testing-security/01-git-mental-model.md).
