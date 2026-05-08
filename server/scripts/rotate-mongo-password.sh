#!/bin/bash
set -e

CLUSTER="lucid-cluster0.d5mmqzm.mongodb.net"
DB_USER="emlopezdev"
DB_NAME="lucid-dev"
APP_NAME="Lucid-Cluster0"

echo "MongoDB Atlas Password Rotation"
echo "--------------------------------"
echo "Step 1: Rotate the password in MongoDB Atlas:"
echo "  atlas.mongodb.com → Database Access → Edit ${DB_USER} → Autogenerate Secure Password"
echo ""
read -s -p "Paste the new password here (input hidden): " NEW_PASS
echo ""

if [ -z "$NEW_PASS" ]; then
  echo "Error: password cannot be empty"
  exit 1
fi

NEW_URL="mongodb+srv://${DB_USER}:${NEW_PASS}@${CLUSTER}/${DB_NAME}?appName=${APP_NAME}"

echo "Removing old MONGO_URL from Vercel..."
vercel env rm MONGO_URL development --yes

echo "Adding new MONGO_URL to Vercel..."
printf '%s' "$NEW_URL" | vercel env add MONGO_URL development

unset NEW_PASS
unset NEW_URL

echo "Pulling updated env vars locally..."
vercel env pull .env --yes

echo "Verifying connection..."
npx tsx -e "
import { mongoClientPromise } from './src/services/mongo.ts';
mongoClientPromise
  .then(() => { console.log('Connection verified'); process.exit(0); })
  .catch((e: Error) => { console.error('Connection failed:', e.message); process.exit(1); });
"

echo ""
echo "Rotation complete."
