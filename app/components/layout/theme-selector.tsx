import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { usePreferencesStore } from '~/hooks/use-user-preference-store';
import { useUserStore } from '~/hooks/use-user';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';

interface ThemeSelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const DropdownThemeSelect = ({ value, onChange, disabled }: ThemeSelectProps) => {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span>Theme</span>
            </div>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger className="w-[90px] h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

const ThemeSelect = ({ value, onChange, disabled }: ThemeSelectProps) => {
    const TriggerIcon = value === 'dark' ? Moon : value === 'light' ? Sun : Laptop;
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="w-[80px] sm:w-[110px] h-9 flex items-center gap-2 bg-transparent">
                <TriggerIcon className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
            </SelectContent>
        </Select>
    );
};

export const ThemeSelector = ({ type = 'navbar' }: { type?: 'navbar' | 'dropdown' }) => {
    const { authStatus } = useUserStore();
    const { preferences, updatePreferences } = usePreferencesStore();

    const handleThemeChange = (newTheme: string) => {
        updatePreferences({ theme: newTheme as 'light' | 'dark' | 'system' });
    };

    const Component = type === 'dropdown' ? DropdownThemeSelect : ThemeSelect;

    return (
        <Component
            value={preferences?.theme || 'system'}
            onChange={handleThemeChange}
            disabled={authStatus === 'unknown'}
        />
    );
};