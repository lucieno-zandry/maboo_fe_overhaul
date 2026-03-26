import Button from "~/components/custom-components/button"
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "~/components/ui/field"
import CustomField from "~/components/custom-components/field";
import z from "zod";
import { redirect, useLoaderData, useNavigate, useParams } from "react-router";
import type { Route } from "./+types";
import { getEmailInfo, registerUser } from "~/api/http-requests";
import React, { useMemo, useState, type FormEventHandler } from "react";
import getUpdatedFormErrors from "~/lib/get-updated-form-errors";
import randomString from "~/lib/random-string";
import { toast } from "sonner";
import { ValidationException } from "~/api/app-fetch";
import BackButton from "~/components/back-button";
import { useTranslation } from "react-i18next";

const dataFormat = {
  password: z.string().min(4),
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const response = email && await getEmailInfo(email);
  const { lang } = params;

  if (response && response.data?.is_taken === false) {
    return email;
  }

  return redirect(`/${lang}/auth`);
}

export default function () {
  const { t } = useTranslation("auth");
  const email = useLoaderData<string>();

  const [formValidationErrors, setFormValidationErrors] = useState<{ password?: string[], password_confirmation?: string[] } | null>(null);

  const [data, setData] = useState({
    password: '',
    password_confirmation: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const canSubmit = useMemo(() => !formValidationErrors && data.password && data.password === data.password_confirmation, [formValidationErrors, data]);
  const navigate = useNavigate();
  const { lang = 'en' } = useParams();

  const handleValidationErrorsChange = React.useCallback((validationErrors: string[] | null, e: React.FocusEvent<HTMLInputElement, Element>) => {
    const name = e.target.name as "password" | "password_confirmation";

    setFormValidationErrors(f => {
      const updatedFormErrors = getUpdatedFormErrors({
        formErrors: f,
        name,
        validationErrors
      })

      return updatedFormErrors
    });

    setData(d => ({ ...d, [name]: e.target.value }));
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    registerUser({
      email: formData.get("email")!,
      password: formData.get("password")!,
      password_confirmation: formData.get("password_confirmation")!,
      name: randomString(8),
    })
      .then(response => {
        toast.success(t("register.success_toast"));

        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }

        navigate(`/${lang}/auth/verify-email`);
      })
      .catch(error => {
        if (error instanceof ValidationException) {
          return setFormValidationErrors(error.errors);
        }

        toast.error(`${t("register.error_toast")} : ${error.status}`, { description: error.data.message });
      })
      .finally(() => setIsLoading(false));
  }

  return <form className="p-6 md:p-8" method="post" onSubmit={handleSubmit}>
    <BackButton />
    <FieldGroup>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("register.welcome")}</h1>
        <p className="text-muted-foreground text-balance">
          {t("register.create_account")}
        </p>
      </div>

      <CustomField
        label={t("register.email")}
        id="email"
        type="email"
        name="email"
        value={email}
        readOnly
        required
      />

      <CustomField
        id="password"
        type="password"
        name="password"
        dataFormat={dataFormat.password}
        onValidationErrorsChange={handleValidationErrorsChange}
        validationErrors={formValidationErrors?.password}
        label={t("register.password")}
        required
      />

      <CustomField
        id="password_confirmation"
        type="password"
        name="password_confirmation"
        dataFormat={dataFormat.password}
        onValidationErrorsChange={handleValidationErrorsChange}
        validationErrors={formValidationErrors?.password_confirmation}
        label={t("register.confirm_password")}
        required
      />

      <Field>
        <Button type="submit" disabled={!canSubmit} isLoading={isLoading}>
          {t("register.create_button")}
        </Button>
      </Field>
    </FieldGroup>
  </form>
}
