import { Outlet } from "react-router"
import { Card, CardContent } from "~/components/ui/card"
import { FieldDescription } from "~/components/ui/field"
import { Trans, useTranslation } from "react-i18next"

export default function() {
    const { t } = useTranslation("auth");
    
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <div className={"flex flex-col gap-6"}>
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <Outlet />
                            <div className="bg-muted relative hidden md:block">
                                <img
                                    src="/assets/auth/login.jpg"
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <FieldDescription className="px-6 text-center">
                        <Trans 
                            t={t}
                            i18nKey="layout.terms_agreement"
                            components={{ 1: <a href="#" />, 3: <a href="#" /> }}
                        />
                    </FieldDescription>
                </div>
            </div>
        </div>
    )
}
