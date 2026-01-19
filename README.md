# deeporigin-takehome

# 3 min Video Overview

[Video Overview](https://youtu.be/VM_WmccURIc) demos the app and shows how to set up and run locally as well.

# Visit the Preview App on Vercel

You'll need to login to vercel in order to see the app (this is not app login, just vercel allowing u to access the preview)

[vercel preview app](https://deeporigin-takehome-ah20wyoyf-tommy-sullivans-projects.vercel.app/)

NOTE: I didn't add a production app because that would require more effort in order to get the clerk integration for OAuth to work and clerk production mode doesn't support vercel.app domains. I could set it up if need be

NOTE: You will need to use the app level login to get access to signed in features of the URL shortener

# Local Development

Recommend to use VS Code with DevContainers for the easiest setup. There is an alternative manual setup section below if you prefer that. See below for details.

## Set up .env.local

Regardless whether you use devcontainer or not, you must first set up `.env.local` with secrets (request those by emailing tommy@tommysullivan.codes)

- Copy `.env.local.template` to `.env.local` since the secrets are not committed
- Replace `PASTE_CLIENT_SECRET_KEY_HERE` with the secret you obtained

## Local Development - VS Code with DevContainers

This will automatically build and provision containers for u with a small wrapper around docker-compose, and then drop you in a terminal within the app container, with all of the commands ready to go, no setup needed.

### Devcontainer Extension

If you open in VS Code, due to [vs code extensions](.vscode/extensions.json) it should prompt you, if you don't already have it, to install devcontainer support.

### Open in DevContainer

Given you've got devcontainer extension installed, VS Code should notice the existence of [devcontainer.json](.devcontainer/devcontainer.json) and prompt you with a blue button in the bottom right "Reopen in Container" (see screengrab)

![DevContainer Prompt](devcontainer-prompt.png)

It will automatically:

- build and run a custom postgres image as a container based on postgres.Dockerfile
  - this defines a health check that ensures the database is alive
- build and run a custom app image as a container based on app.Dockerfile
  - the `depends_on` relationship in .devcontainer/docker-compose.yml will cause the app to wait for postgres to be healthy before
- it will subsequently run `npm postCreateCommand` which will do an `npm install` and a `npm run db:setup` to perform the migrations on your behalf, as well as generate typescript types for your database tables

### Start the App

- Run `npm run dev` to bring up the dev server.
- Click the VS Code prompt with the full url to view in browser.

NOTE: the URL for the browser will use localhost, which VS Code will automatically map to the underlying container on your behalf. If the default port of 3000 is not available on localhost, it may map to a different port on localhost, tho the container server is always listening on 3000, so best to click the VS code prompt when the server is running to ensure you go to the proper localhost url.

## Local Development - Manual Setup without DevContainers

### Build and run the containers

- run `npm run docker-compose build` to build images needed for containers
- run `npm run docker-compose -- up -d` to set up the compose environment in the background

### Exec into the app container

- run `npm run exec-into-app` to enter a terminal within the app container

NOTE: type `exit` at any time to go back to your previous terminal shell for the host

### Run the setup (install dependencies and run db migrations and seeding)

within the app container terminal:

- run `npm run postCreateCommand` to install dependencies and run the database migrations and seeding

### Run the app dev server

within the app container terminal:

- run `npm run dev -- --host`
- click the link that is outputted to console to visit the site

### Clean Up

- from outside the container, run `npm run docker-compose down` to kill everything

# Deployment

I deployed this from devcontainer by running `vercel` after setting up an account and setting up the neon postgres integration
I set env vars using `vercel env` commands

# Testing

I spent a lot of time manually testing and if this was a real project (or i had more time) i would add automated testing

I usually do end-to-end testing and some unit testing with mocks, and maybe some in-between low-level-integration tests to cover my bases.

# CICD

Usually I use gitlab ci or github actions to define a CICD pipeline in code, specifically one that if i vary the definition of the pipeline in a branch, i can verify the updates work for my branch, including a branch-specific preview deploy and test with a generated link to such back in the PR notes. From within those runners, I have in turn used systems like pulumi, terraform, CDK, skaffold, argo, and others to deterministically version images and config and push IAC definitions to a k8s cluster and surrounding cloud. I have not done that for this project due to time constraints.

# Architecture

- **TanStack Start** for TypeScript frontend and backend with typesafe server functions that can be called from client or during server-side rendering
- **Tailwind CSS** for modern styling and animation
- **Clerk** for OAuth for both frontend and API endpoints
- **Vercel** for preview deployment integrated with Neon Postgres free tier
- **Rudimentary rate limiting** [rate-limit.ts](server/middleware/rate-limit.ts) is a rudimentary rate limit script, but ideally such would exist at the load balancer level not the app level, since many server containers might be running and traffic balanced against them. Did not have time to set up the more robust version nor a load balancer for the code exercise, but typically I use kubernetes to deploy and use custom ingress controllers and ingress yamls to manage this, or istio or similar service mesh to define rate limiting rules.
- **Kysely migrations** to generate tables and generate TypeScript definitions so that queries are typesafe and will break at compile time if schema changes don't line up with TypeScript queries
- **DevContainer and Docker Compose** to simplify setup
- **Maximized use of browser-level HTML and CSS** form and input validation to reduce TS footprint for those concerns and increase compatibility
- **Zod** for runtime typechecking of API

# Possible Enhancments 

- chart showing click rates over time
- delete a url
- run the load balancing in the server