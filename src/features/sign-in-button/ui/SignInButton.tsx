import React, { memo, useCallback, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import clsx from 'clsx';

const defaultClassNames =
  'bg-blue-500 text-white p-2 rounded-lg transition-colors';

const hoverClassNames = 'hover:cursor-pointer hover:bg-blue-400';

const disabledClassNames =
  'disabled:bg-neutral-400 disabled:cursor-not-allowed disabled:text-black';

function SignInButton() {
  const { status } = useSession();

  const [signingIn, setSigningIn] = useState(false);

  const isLoading = status === 'loading' || signingIn;

  const handleClick = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setSigningIn(true);

    signIn('github').finally(() => setSigningIn(false));
  }, [isLoading]);

  return (
    <button
      className={clsx(defaultClassNames, hoverClassNames, disabledClassNames)}
      onClick={handleClick}
      disabled={isLoading}
    >
      Sign In
    </button>
  );
}

export default memo(SignInButton);
