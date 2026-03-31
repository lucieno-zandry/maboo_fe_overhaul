import useRedirectAction from "~/hooks/use-redirect-action";
import redirectPathnames from "./redirect-pathnames";
import appPathname from "./app-pathname";

let redirectLock: ReturnType<typeof setTimeout> | null = null;

const REDIRECT_THROTTLE_MS = 10_000;

const handleActionRedirection = (
    json: any
) => {
    const redirectPathname =
        redirectPathnames[json.action as keyof typeof redirectPathnames];

    if (!redirectPathname) return;

    const { redirect } = useRedirectAction.getState();

    if (redirectLock) {
        return;
    }

    redirect(appPathname(redirectPathname));

    redirectLock = setTimeout(() => {
        redirectLock = null;
    }, REDIRECT_THROTTLE_MS);

};

export default handleActionRedirection;