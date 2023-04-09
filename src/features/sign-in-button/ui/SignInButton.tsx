import React, { memo, useCallback, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import clsx from 'clsx';
import { RedirectableProviderType } from 'next-auth/providers';

const defaultClassNames =
  'bg-purple-500 text-white p-2 rounded-lg transition-colors';

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

function SignInButton({ provider }: Props) {
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

  return (
    <button
      className={clsx(defaultClassNames, hoverClassNames, disabledClassNames)}
      onClick={handleClick}
      disabled={isLoading}
    >
      Sign In via {providerNames[provider]}
    </button>
  );
}

export default memo(SignInButton);
