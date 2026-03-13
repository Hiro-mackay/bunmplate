import type { Database } from "@bunmplate/drizzle";
import { Elysia } from "elysia";

const ROLLBACK_SENTINEL = Symbol("rollback");

interface TransactionHandle {
  tx: Database;
  commit: () => void;
  rollback: () => void;
}

/**
 * Opens a Drizzle transaction and returns control handles.
 *
 * The transaction stays open until `commit()` or `rollback()` is called.
 * If the DB fails to start a transaction (pool exhausted, network error),
 * the returned promise rejects immediately — no dangling promises.
 */
function openTransaction(db: Database): Promise<TransactionHandle> {
  return new Promise<TransactionHandle>((resolveStart, rejectStart) => {
    let commit!: () => void;
    let rollback!: () => void;

    const done = new Promise<void>((resolve, reject) => {
      commit = resolve;
      rollback = () => reject(ROLLBACK_SENTINEL);
    });

    db.transaction(async (rawTx) => {
      resolveStart({
        tx: rawTx as unknown as Database,
        commit,
        rollback,
      });
      await done;
    }).catch((error: unknown) => {
      // Intentional rollback — Drizzle already rolled back the transaction
      if (error === ROLLBACK_SENTINEL) return;
      // DB failed to open a transaction — propagate to resolve() caller
      rejectStart(error);
    });
  });
}

export type TransactionPlugin = ReturnType<typeof createTransactionPlugin>;

export function createTransactionPlugin(db: Database) {
  return new Elysia({ name: "transaction" })
    .resolve({ as: "scoped" }, async () => {
      const handle = await openTransaction(db);
      return { tx: handle.tx, _txCtrl: handle };
    })
    .onAfterHandle({ as: "scoped" }, ({ _txCtrl }) => {
      _txCtrl.commit();
    })
    .onError({ as: "scoped" }, ({ _txCtrl }) => {
      _txCtrl?.rollback();
    });
}
