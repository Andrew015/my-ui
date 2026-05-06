import type { Transaction, TransactionStatus } from "@/data/transaction-store";

export function getStatusLogTime(
  tx: Transaction,
  status: TransactionStatus,
): string | undefined {
  return tx.statusLogs?.find((l) => l.status === status)?.time;
}
