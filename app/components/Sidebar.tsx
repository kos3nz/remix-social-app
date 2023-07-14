import { Form } from "remix";
import { MdAdd, MdOutlineBookmark } from "react-icons/md";
import { type User } from "@prisma/client";
import linkedinBackground from "~/assets/LinkedIn-Background.webp";
import Avatar from "./Avatar";

type Props = { user: User };

export default function Sidebar({ user }: Props) {
  return (
    <div className="min-w-max max-w-lg space-y-4">
      {/* Top */}
      <div className="relative flex flex-col items-center overflow-hidden rounded-lg border border-gray-300 bg-white text-center dark:border-none dark:bg-[#1D2226]">
        <div className="overflow relative h-14 w-full">
          <img src={linkedinBackground} alt="background" />
        </div>
        <Avatar className="absolute top-7" bordered name={user.name} />
        <div className="mt-5 space-x-0.5 py-4">
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="decoration-sky-700 decoration-2 underline-offset-1 hover:underline"
            >
              {user.name}
            </button>
          </Form>
          <p className="text-black/60 dark:text-white/75">{user.email}</p>
        </div>

        <div className="hidden text-left text-sm dark:text-white/75 md:inline">
          <div className="sidebar-button space-y-1 font-medium">
            <div className="flex justify-between space-x-2">
              <h4>Who viewed your profile</h4>
              <span className="text-sky-500">321</span>
            </div>
            <div className="flex justify-between space-x-2">
              <h4>Views of your post</h4>
              <span className="text-sky-500">1,892</span>
            </div>
          </div>

          <div className="sidebar-button space-y-1">
            <h4 className="text-xs">Access exclusive tools & insights</h4>
            <h4 className="flex items-center font-medium dark:text-white">
              <span className="mr-1 inline-block h-3 w-3 rounded-sm bg-gradient-to-tr from-yellow-600 to-yellow-200" />
              Try Premium for free
            </h4>
          </div>

          <div className="sidebar-button flex items-center space-x-1.5">
            <MdOutlineBookmark className="-ml-1 h-5 w-5" />
            <h4 className="font-medium dark:text-white">My items</h4>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="sticky top-[72px] hidden space-y-2 overflow-hidden rounded-lg border border-gray-300 bg-white pt-2.5 text-black/70 dark:border-none dark:bg-[#1D2226] dark:text-white/75 md:flex md:flex-col">
        <div className="flex items-center px-2">
          <span className="flex-1 space-y-2">
            <p className="sidebar-link">Groups</p>
            <p className="sidebar-link">Events</p>
            <p className="sidebar-link">Followed Hashtags</p>
          </span>
          <span>
            <MdAdd className="h-5 w-5" />
          </span>
        </div>
        <div className="sidebar-button text-center">
          <h4 className="text-sm font-medium dark:text-white">Discover More</h4>
        </div>
      </div>
    </div>
  );
}
