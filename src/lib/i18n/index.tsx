import { Link as TanStackLink } from '@tanstack/react-router';
import { type ComponentProps } from 'react';
import { type TLocaleCode } from './type';

export type TLinkProps = Omit<ComponentProps<typeof TanStackLink>, 'to'> & {
  locale: TLocaleCode;
  to: string;
};

export const Link = ({ locale, to, ...props }: TLinkProps) => {
  return (
    <TanStackLink {...props} to={`/${locale}${to}` as never}>
      {props.children}
    </TanStackLink>
  );
};
