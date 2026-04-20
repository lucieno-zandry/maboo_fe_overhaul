import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
    const { t } = useTranslation("search_results");

    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-destructive">{message}</p>
            {onRetry && (
                <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
                    {t("tryAgain")}
                </Button>
            )}
        </div>
    );
}