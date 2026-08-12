import { Prisma } from "@/generated/prisma/client";

export function isPrismaErrorCode(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

/**
 * Toggles a row in a join table guarded by a unique constraint (Like,
 * Follow, ...). Tries `create` first rather than reading current state and
 * branching on it — a preliminary read goes stale under concurrent requests
 * (two clicks can both see "not set" and both decide to create), which is
 * exactly the race a toggle button needs to survive. Falling back to delete
 * only when create hits the unique constraint keeps the result in sync with
 * what the DB actually ends up with, even under real concurrency.
 */
export async function toggleUniqueRelation(options: {
  create: () => Promise<unknown>;
  deleteRow: () => Promise<unknown>;
}): Promise<boolean> {
  try {
    await options.create();
    return true;
  } catch (error) {
    if (!isPrismaErrorCode(error, "P2002")) throw error;

    try {
      await options.deleteRow();
      return false;
    } catch (deleteError) {
      // Another concurrent request already deleted it — net result is
      // still "off", just not by this request.
      if (!isPrismaErrorCode(deleteError, "P2025")) throw deleteError;
      return false;
    }
  }
}
