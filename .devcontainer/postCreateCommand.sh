echo "Post Create Command"
echo "Post Create Command: Installing dependencies with Bun"
bun i

echo "Post Create Command: Installing Prisma CLI globally"
bun i -g prisma@latest


if [ ! -e packages/server/.env ]; then
    echo "Post Create Command: Setup .env in @graph-italia/server"
    cp packages/server/sample.env packages/server/.env
fi

if [ ! -e packages/webapp/.env ]; then
    echo "Post Create Command: Setup .env in @graph-italia/webapp"
    cp packages/webapp/sample.env packages/webapp/.env
fi

echo "Post Create Command: Setup prisma"
cd packages/server
npx prisma generate
prisma db push
bun seeds/seed-users.ts
cd ../..

echo "Post Create Command: Done"
