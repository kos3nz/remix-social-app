import { motion } from 'framer-motion';
import { BsLinkedin, BsPersonCircle } from 'react-icons/bs';
import { HiSearch } from 'react-icons/hi';
import { AiOutlineAppstore } from 'react-icons/ai';
import {
  MdHomeFilled,
  MdMessage,
  MdNotifications,
  MdOutlineBusiness,
  MdPeople,
} from 'react-icons/md';
import HeaderLink from './HeaderLink';
import { Form } from 'remix';

interface HeaderProps {
  theme: 'light' | 'dark';
}

const Header = ({ theme }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-around bg-white py-1.5 px-3 focus-within:shadow-lg dark:bg-[#1D2226]">
      {/* Left */}
      <div className="flex w-full max-w-xs items-center space-x-2">
        <div>
          <BsLinkedin
            className="h-12 w-12 text-sky-600 dark:text-white"
            aria-hidden
          />
        </div>
        <div className="flex w-full items-center space-x-1 rounded py-2.5 px-4 dark:md:bg-gray-700">
          <HiSearch className="dark:text-white" />
          <input
            type="text"
            placeholder="Search"
            className="hidden flex-grow bg-transparent text-sm placeholder-black/70 focus:outline-none dark:placeholder-white/75 md:inline-flex"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-6">
        <HeaderLink Icon={MdHomeFilled} text="Home" feed active />
        <HeaderLink Icon={MdPeople} text="My network" feed />
        <HeaderLink Icon={MdOutlineBusiness} text="Jobs" feed hidden />
        <HeaderLink Icon={MdMessage} text="Messaging" feed />
        <HeaderLink Icon={MdNotifications} text="Notifications" feed />
        <HeaderLink Icon={BsPersonCircle} text="Me" feed hidden />
        <HeaderLink Icon={AiOutlineAppstore} text="Work" feed hidden />

        {/* Dark mode toggle */}
        <Form method="post" className="rounded-full">
          <button
            aria-label={`Change to ${
              theme === 'light' ? 'dark' : 'light'
            } mode`}
            title={`Change to ${theme === 'light' ? 'dark' : 'light'} mode`}
            type="submit"
            className={`group relative flex h-6 w-12 flex-shrink-0 cursor-pointer items-center rounded-full bg-gray-600 px-0.5 focus:outline-none ${
              theme === 'dark' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* absolute elements are not affected by "justify-start" or "justify-end" */}
            <span className="absolute left-0" aria-hidden>
              🌜
            </span>
            <span className="absolute right-0.5" aria-hidden>
              🌞
            </span>
            <motion.span
              className="z-10 h-5 w-5 rounded-full bg-white group-focus:ring-4 group-focus:ring-sky-600"
              layout
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            />
          </button>
        </Form>
      </div>
    </header>
  );
};

export default Header;
