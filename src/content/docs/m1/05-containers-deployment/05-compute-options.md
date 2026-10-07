---
title: Compute Options
row: M1-L5.2
---
**In one sentence:** A compute option is where and how your code actually runs in the cloud, and the main choices, serverless functions, virtual machines, and managed container services, trade off control, setup effort, and cost differently.

## What it is

Every app has to run on some computer somewhere. A cloud provider like Azure offers several ways to rent that computer, and they are not interchangeable. Some hand you a bare machine and expect you to manage everything. Others handle almost everything for you, in exchange for less control.

At one end is the **virtual machine**, a simulated computer you fully control: you choose the OS, install everything by hand, and keep it patched yourself. At the other end is **serverless**, where you hand over a function or container and the platform runs and scales it automatically, with no server for you to manage. In between sit **managed container services**, where you package your app as a container and the platform runs, restarts, and scales it without you touching the machine underneath.

None of these is universally better. A VM gives the most control and responsibility; serverless gives the least of both. The right choice depends on how much the team wants to manage, the traffic pattern, and how complex the app is.

## Why an FDE needs this

Clients often ask for the most powerful-sounding option, like a full Kubernetes cluster, for a small internal tool that gets ten requests a day. An FDE who understands the trade-offs can recommend something simpler, cheaper, and easier to maintain. The reverse also happens: a client runs a high-traffic service on a single small VM they manage by hand, and it falls over under load. Knowing the options lets an FDE make that call instead of defaulting to whatever sounds impressive.

## Key concepts

### The trade-off table

| Option | You manage | Scaling | Cost model | Good for |
|---|---|---|---|---|
| Serverless functions | Just your code | Automatic, to zero | Per execution | Small, occasional tasks |
| Virtual machines | OS and everything on it | Manual or scripted | Uptime, even idle | Full control, unusual setups |
| Managed container service | Your container image | Automatic, within limits | What is running | Most typical web apps and APIs |
| Container orchestration | Cluster config and images | Highly automatic, complex | The cluster's nodes | Many services at scale |

### Azure's version of each option

- **Azure Functions**, serverless. Write a function; Azure runs and scales it automatically. Good for small, occasional jobs, such as processing an uploaded file.
- **Azure Virtual Machines**, infrastructure as a service. A full virtual computer you configure and maintain. Good when an app needs something a managed platform will not support.
- **Azure App Service**, a managed platform for web apps. Give it your code or a container; it handles the server, scaling, and HTTPS.
- **Azure Container Apps**, serverless containers, built around automatic scaling including to zero.
- **Azure Kubernetes Service (AKS)**, full container orchestration. The most powerful and complex option, used when many services must be coordinated together.

### Using a decision tree instead of guessing

Azure publishes a compute decision tree that walks through questions, such as whether the app needs a full OS or is already containerized, and points toward a service. That beats picking an option because it sounds familiar.

## Common misconceptions

- **"Serverless means there are no servers."** Servers still run the code. The provider manages them, not you.
- **"Containers require Kubernetes."** A single container runs fine on a managed service like App Service. Kubernetes coordinates many containers together.
- **"Virtual machines are outdated."** VMs are still right when an app needs full control, or something a managed platform will not support.
- **"The most powerful option is always the safest choice."** Extra power usually means extra complexity and cost. A small tool on a Kubernetes cluster is often harder to maintain than on a simpler service.

## Typical interview questions

<details>
<summary>When would you pick Azure Functions over Azure App Service?</summary>

Functions fits small tasks that run occasionally, such as processing an uploaded file. App Service fits an app that runs continuously and serves regular traffic, like a web API.

</details>

<details>
<summary>What is the difference between Azure App Service and AKS?</summary>

App Service takes your code or container and manages the server underneath. AKS is a full orchestration platform where you manage a cluster and coordinate containers across it, at the cost of far more setup.

</details>

<details>
<summary>What does "scale to zero" mean, and which Azure options support it?</summary>

The platform stops running any instances when there is no traffic, so you pay nothing while idle. Azure Functions (on its consumption plans) and Container Apps support this; App Service and VMs generally keep at least one instance running.

</details>

<details>
<summary>A client wants to run a full operating system with custom software that only works on that OS. Which option fits?</summary>

A virtual machine, since it is the only option that gives full control over the operating system and everything installed on it.

</details>

<details>
<summary>How would you decide between a managed container service and a VM for a typical web API?</summary>

Start from how much control the app actually needs. If it just needs to run a container and get restarts, scaling, and HTTPS handled, a managed container service like App Service does that with far less ongoing maintenance than a VM the team has to patch and monitor by hand.

</details>

## Learn more

- Article: [Azure compute decision tree](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree) (Microsoft Learn).
- Article: [Azure App Service Python quickstart](https://learn.microsoft.com/en-us/azure/app-service/quickstart-python) (Microsoft Learn).

## Related

- [Images, Containers, Registries](./01-images-containers-registries.md)
- [Deployment Environments](./04-environments.md)
- [Deployment Logs](./08-deployment-logs.md)
