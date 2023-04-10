import React, { type ComponentProps, memo, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { ImSpinner8 } from 'react-icons/im';
import { classNames } from '@/shared/lib';

const variants = cva(
  'flex gap-2 items-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus:outline-none ring-purple-500 disabled:bg-neutral-400 disabled:cursor-not-allowed disabled:hover:bg-neutral-400 disabled:active:bg-neutral-400',
  {
    variants: {
      variant: {
        primary:
          'bg-purple-500 text-white hover:bg-purple-400 active:bg-purple-400',
        danger: 'bg-red-500 text-white hover:bg-red-400 active:bg-red-400',
        ghost:
          'bg-white text-black hover:bg-purple-400 active:bg-purple-400 hover:text-white active:text-white',
      },
      size: {
        sm: 'text-sm p-2',
        md: 'text-md p-3',
        lg: 'text-lg p-4',
      },
    },
    defaultVariants: {
      size: 'sm',
      variant: 'primary',
    },
  },
);

type OwnProps = {
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  isLoading?: boolean;
} & VariantProps<typeof variants>;

type Props = OwnProps & Omit<ComponentProps<'button'>, keyof OwnProps>;

const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      children,
      size,
      variant,
      addonBefore,
      addonAfter,
      isLoading,
      disabled,
      ...otherProps
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(className, variants({ size, variant }))}
        disabled={isLoading || disabled}
        {...otherProps}
      >
        {isLoading && addonBefore ? (
          <ImSpinner8
            size={size === 'lg' ? 32 : size === 'md' ? 24 : 18}
            className="animate-spin"
          />
        ) : (
          addonBefore ?? null
        )}
        {children}
        {isLoading && addonAfter ? (
          <ImSpinner8
            size={size === 'lg' ? 32 : size === 'md' ? 24 : 18}
            className="animate-spin"
          />
        ) : (
          addonAfter ?? null
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default memo(Button);
