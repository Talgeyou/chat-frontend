import React, { memo, useCallback, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import clsx from 'clsx';
import { FaDiscord, FaGithub } from 'react-icons/fa';
import { IconType } from 'react-icons';

const defaultClassNames =
  'bg-purple-500 text-white p-2 rounded-lg transition-colors flex gap-2 items-center';

const hoverClassNames = 'hover:cursor-pointer hover:bg-purple-400';

const disabledClassNames =
  'disabled:bg-neutral-400 disabled:cursor-not-allowed disabled:text-black';

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

    signIn(provider).finally(() => setSigningIn(false));
  }, [isLoading, provider]);

  const Icon = providerIcons[provider];

  return (
    <button
      className={clsx(defaultClassNames, hoverClassNames, disabledClassNames)}
      onClick={handleClick}
      disabled={isLoading}
    >
      {<Icon size={32} />}
      <span>{t('sign_in', { provider: providerNames[provider] })}</span>
    </button>
  );
}

export default memo(SignInButton);
