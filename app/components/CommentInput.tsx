import { useFetcher } from 'remix';
import { useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { Spinner } from './Spinner';

type Props = { postId: string; close: () => void };

const CommentInput = ({ postId, close }: Props) => {
  const publishComment = useFetcher();
  const [comment, setComment] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    if (comment.length > 150)
      setComment((comment) => comment.substring(0, 150));
  }, [comment]);

  useEffect(() => {
    if (publishComment.type === 'done') {
      close();
    }
  }, [publishComment]);

  return (
    <publishComment.Form action="/api/feed/publish" method="post">
      <div className="mx-2.5 flex flex-col border-t border-gray-400/60 pt-2">
        <textarea
          ref={ref}
          name="comment"
          rows={3}
          placeholder="Comment for this post?"
          className="flex-1 rounded-md bg-gray-100 p-2 outline-none transition focus:ring-2 focus:ring-gray-800 dark:bg-black/30 dark:text-white dark:placeholder-white/75 dark:caret-white dark:focus:ring-white/80"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end gap-x-4 px-2 pt-3 pb-1 text-black/60 dark:text-white/75">
          <p>{comment.length} / 150</p>
          <button
            type="submit"
            className="text-sky-500 transition-opacity hover:opacity-80 disabled:text-gray-500"
            disabled={!comment.trim() || publishComment.state !== 'idle'}
            aria-label="Publish comment"
            title="Publish comment"
          >
            {publishComment.state === 'idle' ? (
              <FaPaperPlane className="h-5 w-5" />
            ) : (
              <Spinner />
            )}
          </button>
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="_action" value="PUBLISH_COMMENT" />
        </div>
      </div>
    </publishComment.Form>
  );
};

export default CommentInput;
