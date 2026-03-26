import React from "react";
import { redirect, useActionData, useNavigate, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";
import { attemptEmailVerification, sendEmailVerificationCode } from "~/api/http-requests";
import { EmailVerificationOtp } from "~/components/email-verification-otp";
import { useSuccessRedirect } from "~/hooks/use-redirect-action";
import { useTranslation } from "react-i18next";
import i18n from "~/i18n/i18n";

export const clientAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const otp = formData.get('otp');

    if (!otp) {
        return {
            errors: {
                code: [i18n.t("auth:email_verification.code_required")]
            }
        }
    }

    try {
        await attemptEmailVerification(otp);
    } catch (error) {
        if (error) return error;
    }

    const successRedirect = useSuccessRedirect();
    return successRedirect();
}

export default function () {
    const { t } = useTranslation("auth");
    const error = useActionData();
    const navigate = useNavigate();
    const didSendRef = React.useRef(false);


    const handleSendEmailVerificationCode = () => {
        sendEmailVerificationCode()
            .then((response) => {
                if (response.data?.link_sent) {
                    toast.success(t("email_verification.success_toast"));
                } else {
                    toast.error(t("email_verification.error_toast"));
                }
            })
            .catch((error) => {
                if (error.status === 403) {
                    navigate('/');
                    toast.error(t("email_verification.already_confirmed"));
                } else {
                    toast.error(t("email_verification.general_error"))
                }
            })
    }


    React.useEffect(() => {
        if (didSendRef.current) return;
        didSendRef.current = true;

        handleSendEmailVerificationCode();
    }, []);

    return <EmailVerificationOtp
        onSendEmailVerificationCode={handleSendEmailVerificationCode}
        errorMessages={error?.errors?.code || null} />
}