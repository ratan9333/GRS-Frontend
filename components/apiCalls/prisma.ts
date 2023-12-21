import { PrismaClient } from "@prisma/client";

const ProxyPrisma = new Proxy(PrismaClient, {
  construct(target, args) {
    if (typeof window !== "undefined") return {};
    (globalThis as any)["db"] = (globalThis as any)["db"] || new target(...args);
    return (globalThis as any)["db"];
  },
});

const prisma = new ProxyPrisma();

export default prisma;
