---
title: Volumes and Persistence
row: M1-L5.1
---
**In one sentence:** A container's own filesystem disappears whenever the container is replaced, so anything that needs to survive, such as a database or an uploaded file, has to live in a separate place.

## What it is

Picture a small app storing its search history in a SQLite file inside the container's own filesystem. Locally this feels fine: the file stays put as long as the app keeps running. But cloud platforms usually "restart" an app by starting a new container. Every time the platform replaces the container (redeploys, scaling, host maintenance), anything written to the old container's own disk is gone. The history is gone, not because anything broke, but because the app trusted the wrong place to hold it.

This is the idea behind **stateless processes**, from the Twelve-Factor App, a widely referenced set of cloud software practices. A process should be treated as if it could be stopped and restarted at any moment, and nothing it needs should live only inside it. Anything that must persist belongs in a **backing service**: a database, a file storage service, a cache, or another resource the app connects to over the network.

A **volume** is a folder outside the container, attached to it, so files written there survive a restart on the same machine. It helps locally, but in the cloud it is usually not enough, since platforms often replace containers on different hosts. The fix is a managed backing service, such as a cloud database, independent of any one container.

## Why an FDE needs this

This is a surprising failure a new FDE runs into: a demo works, gets deployed, and a routine restart quietly wipes data everyone assumed was safe. Understanding why it happens is the difference between panicking over "lost data" and calmly explaining that the fix is a backing service. A client complaint about "lost data" is often really about where state is stored.

## Key concepts

### Stateless processes

A process is stateless when it does not rely on anything saved to its own local disk to work correctly next time it runs. It can be stopped, replaced, or scaled to multiple copies without changing its behavior.

### Backing services

A backing service is any resource an app talks to over a network: a database, a cache, a file storage bucket, or an outside API. The Twelve-Factor App treats these as attached resources, swappable without changing the app's code, for example pointing the app at a different database by changing a connection string.

## Common misconceptions

- **"A Docker volume solves this the same way a managed database would."** A volume keeps a local folder from being wiped during local development, but in most cloud platforms it does not reliably survive redeploys or scaling.
- **"If the app restarted, something must be broken."** Restarts happen routinely. The problem is only when the app assumed local state would survive one.
- **"Stateless means the app cannot have any data."** The process itself should not be the only place data lives; the data belongs in a backing service.

## Typical interview questions

<details>
<summary>Why does a container's local data disappear on restart?</summary>

A new container starts from a clean copy of its image, and cloud platforms routinely replace containers. Anything written to its own filesystem lives only in that container's writable layer, discarded when the container is removed, unless it was written to a volume or an outside service.

</details>

<details>
<summary>What is a backing service, and give an example.</summary>

A resource an app connects to over the network, swappable rather than built into the app. A managed database is one; so is a file storage bucket or an external API.

</details>

<details>
<summary>An app stores data in a SQLite file inside its own container and loses it on every deploy. What would you recommend?</summary>

Move the data into a backing service designed to persist it, such as a managed database. The app process should stay replaceable, so nothing important should depend on surviving inside the container.

</details>

## Learn more

- Article: [The Twelve-Factor App](https://12factor.net/) (12factor.net, see the sections on processes and backing services).
- Article: [Tutorial: Deploy a Python (FastAPI) web app with PostgreSQL in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/tutorial-python-postgresql-app-fastapi) (Microsoft Learn).

## Related

- [Images, Containers, Registries](./01-images-containers-registries.md)
- [Configuration](./06-config-and-env-vars.md)
- [Relational Model](../03-apis-data-integration/09-relational-model.md)
