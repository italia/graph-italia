echo "Create .env file"

if [ ! -e .env ]; then
    echo "DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres" > .env
fi

echo "Set permissions"
chown -R node:node node_modules

echo "Installing Deps"
bun i
bun i -g ts-node prisma@5.19.0