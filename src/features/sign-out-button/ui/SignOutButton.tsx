import React, { memo, useCallback, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import clsx from 'clsx';

const defaultClassNames =
  'bg-red-500 text-white p-2 rounded-lg transition-colors';

const hoverClassNames = 'hover:cursor-pointer hover:bg-red-400';

const disabledClassNames =
  'disabled:bg-neutral-400 disabled:cursor-not-allowed disabled:text-black';

function SignOutButton() {
  const { status } = useSession();

  const [signingOut, setSigningOut] = useState(false);

  const isLoading = status === 'loading' || signingOut;

  const handleClick = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setSigningOut(true);

    signOut().finally(() => setSigningOut(false));
  }, [isLoading]);

  return (
    <button
      className={clsx(defaultClassNames, hoverClassNames, disabledClassNames)}
      onClick={handleClick}
      disabled={isLoading}
    >
      Sign Out
    </button>
  );
}

export default memo(SignOutButton);
