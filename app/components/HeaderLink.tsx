import { IconType } from 'react-icons';

type Props = {
  Icon: IconType;
  text?: string;
  avatar?: boolean;
  feed?: boolean;
  active?: boolean;
  hidden?: boolean;
};

export default function HeaderLink({
  Icon,
  text,
  feed,
  avatar,
  active,
  hidden,
}: Props) {
  return (
    <div
      className={`${
        hidden && 'hidden md:inline-flex '
      } flex cursor-pointer flex-col items-center justify-center ${
        feed
          ? 'space-y-1 text-black/60 hover:text-black dark:text-white/75 dark:hover:text-white lg:-mb-1.5'
          : 'text-gray-500 hover:text-gray-700'
      } ${active && 'text-black dark:text-white'}`}
    >
      {avatar ? (
        <Icon className="!h-7 !w-7 lg:!-mb-1" aria-hidden />
      ) : (
        <Icon aria-hidden />
      )}
      <h4
        className={`text-sm capitalize ${feed && 'hidden text-center lg:flex'}`}
      >
        {text}
      </h4>
      {active && (
        <span className="hidden h-0.5 w-[calc(100%+20px)] rounded-t-full bg-black dark:bg-white lg:inline-flex" />
      )}
    </div>
  );
}
