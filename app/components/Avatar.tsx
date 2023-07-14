import React from 'react';

type Props = {
  src?: string;
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  borderColor?: 'gradient';
  backgroundColor?: string;
};

const Avatar = ({
  src,
  name = 'K',
  size = 'lg',
  bordered = false,
  borderColor = 'gradient',
  backgroundColor = '#000',
  className,
}: Props) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${
        bordered && `${sizes[size].border} ${borderColors[borderColor]}`
      } ${className}`}
    >
      <div className={`overflow-hidden rounded-full ${sizes[size].avatar}`}>
        <img
          src={
            src ||
            `https://avatars.dicebear.com/api/initials/${name.substring(
              0,
              1
            )}.svg?background=%23${backgroundColor.slice(1)}`
          }
          alt="user"
        />
      </div>
    </div>
  );
};

export default Avatar;

const sizes = {
  sm: {
    border: 'h-9 w-9',
    avatar: 'h-8 w-8',
  },
  md: {
    border: 'h-10 w-10',
    avatar: 'h-9 w-9',
  },
  lg: {
    border: 'h-12 w-12',
    avatar: 'h-11 w-11',
  },
};

const borderColors = {
  gradient: 'bg-gradient-to-r from-cyan-500 to-indigo-500',
};
