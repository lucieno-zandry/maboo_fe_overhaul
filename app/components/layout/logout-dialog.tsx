import React from "react"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"
import { useUserStore } from "~/hooks/use-user"
import { useTranslation } from "react-i18next"

export type LogoutDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
    const { setUser } = useUserStore();
    const { t } = useTranslation("auth");

    const handleLogout = React.useCallback(() => {
        setUser(null);
        localStorage.removeItem('token');
    }, [setUser]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" aria-describedby="Confirm logout">
                <DialogHeader>
                    <DialogTitle>{t("logout.title")}</DialogTitle>
                    <DialogDescription>
                        {t("logout.description")}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            {t("logout.close")}
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="destructive" onClick={handleLogout}>{t("logout.confirm")}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
