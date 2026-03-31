import type { NavigateFunction, RedirectFunction } from "react-router";
import appPathname from "./app-pathname";

export default (cartItemIds: number[], navigate: NavigateFunction | RedirectFunction) => {
    return navigate(appPathname(`/checkout?cartItemIds=${Array.from(cartItemIds).join(',')}`));
}