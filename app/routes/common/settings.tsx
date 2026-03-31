import React from 'react';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useUserStore } from '~/hooks/use-user';
import LoadingScreen from '~/components/settings/loading-screen';
import ProfileTab from '~/components/settings-tabs/profile-tab';
import SecurityTab from '~/components/settings-tabs/security-tab';
import AccountDetailsTab from '~/components/settings-tabs/account-details-tab';
import getRoleBadgeColor from '~/lib/get-role-badge-color';
import AccountCard from '~/components/settings/account-card';
import { PartnerCodeSettings } from '~/components/settings/partner-code-card';
import NotFound from '~/components/common/not-found';
import { useTranslation } from 'react-i18next';

export type SettingsTabProps = {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AccountSettings() {
  const { user, authStatus } = useUserStore();
  const { t } = useTranslation("settings");

  if (!user) {
    if (authStatus === 'unknown')
      return <LoadingScreen />

    return <NotFound />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('settings:accountSettings')}</h1>
            <p className="text-gray-500 mt-1">{t('settings:accountSettingsDescription')}</p>
          </div>
          <Badge className={getRoleBadgeColor(user.role)}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>

        <AccountCard />

        <PartnerCodeSettings />

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">{t('settings:profile')}</TabsTrigger>
            <TabsTrigger value="security">{t('settings:security')}</TabsTrigger>
            <TabsTrigger value="account">{t('settings:accountInfo')}</TabsTrigger>
          </TabsList>

          <ProfileTab />
          <SecurityTab />
          <AccountDetailsTab />
        </Tabs>
      </div>
    </div>
  );
}