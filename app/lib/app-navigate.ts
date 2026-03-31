import useRouterStore from "~/hooks/use-router-store";
import appPathname from "./app-pathname";

export default function appNavigate(path: string) {
    const { navigate } = useRouterStore.getState();
    return navigate(appPathname(path));
}