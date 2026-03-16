import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useState } from "react";

import formatMoney from "~/lib/format-money";
import { RefundRequestBadge } from "./refund-request-badge";
import { CancelDisputeButton } from "./cancel-dispute-button";
import { RefundRequestDialog } from "./refund-request-dialog";
import { DisputeDialog } from "./dispute-dialog";

interface TransactionCardProps {
    transaction: Transaction;
    lang: string;
    onActionComplete: () => void;
}

export function TransactionCard({ transaction, lang, onActionComplete }: TransactionCardProps) {
    const [showRefundDialog, setShowRefundDialog] = useState(false);
    const [showDisputeDialog, setShowDisputeDialog] = useState(false);

    const hasPendingRefundRequests = transaction.refund_requests?.some(req => req.status === 'pending');
    const isPayment = transaction.type === "PAYMENT";
    const isSuccess = transaction.status === "SUCCESS";
    const isDisputeOpen = transaction.dispute_status === "OPEN";
    const canRequestRefund = isPayment && isSuccess && !isDisputeOpen && !hasPendingRefundRequests;
    const canOpenDispute = isPayment && isSuccess && !isDisputeOpen && !transaction.dispute_status;
    const canCancelDispute = isPayment && isDisputeOpen;

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                        {transaction.type} · {transaction.method}
                    </CardTitle>
                    <Badge variant={transaction.status === "SUCCESS" ? "default" : "secondary"}>
                        {transaction.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">{formatMoney(transaction.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span>{new Date(transaction.created_at).toLocaleDateString(lang)}</span>
                    </div>

                    {/* Dispute status */}
                    {transaction.dispute_status && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Dispute</span>
                            <Badge variant={transaction.dispute_status === "OPEN" ? "destructive" : "outline"}>
                                {transaction.dispute_status}
                            </Badge>
                        </div>
                    )}

                    {/* Refund requests */}
                    {transaction.refund_requests && transaction.refund_requests.length > 0 && (
                        <div className="mt-2 space-y-1">
                            <span className="text-xs text-muted-foreground">Refund requests</span>
                            {transaction.refund_requests.map((req) => (
                                <RefundRequestBadge key={req.uuid} request={req} />
                            ))}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {canRequestRefund && (
                            <Button size="sm" variant="outline" onClick={() => setShowRefundDialog(true)}>
                                Request refund
                            </Button>
                        )}
                        {canOpenDispute && (
                            <Button size="sm" variant="outline" onClick={() => setShowDisputeDialog(true)}>
                                Open dispute
                            </Button>
                        )}
                        {canCancelDispute && (
                            <CancelDisputeButton transaction={transaction} onComplete={onActionComplete} />
                        )}
                    </div>
                </div>
            </CardContent>

            <RefundRequestDialog
                open={showRefundDialog}
                onOpenChange={setShowRefundDialog}
                transaction={transaction}
                onSuccess={onActionComplete}
            />
            <DisputeDialog
                open={showDisputeDialog}
                onOpenChange={setShowDisputeDialog}
                transaction={transaction}
                onSuccess={onActionComplete}
            />
        </Card>
    );
}