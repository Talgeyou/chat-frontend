import React, { memo, useCallback, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { IoLogOutOutline } from 'react-icons/io5';
import Button from '@/shared/ui/button';

type Props = {
  disabled?: boolean;
};

function SignOutButton({ disabled }: Props) {
  const { t } = useTranslation(['common']);
  const { status } = useSession();

  const [signingOut, setSigningOut] = useState(false);

  const isLoading = status === 'loading' || signingOut;

  const handleClick = useCallback(async () => {
    if (isLoading || disabled) {
      return;
    }

    setSigningOut(true);

    signOut().finally(() => setSigningOut(false));
  }, [disabled, isLoading]);

  return (
    <Button
      onClick={handleClick}
      addonAfter={<IoLogOutOutline size={18} />}
      disabled={disabled}
      isLoading={isLoading}
      variant={'danger'}
    >
      {t('sign_out')}
    </Button>
  );
}

export default memo(SignOutButton);
