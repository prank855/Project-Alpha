## Live Development server

If I am working on the project you can view the dev environment here:

# 

## Prerequisites

- npm >=5.5.0
- node >=16.0.0

## Install

```sh
git clone https://github.com/prank855/Project-Alpha
cd Project-Alpha/
npm i
```

## Usage

```sh
# Spawn client for development (requires PORT env)
npm run dev:client
#(note: client will connect to production server @ ws://joshh.moe:8080 so you'll have to redirect it to ws://localhost:8080 in ./src/client/whatever_game_class_is.ts)

# Spawn server for development
npm run dev:server

# Build
npm run build
```

## Running Build

```sh
# Spawn Server
npm run start:server
#Open Client Webpage: `./dist/index.html`

```

:D
