import type { LoaderFunctionArgs } from "react-router";
import { defaultPreference, usePreferencesStore, type StorePreference } from "~/hooks/use-user-preference-store";

export function getPreferencesFromLoaderFunctionArgs(loaderFunctionArgs: LoaderFunctionArgs): StorePreference {
    const { params, request } = loaderFunctionArgs;

    const searchParams = new URLSearchParams(request.url);

    const language = params.lang || 'en';
    const currency = searchParams.get('currency') || defaultPreference.currency;
    const theme = searchParams.get('theme') || defaultPreference.theme;
    const timezone = defaultPreference.timezone;

    return {
        language,
        currency,
        theme,
        timezone
    } as StorePreference
}

export default function (pathname: string, loaderFunctionArgs?: LoaderFunctionArgs) {
    let preferences: StorePreference;

    if (loaderFunctionArgs) {
        preferences = getPreferencesFromLoaderFunctionArgs(loaderFunctionArgs);
    } else {
        preferences = usePreferencesStore.getState().preferences;
    }

    const to = pathnameWithPreference({ pathname, preferences });
    return `/${preferences.language}${to}`;
}

export function pathnameWithPreference({ pathname, preferences }: { pathname: string, preferences: StorePreference }) {
    const to = `${pathname}${pathname.includes('?') ? '&' : '?'}currency=${preferences.currency}&theme=${preferences.theme}`;
    return to;
}