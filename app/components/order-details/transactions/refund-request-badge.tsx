import { Badge } from "~/components/ui/badge";

const statusColor = {
    pending: "secondary",
    approved: "default",
    rejected: "destructive",
} as const;

export function RefundRequestBadge({ request }: { request: RefundRequest }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span>Refund request: {request.amount}</span>
            <Badge variant={statusColor[request.status] || "outline"}>{request.status}</Badge>
        </div>
    );
}