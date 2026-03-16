import { Button } from "~/components/ui/button";
import { cancelDispute } from "~/api/http-requests";
import { useState } from "react";
import { toast } from "sonner";

export function CancelDisputeButton({ transaction, onComplete }: { transaction: Transaction; onComplete: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = async () => {
        setIsLoading(true);
        try {
            await cancelDispute(transaction.uuid);
            toast.success("Dispute cancelled", { description: "The dispute has been withdrawn." });
            onComplete();
        } catch (error) {
            toast("Error", { description: "Could not cancel dispute." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button size="sm" variant="outline" onClick={handleCancel} disabled={isLoading}>
            {isLoading ? "Cancelling..." : "Cancel dispute"}
        </Button>
    );
}