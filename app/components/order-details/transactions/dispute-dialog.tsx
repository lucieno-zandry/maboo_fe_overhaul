import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { openDispute } from "~/api/http-requests";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction;
    onSuccess: () => void;
}

export function DisputeDialog({ open, onOpenChange, transaction, onSuccess }: Props) {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await openDispute(transaction.uuid, { reason });
            toast.success("Dispute opened", { description: "We'll review your case." });
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast.error("Error", { description: "Could not open dispute." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Open a dispute</DialogTitle>
                    <DialogDescription>
                        If you have an issue with this payment, let us know the reason.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                            id="reason"
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Describe the problem..."
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Opening..." : "Open dispute"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}