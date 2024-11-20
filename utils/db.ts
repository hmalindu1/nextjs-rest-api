/* ================================================================================================ /
 * Title : Prisma Client
 * Description : Everytime we make a prisma client, which is an instance of the SDK it creates a 
 *               new Database connection. To avoid that we can cache the connection in a global variable
 *               and reuse it.
 * Author : Hashan
 * Date : November 20th, 2024
 /* ================================================================================================ */


/** We do this thing only in development because how nextjs do hot realoading. Everytime when we save
 * a file, it will be hot reloaded or hot refreshed and it will mess up the database connection and it will
 * just breake eventually. After like 10 hot reloads it'll be like I don't have any more capacity to make 
 * a database connection. So this file prevents that from happening.
  */

import { PrismaClient } from '@prisma/client'

// globalThis is a method in Node, it's basically like the global Space we are writing on
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? // Checking if Prisma is there first
  new PrismaClient({ // and if it's not then make it, then assign it to a variable called prisma
    log: ['query'], // this will log every query 
  })

// if we are not in production, add that to the global prisma
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
