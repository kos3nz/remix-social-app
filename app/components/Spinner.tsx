import clsx from 'clsx';
import { CgSpinner } from 'react-icons/cg';

type Props = {
  color?: string;
};

export const Spinner = ({ color = 'text-sky-500' }: Props) => {
  return (
    <CgSpinner
      className={clsx('xs:h-8 xs:w-8 h-6 w-6 animate-spin', color)}
      aria-hidden
    />
  );
};
