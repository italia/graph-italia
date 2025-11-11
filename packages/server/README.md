# Dataviz chart server

## Install deps

To install dependencies:

```bash
bun install

```

## DB Setup

This project uses PostgreSQL. _Prisma_ (v5.19.0) is the ORM library used to query and store data into the db . So, install _prisma_ globally:

```
bun i -g prisma@5.19.0
```

After that, you have to setup youn db

Run:

```
prisma db push
```

It will generate prisma client and generate all the tables in the db.

Then, seed the db

```
bun seeds/seed-users.ts
```

## Run the app

To run:

```bash
bun run index.ts
# or
bun run dev
```

This project was created using `bun init` in bun v1.1.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# fly.io config

Docker file generated with

```bash
 bunx --bun @flydotio/dockerfile@latest
```

then used the `flyctl secrets` command to add envs, see `sample.env` for variables reference.

```bash
fly secrets set DATABASE_URL=postgres://example.com/mydb
fly secrets list
```
