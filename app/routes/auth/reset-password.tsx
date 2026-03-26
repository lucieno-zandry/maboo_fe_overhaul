import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, redirect, useActionData, useLoaderData, useNavigate, useNavigation, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { HttpException, ValidationException } from "~/api/app-fetch";
import { resetPassword } from "~/api/http-requests";
import Button from "~/components/custom-components/button";
import Field from "~/components/custom-components/field";
import { FieldGroup } from "~/components/ui/field";
import getUpdatedFormErrors from "~/lib/get-updated-form-errors";
import { useTranslation } from "react-i18next";
import i18n from "~/i18n/i18n";

const dataFormat = {
    password: z.string().min(4),
}

export const loader = ({ params }: LoaderFunctionArgs) => {
    const token = params.token;
    return token;
}

export const clientAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const password = formData.get('password');
    const passwordConfirmation = formData.get('password_confirmation');

    if (password?.toString() !== passwordConfirmation?.toString()) return new ValidationException({ password_confirmation: [i18n.t("auth:reset_password.password_mismatch")] }, 422);

    try {
        const response = await resetPassword(formData);

        if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
        }

        return redirect('/');
    } catch (error) {
        if (error instanceof HttpException && error.status === 403) {
            toast.error(i18n.t("auth:reset_password.permission_denied"));
            return redirect('/');
        }

        return error;
    }
}

export default function () {
    const { t } = useTranslation("auth");
    const [formValidationErrors, setFormValidationErrors] = useState<{ password?: string[], password_confirmation?: string[] } | null>(null);
    const navigation = useNavigation();

    const token = useLoaderData<string>();
    const canSubmit = useMemo(() => !formValidationErrors, [formValidationErrors]);
    const isLoading = useMemo(() => navigation.state === "loading", [navigation]);

    const error = useActionData();

    useEffect(() => {
        if (!error) return;
        if (error instanceof ValidationException) {
            if (error.errors.token) {
                toast.error(error.errors.token);
            }

            setFormValidationErrors(error.errors);
        } else {
            toast.error(`${t("reset_password.error_toast")} : ${error.status}!`)
        }
    }, [error, t]);

    const handleValidationErrorsChange = useCallback((validationErrors: string[] | null, e: React.FocusEvent<HTMLInputElement, Element>) => {
        const name = e.target.name as "password" | "password_confirmation";


        setFormValidationErrors(f => {
            const updatedFormErrors = getUpdatedFormErrors({
                formErrors: f,
                name,
                validationErrors
            })

            return updatedFormErrors
        });
    }, []);
    return <Form className="p-6 md:p-8" method="post">
        <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t("reset_password.reset_password")}</h1>
                <p className="text-muted-foreground text-balance">
                    {t("reset_password.create_new_password")}
                </p>
            </div>

            <input type="hidden" name="token" value={token} readOnly />
            <Field
                id="password"
                type="password"
                name="password"
                dataFormat={dataFormat.password}
                onValidationErrorsChange={handleValidationErrorsChange}
                validationErrors={formValidationErrors?.password}
                label={t("reset_password.password")}
                required />

            <Field
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                dataFormat={dataFormat.password}
                onValidationErrorsChange={handleValidationErrorsChange}
                validationErrors={formValidationErrors?.password_confirmation}
                label={t("reset_password.confirm_password")}
                required />

            <Button
                type="submit"
                disabled={!canSubmit}
                isLoading={isLoading}>{t("reset_password.reset_button")}</Button>
        </FieldGroup>
    </Form>
}