import { useFetcher } from 'remix';
import { useCallback, useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';
import { HiDotsHorizontal } from 'react-icons/hi';
import { MdClose, MdOutlineComment } from 'react-icons/md';
import { AiFillDelete, AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BsReplyFill } from 'react-icons/bs';
import Avatar from './Avatar';
import { truncate } from '~/utils/functions';
import { DialogCloseButton } from './Dialog';
import clsx from 'clsx';
import { User } from '@prisma/client';
import type { PostSelect } from '~/routes/feed/index';
import CommentInput from './CommentInput';
import Comment from './Comment';

type Props = {
  user: User & {
    likes: {
      postId: string;
    }[];
  };
  post: PostSelect;
  isDialogPost?: boolean;
  handlePostDialog?: (post: PostSelect) => void;
  handleInputDialog?: (post: PostSelect) => void;
  handleClose?: () => void;
};

const Post = ({
  user,
  post,
  isDialogPost,
  handlePostDialog,
  handleInputDialog,
  handleClose,
}: Props) => {
  const like = useFetcher();
  const deletePost = useFetcher();
  const [showInput, setShowInput] = useState(false);
  const [liked, setLiked] = useState(
    user.likes.some((like) => like.postId === post.id)
  );
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showCommentInput, setShowCommentInput] = useState(false);

  const closeCommentInput = useCallback(() => {
    setShowCommentInput(false);
  }, []);

  useEffect(() => {
    if (isDialogPost && deletePost.type === 'done' && handleClose)
      handleClose();
  }, [deletePost]);

  return (
    <div
      className={`space-y-2 border border-gray-300 bg-gray-50 py-2.5 dark:border-none dark:bg-[#1D2226] ${
        isDialogPost ? 'rounded-r-lg' : 'rounded-lg'
      }`}
    >
      {/* Post header */}
      <div className="mb-3 flex items-center px-2.5">
        <Avatar
          size="md"
          backgroundColor={post.user.color}
          name={post.user.name}
        />
        <div className="mr-auto ml-2 leading-none">
          <h6 className="mb-1 cursor-pointer font-medium hover:text-sky-500 hover:underline dark:text-white/90 dark:hover:text-sky-500">
            {post.user.name || 'Anonymous'}
          </h6>
          <TimeAgo
            date={post.createdAt}
            minPeriod={60}
            className="text-xs opacity-80 dark:text-white/75"
          />
        </div>
        {isDialogPost ? (
          <DialogCloseButton>
            <MdClose className="h-6 w-6 dark:text-white/75" />
          </DialogCloseButton>
        ) : post.user.id === user.id ? (
          <button
            onClick={() => {
              if (handleInputDialog) handleInputDialog(post);
            }}
          >
            <HiDotsHorizontal className="h-6 w-6 text-gray-400 transition-colors hover:text-black dark:text-white/75 hover:dark:text-white" />
          </button>
        ) : null}
      </div>

      {/* Texts */}
      {post.text && (
        <div className="break-all px-2.5 py-2 dark:text-white md:break-normal">
          {isDialogPost || showInput ? (
            <p onClick={() => setShowInput(false)}>{post.text}</p>
          ) : (
            <p onClick={() => setShowInput(true)}>
              {truncate(post.text, 150)}
              {post.text.length > 150 && (
                <span className="cursor-pointer text-sky-500 decoration-sky-500 hover:underline">
                  see more
                </span>
              )}
            </p>
          )}
        </div>
      )}

      {/* Image */}
      {post.photoUrl && !isDialogPost && (
        <div className="aspect-square bg-gray-600">
          <img
            src={post.photoUrl}
            alt="photo"
            className="cursor-pointer"
            onClick={() => {
              if (handlePostDialog) handlePostDialog(post);
            }}
          />
        </div>
      )}

      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="mx-2.5 flex flex-col justify-center gap-y-4 border-t border-gray-400/60 pt-2 text-black/60 dark:text-white/80">
          {post.comments.map((comment) => (
            <Comment key={comment.id} user={user} comment={comment} />
          ))}
        </div>
      )}

      {/* Comment input */}
      {showCommentInput && (
        <CommentInput postId={post.id} close={closeCommentInput} />
      )}

      {/* Buttons */}
      <div className="mx-2.5 flex items-center justify-evenly border-t border-gray-400/60 pt-2 text-black/60 dark:text-white/75">
        <like.Form method="post" action="/api/feed/like" className="w-full">
          <input type="hidden" name="_action" value="LIKE" />
          <input type="hidden" name="postId" value={post.id} />
          <button
            type="submit"
            onClick={() => {
              setLiked((liked) => !liked);
              if (liked) setLikesCount((count) => count - 1);
              else setLikesCount((count) => count + 1);
            }}
            className={clsx(
              'post-button hover:text-sky-500',
              liked && 'text-sky-500'
            )}
            aria-label="Hit like"
            title="Hit like"
          >
            {liked ? (
              <AiFillLike className="h-5 w-5 -scale-x-100" />
            ) : (
              <AiOutlineLike className="h-5 w-5 -scale-x-100" />
            )}

            <h4>{likesCount > 0 ? `${likesCount}` : 'Like'}</h4>
          </button>
        </like.Form>

        <button
          className="post-button hover:text-emerald-500"
          type="button"
          aria-label="Insert comment"
          title="Insert comment"
          onClick={() => setShowCommentInput((show) => !show)}
        >
          <MdOutlineComment className="h-5 w-5" />
          <h4>Comment</h4>
        </button>

        {user.id === post.user.id ? (
          <deletePost.Form
            action="/api/feed/delete"
            method="post"
            className="w-full"
          >
            <input type="hidden" name="_action" value="DELETE_POST" />
            <input type="hidden" name="postId" value={post.id} />
            <button
              className="post-button hover:text-red-400 disabled:text-gray-600"
              aria-label="Delete post"
              title="Delete post"
              disabled={deletePost.state !== 'idle'}
            >
              <AiFillDelete className="h-5 w-5" aria-hidden />
              <h4>Delete</h4>
            </button>
          </deletePost.Form>
        ) : (
          <button className="post-button hover:text-indigo-400">
            <BsReplyFill className="h-5 w-5" />
            <h4>Share</h4>
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
