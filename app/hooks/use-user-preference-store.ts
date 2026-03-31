// stores/userPreferencesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { updateUserPreferences } from '~/api/http-requests';
import { useUserStore } from './use-user';

export type StorePreference = Omit<UserPreference, 'user_id' | 'created_at' | 'updated_at' | 'id' | 'user'>;
export type UserPreferenceUpdates = Partial<StorePreference>;

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const defaultPreference: StorePreference = {
    currency: 'USD',
    language: 'en',
    theme: 'system',
    timezone
};

interface PreferencesState {
    preferences: StorePreference;
    rehydrated: boolean;        // localStorage -> memory done
    pendingSync: boolean;       // local changes waiting server
    syncedAt?: number;
    set: (state: Partial<Pick<PreferencesState, 'preferences' | 'rehydrated' | 'pendingSync' | 'syncedAt'>>) => void;          // timestamp when server confirmed

    updatePreferences: (updates: UserPreferenceUpdates) => Promise<unknown>;
    clearPreferences: () => void;
    setLanguage: (language: string) => void;
    setPreferences: (preference: UserPreferenceUpdates) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set, get) => ({
            preferences: defaultPreference,
            rehydrated: false,
            pendingSync: false,
            syncedAt: undefined,
            set,
            setPreferences: (updates) => {
                const current = get().preferences;
                const preferences: StorePreference = { ...current, ...updates };
                // mark local change pending server sync
                set({ preferences, pendingSync: true });
            },

            updatePreferences: async (updates) => {
                const { authStatus } = useUserStore.getState();
                const { setPreferences, preferences } = get();
                const shouldWait = authStatus === 'authenticated' && updates.currency && updates.currency !== preferences.currency;

                if (!shouldWait)
                    // apply local change immediately (optimistic)
                    setPreferences(updates);

                if (authStatus !== 'authenticated') {
                    // keep pendingSync true until user logs in and sync happens
                    return;
                }

                try {
                    await updateUserPreferences(updates);

                    const newState: Partial<PreferencesState> = {
                        pendingSync: false,
                        syncedAt: Date.now(),
                    };

                    if (shouldWait) {
                        newState.preferences = { ...preferences, ...updates }
                    }

                    // server confirmed — mark synced
                    set(newState);
                } catch (err: any) {
                    console.error(err.response?.data?.message || 'Failed to update preferences');
                    // keep pendingSync true so UI can show retry option
                    throw err;
                }
            },

            clearPreferences: () => {
                set({ preferences: defaultPreference, pendingSync: false, syncedAt: undefined });
            },

            setLanguage: (language) => {
                get().updatePreferences({ language });
            },
        }),
        {
            name: 'user-preferences-storage',
            partialize: (state) => ({
                preferences: state.preferences,
                // persist sync metadata too so re-opened tabs know status
                pendingSync: state.pendingSync,
                syncedAt: state.syncedAt
            }),
            // set rehydration hook to flip the flag when localStorage is applied
            onRehydrateStorage: () => (state) => {
                // called after rehydration; set rehydrated true
                state?.set({ rehydrated: true });
            }
        }
    )
);
