// stores/routerStore.ts
import { create } from 'zustand';

type RouterStore = {
    navigate: ((path: string) => void);
    setRouterContext: (ctx: {
        navigate: (path: string) => void;
    }) => void;
};

export default create<RouterStore>((set) => ({
    navigate: (path) => location.pathname = path,
    setRouterContext: (ctx) => set({ ...ctx }),
}));
