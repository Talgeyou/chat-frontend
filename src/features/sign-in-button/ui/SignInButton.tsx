import React, { memo, useCallback, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import clsx from 'clsx';
import { FaDiscord, FaGithub } from 'react-icons/fa';
import { IconType } from 'react-icons';
import Button from '@/shared/ui/button';

type Provider = 'discord' | 'github';

type Props = {
  provider: Provider;
};

const providerNames: Record<Provider, string> = {
  discord: 'Discord',
  github: 'GitHub',
};

const providerIcons: Record<Provider, IconType> = {
  discord: FaDiscord,
  github: FaGithub,
};

function SignInButton({ provider }: Props) {
  const { t } = useTranslation(['common']);
  const { status } = useSession();

  const [signingIn, setSigningIn] = useState(false);

  const isLoading = status === 'loading' || signingIn;

  const handleClick = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setSigningIn(true);

    await signIn(provider);

    setSigningIn(false);
  }, [isLoading, provider]);

  const Icon = providerIcons[provider];

  return (
    <Button
      isLoading={isLoading}
      addonBefore={<Icon size={32} />}
      size={'lg'}
      onClick={handleClick}
    >
      <span>{t('sign_in', { provider: providerNames[provider] })}</span>
    </Button>
  );
}

export default memo(SignInButton);
