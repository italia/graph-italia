# Graph Italia chart server

## Install deps

To install dependencies:

```bash
bun install

```

## DB Setup

This project uses PostgreSQL. _Prisma_ (v7+) is the ORM library used to query and store data into the db . So, install _prisma_ globally:

```
bun i -g prisma@latest
```

After that, you have to setup youn db

Run:

```
prisma migrate deploy
```

It will apply the committed Prisma migrations and align the database schema.

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
