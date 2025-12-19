echo "Post Create Command"
echo "Post Create Command: Installing dependencies with Bun"
bun i

echo "Post Create Command: Installing Prisma CLI globally"
bun i -g prisma@latest

if [ ! -e packages/server/.env ]; then
    cp packages/server/sample.env packages/server/.env
fi

if [ ! -e packages/webapp/.env ]; then
    cp packages/webapp/sample.env packages/webapp/.env
fi

