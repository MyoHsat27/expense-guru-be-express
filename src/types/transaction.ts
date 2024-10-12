export const enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export interface TransactionObject {
  _id: string;
  categoryId: string;
  walletId: string;
  amount: number;
  type: TransactionType;
  note: string,
  _v: number;
}

export interface TransactionCreateObject {
  categoryId: string;
  amount: number;
  type: TransactionType;
  note: string
}
