import { useEffect, useMemo, useState, type FocusEvent, type FormEventHandler } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "~/components/ui/dialog";
import { TicketPercent } from "lucide-react";
import { useUserStore } from "~/hooks/use-user";
import { getClientCode, updateAuthUser } from "~/api/http-requests";
import { ValidationException } from "~/api/app-fetch";
import { toast } from "sonner";
import Button from "~/components/custom-components/button";
import CustomField from "~/components/custom-components/field";
import z from "zod";
import getUpdatedFormErrors from "~/lib/get-updated-form-errors";
import { useRevalidator } from "react-router";
import useClientCodeDialogStore from "~/hooks/use-client-code-dialog-store";
import { useTranslation } from "react-i18next";

const dataFormat = {
    code: z.string().min(1, "Client code is required").regex(/^[A-Z0-9]+$/, "Code must contain only letters and numbers")
};

export function ClientCodeDialog() {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formValidationErrors, setFormValidationErrors] = useState<{ code?: string[] } | null>(null);
    const { user, setUser, authStatus } = useUserStore();

    const { isOpen, setIsOpen } = useClientCodeDialogStore();
    const { t } = useTranslation("settings");

    const revalidator = useRevalidator();

    const canSubmit = useMemo(() => !formValidationErrors, [formValidationErrors]);

    useEffect(() => {
        const hasDeclined = sessionStorage.getItem("declined_client_code");
        if (user?.permissions?.can_use_effective_prices || hasDeclined) return;

        const timeoutId = setTimeout(() => {
            setIsOpen(true);
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [user]);


    useEffect(() => {
        const storedClientCodeId = localStorage.getItem("client_code_id_to_apply");

        if (storedClientCodeId && !user?.permissions?.can_use_effective_prices) {
            const clientCodeId = parseInt(storedClientCodeId, 10);

            handleApply(clientCodeId)
                .then(() => {
                    localStorage.removeItem("client_code_id_to_apply");
                });
        }
    }, [user]);

    const handleApply = async (clientCodeId: number) => {
        try {
            const updateUserResponse = await updateAuthUser({ client_code_id: clientCodeId });

            if (updateUserResponse.data?.user) {
                setUser(updateUserResponse.data.user);
                toast.success(t("clientCode.successNowSpecial"));
                revalidator.revalidate();
            }
        } catch (error) {
            setIsOpen(true);
            toast.error(t("clientCode.errorApply"));
        }
    };

    const handleCloseDialog = () => {
        sessionStorage.setItem("declined_client_code", "true");
        setIsOpen(false);
    };

    const handleFormValidationChange = (validationErrors: string[] | null, e: FocusEvent<HTMLInputElement, Element>) => {
        const updatedFormValidationErrors = getUpdatedFormErrors({
            formErrors: formValidationErrors,
            name: e.target.name as "code",
            validationErrors
        });

        setFormValidationErrors(updatedFormValidationErrors);
    };

    const handleCodeSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        const trimmedCode = code.trim();
        if (!trimmedCode) return;

        setIsLoading(true);
        getClientCode(trimmedCode)
            .then(async (response) => {
                if (response.data?.client_code) {
                    if (user) {
                        await handleApply(response.data.client_code.id);
                    } else {
                        localStorage.setItem("client_code_id_to_apply", response.data.client_code.id.toString());
                        toast.success(t("clientCode.successSaved"));
                    }

                    setIsOpen(false);
                } else {
                    setFormValidationErrors({ code: [t("clientCode.invalidCode")] });
                }
            })
            .catch((error) => {
                if (error instanceof ValidationException) {
                    return setFormValidationErrors(error.errors);
                }

                toast.error(`${t("clientCode.errorApplyStatus")}${error.status}`, {
                    description: error.data?.message || t("clientCode.checkCodeTryAgain")
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCodeSubmit}>
                    <DialogHeader className="flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <TicketPercent className="h-6 w-6 text-primary" />
                        </div>
                        <DialogTitle className="text-xl">{t("clientCode.title")}</DialogTitle>
                        <DialogDescription className="text-center">
                            {t("clientCode.description")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <CustomField
                            name="code"
                            id="code"
                            placeholder={t("clientCode.placeholder")}
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="text-center font-mono uppercase tracking-widest"
                            dataFormat={dataFormat.code}
                            validationErrors={formValidationErrors?.code}
                            onValidationErrorsChange={handleFormValidationChange}
                            required
                        />
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-col gap-2">
                        <Button
                            className="w-full"
                            type="submit"
                            isLoading={isLoading}
                            disabled={!canSubmit}
                        >
                            {t("clientCode.applyCode")}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleCloseDialog}
                            className="w-full text-muted-foreground"
                            type="button"
                        >
                            {t("clientCode.noCode")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}