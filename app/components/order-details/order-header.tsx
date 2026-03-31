import { Link } from "react-router";
import { Calendar, ChevronLeft } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import appPathname from "~/lib/app-pathname";

function OrderHeader({ order, statusConfig }: { order: Order; statusConfig: any }) {
    return (
        <div className="flex flex-col gap-4">
            <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-muted-foreground">
                <Link to={appPathname(`/orders`)}><ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders</Link>
            </Button>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order #{order.uuid.split("-")[0]}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>Placed on {new Date(order.created_at).toLocaleDateString("en-US", { dateStyle: 'full' })}</span>
                    </div>
                </div>
                <Badge className="w-fit px-4 py-1 text-sm flex items-center gap-2" variant={statusConfig.variant}>
                    <statusConfig.icon className="w-4 h-4" />
                    {statusConfig.label}
                </Badge>
            </div>
        </div>
    );
}

export default OrderHeader;