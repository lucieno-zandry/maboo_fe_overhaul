import { useState } from "react";
import { useFetcher } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { requestRefund } from "~/api/http-requests";
import { toast } from "sonner";
import { Textarea } from "~/components/ui/textarea";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction;
    onSuccess: () => void;
}

export function RefundRequestDialog({ open, onOpenChange, transaction, onSuccess }: Props) {
    const fetcher = useFetcher();
    const [amount, setAmount] = useState<string>(transaction.amount.toString());
    const [reason, setReason] = useState("");

    const isSubmitting = fetcher.state === "submitting";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await requestRefund(transaction.uuid, {
                amount: amount ? parseFloat(amount) : undefined,
                reason,
            });
            toast.success("Refund request submitted", { description: "We'll review it shortly." });
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast.error("Error", { description: "Could not submit request." });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request a refund</DialogTitle>
                    <DialogDescription>
                        You can request a full or partial refund. Provide a reason to help us process it faster.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="amount">Amount (optional)</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={transaction.amount}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`Max ${transaction.amount}`}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Leave empty for full amount.</p>
                    </div>
                    <div>
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                            id="reason"
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Tell us why you need a refund..."
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit request"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}