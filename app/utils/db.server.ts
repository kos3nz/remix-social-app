import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

declare global {
  var __prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
    global.__prisma.$connect();
  }
  db = global.__prisma;
}

export { db };
