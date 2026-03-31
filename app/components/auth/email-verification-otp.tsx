import * as React from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "~/components/ui/input-otp";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Form, useNavigation } from "react-router";
import { Mail } from "lucide-react";
import Button from "../custom-components/button";
import { useTranslation } from "react-i18next";

export type EmailVerificationOtpProps = {
    onSendEmailVerificationCode: () => void,
    errorMessages: string[] | null,
}

const RESEND_TIMEOUT = 30;

export function EmailVerificationOtp({
    onSendEmailVerificationCode,
    errorMessages
}: EmailVerificationOtpProps) {
    const { t } = useTranslation("auth");
    const [otp, setOtp] = React.useState("");
    const codeLength = 6;

    const [secondsLeft, setSecondsLeft] = React.useState(RESEND_TIMEOUT);
    const [canResend, setCanResend] = React.useState(false);

    const navigation = useNavigation();
    const isLoading = React.useMemo(() => navigation.state === "submitting", [navigation.state]);

    // countdown effect
    React.useEffect(() => {
        if (secondsLeft === 0) {
            setCanResend(true);
            return;
        }

        const timer = setTimeout(() => {
            setSecondsLeft((s) => s - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [secondsLeft]);

    const handleResend = () => {
        onSendEmailVerificationCode();
        setCanResend(false);
        setSecondsLeft(RESEND_TIMEOUT);
    };

    return (
        <Card>
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold flex justify-center items-center gap-2">
                    <Mail /> {t("email_verification.title")}
                </CardTitle>
                <CardDescription>
                    {t("email_verification.description", { codeLength })}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form className="space-y-6" method="post">
                    <div className="flex flex-col items-center gap-3">
                        <InputOTP
                            maxLength={codeLength}
                            value={otp}
                            onChange={setOtp}
                            name="otp">
                            <InputOTPGroup>
                                {Array.from({ length: codeLength }).map((_, index) => (
                                    <InputOTPSlot key={index} index={index} />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>

                        {errorMessages && <p className="text-destructive text-sm">
                            {errorMessages}
                        </p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={otp.length !== codeLength}
                        isLoading={isLoading}>
                        {t("email_verification.verify_button")}
                    </Button>
                </Form>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t("email_verification.didnt_receive")}
                    {canResend ? (
                        <Button
                            variant="link"
                            onClick={handleResend}
                            className="p-1 h-auto"
                        >
                            {t("email_verification.resend_code")}
                        </Button>
                    ) : (
                        <span className="ml-1">
                            {t("email_verification.resend_available_in", { secondsLeft })}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
