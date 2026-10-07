---
title: Images, Containers, Registries
row: M1-L5.1
---
**In one sentence:** Docker packages an app with the exact language version, libraries, and OS files it needs into a single unit, so that unit runs the same way on any machine.

## What it is

A developer builds an app on their laptop with Python 3.12 and a specific set of libraries. They hand it to a client whose server runs Python 3.9 and is missing one library. The app breaks, not because the code is wrong, but because the two machines differ. This is the "it works on my machine" problem.

Two words matter here. An **image** is the frozen version of the app saved to disk: code, dependencies, and startup instructions. A **container** is a running instance of an image, the way a running program is an instance of a saved file. One image can produce many containers.

Containers are not virtual machines. A VM simulates a whole computer, including its own kernel, which makes it heavy and slow to start. A container shares the host's kernel and packages only the application layer, so it starts in under a second.

A **registry** stores and shares images, the way GitHub stores code. Docker Hub is the common public registry; cloud providers run their own, such as Azure Container Registry. A team builds an image once, pushes it, and pulls it wherever it runs.

## Why an FDE needs this

An FDE often builds something locally, then has to run it inside a client's infrastructure they do not fully control. When a client says "it worked in the demo but fails on our server," the first question is whether the two environments actually match. A container removes that variable: the same container runs the same way on both, and pushing the built image to a registry guarantees the client runs the exact thing that was tested.

## Key concepts

### The Dockerfile

A Dockerfile is a text file of step-by-step build instructions. Nobody needs to memorize its syntax. Example for a Python FastAPI app:

```dockerfile
# Base image.
FROM python:3.12-slim
# Working directory.
WORKDIR /app
# Install deps first, so this step is reused when only code changes.
COPY requirements.txt .
RUN pip install -r requirements.txt
# Copy the rest of the code in.
COPY . .
# Document the listening port.
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

`docker build` turns a Dockerfile into an image. `docker run` starts a container from that image.

### Images vs. containers

| | Image | Container |
|---|---|---|
| What it is | A saved template on disk | A running instance of an image |
| How many | One | Many, from the same image |
| Changes at runtime | Never | Yes, until it is removed |

### Registries and Docker Compose

A registry is where a built image lives so other machines can pull it. Real apps often need more than one container, such as a web app and a database. Docker Compose describes several containers in one file and starts them together with `docker compose up`.

## Common misconceptions

- **"A container is a lightweight virtual machine."** A container shares the host's kernel; a VM runs its own full kernel, so containers start faster and use fewer resources.
- **"An image and a container are the same thing."** An image is the saved template on disk. A container is a running instance of it.
- **"You need to memorize Dockerfile syntax."** Reading and reviewing one is enough for most engineering work.

## Typical interview questions

<details>
<summary>What is the difference between an image and a container?</summary>

An image is a saved, frozen package of an app on disk. A container is a running instance created from an image, and multiple containers can run from the same image at once.

</details>

<details>
<summary>Why use Docker instead of writing setup instructions in a README?</summary>

Instructions can be skipped, run out of order, or applied to a slightly different base system, producing mismatched environments. An image packages the exact environment instead.

</details>

<details>
<summary>Why push an image to a registry instead of sharing the Dockerfile?</summary>

Sharing only a Dockerfile means every environment rebuilds the image, which can drift over time. Pushing the built image guarantees everyone runs the exact same thing.

</details>

## Learn more

- Video: [Docker in 100 Seconds](https://www.youtube.com/watch?v=Gjnup-PuquQ) (Fireship, 2 min).
- Article: [Docker Get Started](https://docs.docker.com/get-started/) (Docker, 2 to 3 hours).
- Article: [Docker for Beginners: images, containers, ports, and volumes explained](https://dev.to/chetancodelrca/docker-for-beginners-images-containers-ports-and-volumes-explained-ee6) (DEV).
- Practice: [Docker playground](https://labs.iximiuz.com/playgrounds/docker) (iximiuz Labs, browser-based).

## Related

- [Port Mapping](./03-port-mapping.md)
- [Volumes and Persistence](./02-volumes-and-persistence.md)
- [Deployment Environments](./04-environments.md)
- [Compute Options](./05-compute-options.md)
