import type { LinksFunction, MetaFunction } from 'remix';
import HeaderLink from '~/components/HeaderLink';
import {
  MdOutlineExplore,
  MdOndemandVideo,
  MdOutlineBusiness,
  MdPeople,
} from 'react-icons/md';
import { HiChevronRight } from 'react-icons/hi';

export const meta: MetaFunction = () => {
  const title = 'Fake LinkedIn';

  return { title };
};

export const links: LinksFunction = () => [];

function Home() {
  return (
    <div className="relative space-y-10">
      <header className="flex items-center justify-around py-4">
        <div className="relative h-10 w-36">
          <img src="https://rb.gy/vtbzlp" alt="header" />
        </div>
        <div className="flex items-center divide-gray-300 sm:divide-x">
          <div className="hidden space-x-8 pr-4 sm:flex">
            <HeaderLink Icon={MdOutlineExplore} text="Discover" />
            <HeaderLink Icon={MdPeople} text="People" />
            <HeaderLink Icon={MdOndemandVideo} text="Learning" />
            <HeaderLink Icon={MdOutlineBusiness} text="Jobs" />
          </div>
          <div className="pl-4">
            <button className="rounded-full px-5 py-1.5 font-semibold text-blue-700 ring-1 ring-blue-700 transition-all hover:ring-2">
              Sign in
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-screen-lg flex-col items-center xl:flex-row">
        <div className="space-y-6 xl:space-y-10">
          <h1 className="max-w-2xl pl-4 text-3xl !leading-snug text-amber-800/80 md:text-5xl xl:pl-0">
            Welcome to your professional community
          </h1>
          <div className="space-y-4">
            <div className="intent">
              <h2 className="text-xl">Search for a job</h2>
              <HiChevronRight className="h-7 w-7 text-gray-700" aria-hidden />
            </div>
            <div className="intent">
              <h2 className="text-xl">Find a person you know</h2>
              <HiChevronRight className="h-7 w-7 text-gray-700" aria-hidden />
            </div>
            <div className="intent">
              <h2 className="text-xl">Learn a new skill</h2>
              <HiChevronRight className="h-7 w-7 text-gray-700" aria-hidden />
            </div>
          </div>
        </div>

        <div className="relative h-80 w-80 xl:absolute xl:top-16 xl:right-5 xl:h-[650px] xl:w-[650px]">
          <img src="https://rb.gy/vkzpzt" alt="banner" />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

export default Home;
