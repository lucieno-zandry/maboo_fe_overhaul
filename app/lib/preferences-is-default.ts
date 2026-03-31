import { defaultPreference, type StorePreference } from "~/hooks/use-user-preference-store";

export default function (preferences: StorePreference): boolean {
    return preferences.currency === defaultPreference.currency &&
        preferences.language === defaultPreference.language &&
        preferences.theme === defaultPreference.theme &&
        preferences.timezone === defaultPreference.timezone;
}