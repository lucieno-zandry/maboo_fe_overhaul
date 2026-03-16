import useRouterStore from "~/hooks/use-router-store";

export default () => {
    const { navigate, lang } = useRouterStore.getState();
    navigate(`/${lang}/404`)
}