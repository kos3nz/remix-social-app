import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useFetcher } from 'remix';
import { PostSelect } from '~/routes/feed/index';
import { DialogCloseButton } from './Dialog';
import { Spinner } from './Spinner';

type Props = {
  post?: PostSelect;
  handleClose: () => void;
};

const PostForm = ({ post, handleClose }: Props) => {
  const upsertPost = useFetcher();
  const [text, setText] = useState(post?.text || '');
  const [photoUrl, setPhotoUrl] = useState(post?.photoUrl || '');
  const isUpdating = post !== null;

  useEffect(() => {
    if (upsertPost.type === 'done') {
      handleClose();
    }
  }, [upsertPost]);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
        <h4 className="text-xl font-semibold text-black/75 dark:text-white">
          {isUpdating ? 'Update this post' : 'Create a post'}
        </h4>
        <DialogCloseButton>
          <MdClose className="h-6 w-6 dark:text-white/75" />
        </DialogCloseButton>
      </div>

      <div className="space-y-2 p-4">
        <upsertPost.Form
          action={isUpdating ? '/api/feed/update' : '/api/feed/publish'}
          method="post"
          className="relative flex flex-col space-y-3 text-black/80 dark:text-white/75"
        >
          <textarea
            name="text"
            rows={4}
            placeholder="What do you want to talk about?"
            className="rounded-md bg-gray-100 p-2 outline-none transition focus:ring-2 focus:ring-gray-800 dark:bg-black/30 dark:text-white dark:placeholder-white/75 dark:caret-white dark:focus:ring-white/80"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="text"
            name="photoUrl"
            placeholder="Add a photo URL (optional)"
            className="max-w-xs truncate rounded-md bg-transparent px-2 py-1 outline-none transition focus:ring-2 focus:ring-gray-800 dark:text-white dark:placeholder-white/75 dark:caret-white dark:focus:ring-white/80 md:max-w-sm"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <input
            type="hidden"
            name="_action"
            value={isUpdating ? 'UPDATE_POST' : 'PUBLISH_POST'}
          />
          {isUpdating && (
            <>
              <input type="hidden" name="postId" value={post?.id} />
              <input type="hidden" name="authorId" value={post?.user.id} />
            </>
          )}
          <button
            type="submit"
            aria-label={isUpdating ? 'Update post' : 'Publish post'}
            title={isUpdating ? 'Update post' : 'Publish post'}
            className="absolute bottom-0 right-0 rounded-full bg-sky-500 py-1 px-3.5 font-bold text-white transition-colors hover:bg-sky-600 disabled:bg-gray-700 disabled:text-white/40"
            disabled={
              (!text.trim() && !photoUrl.trim()) || upsertPost.state !== 'idle'
            }
          >
            {upsertPost.state === 'idle' ? (
              isUpdating ? (
                'Update'
              ) : (
                'Post'
              )
            ) : (
              <Spinner />
            )}
          </button>
        </upsertPost.Form>
      </div>
    </div>
  );
};

export default PostForm;
