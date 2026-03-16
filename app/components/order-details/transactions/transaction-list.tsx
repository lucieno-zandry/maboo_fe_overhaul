import { TransactionCard } from "./transaction-card";

interface TransactionListProps {
    transactions: Transaction[];
    lang: string;
    onActionComplete: () => void; // to refresh data
}

export function TransactionList({ transactions, lang, onActionComplete }: TransactionListProps) {
    if (!transactions.length) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transactions</h3>
            {transactions.map((tx) => (
                <TransactionCard
                    key={tx.uuid}
                    transaction={tx}
                    lang={lang}
                    onActionComplete={onActionComplete}
                />
            ))}
        </div>
    );
}