import { usePreferencesStore } from "~/hooks/use-user-preference-store";

/**
 * Formats a date string based on the user's stored language and timezone preferences.
 */
export default (dateString: string | Date) => {
    const { timezone, language } = usePreferencesStore.getState().preferences;

    // Handle invalid dates gracefully
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    try {
        return new Intl.DateTimeFormat(language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: timezone, // Applies the user's detected or chosen timezone
        }).format(date);
    } catch (error) {
        // Fallback to standard formatting if timezone/language is invalid
        return date.toLocaleDateString();
    }
};