import type { User } from '@prisma/client';
import { motion } from 'framer-motion';
import {
  MdArticle,
  MdBusinessCenter,
  MdPhoto,
  MdVideocam,
} from 'react-icons/md';
import Avatar from './Avatar';

type Props = {
  handleDialog: () => void;
  user: User;
};

const PostInput = ({ handleDialog, user }: Props) => {
  return (
    <div className="space-y-3 rounded-lg border border-gray-300 bg-white p-3 dark:border-none dark:bg-[#1D2226]">
      <div className="flex items-center gap-x-2">
        <Avatar size="md" name={user.name} backgroundColor={user.color} />
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex-1 rounded-full py-2.5 px-3 text-left font-medium opacity-80 ring-1 ring-gray-400 hover:opacity-100"
          onClick={() => handleDialog()}
        >
          Start a post
        </motion.button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-x-10">
        <button className="input-button group">
          <MdPhoto className="text-blue-400" />
          <h4 className="opacity-80 transition-opacity duration-200 group-hover:opacity-100">
            Photo
          </h4>
        </button>
        <button className="input-button group">
          <MdVideocam className="text-cyan-400" />
          <h4 className="opacity-80 transition-opacity duration-200 group-hover:opacity-100">
            Video
          </h4>
        </button>
        <button className="input-button group">
          <MdBusinessCenter className="text-green-400" />
          <h4 className="opacity-80 transition-opacity duration-200 group-hover:opacity-100">
            Job
          </h4>
        </button>
        <button className="input-button group">
          <MdArticle className="text-red-400" />
          <h4 className="opacity-80 transition-opacity duration-200 group-hover:opacity-100">
            Write Article
          </h4>
        </button>
      </div>
    </div>
  );
};

export default PostInput;
