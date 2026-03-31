import { redirect, type LoaderFunctionArgs } from "react-router";
import appPathname, { getPreferencesFromLoaderFunctionArgs } from "~/lib/app-pathname";

export function loader(args: LoaderFunctionArgs) {
    const { language } = getPreferencesFromLoaderFunctionArgs(args);
    return redirect(`/${language}`);
}