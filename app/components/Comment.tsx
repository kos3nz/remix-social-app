import { useFetcher } from 'remix';
import Timeago from 'react-timeago';
import { AiFillDelete } from 'react-icons/ai';
import Avatar from './Avatar';
import clsx from 'clsx';

type Props = {
  user: { id: string };
  comment: {
    id: string;
    text: string;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      color: string;
    };
  };
};

const Comment = ({ user, comment }: Props) => {
  const deleteComment = useFetcher();
  const isDeletingComment =
    deleteComment.submission?.formData.get('commentId') === comment.id;

  return (
    <div
      className={clsx('flex w-full gap-x-2', isDeletingComment && 'opacity-50')}
    >
      <Avatar
        size="sm"
        name={comment.user.name}
        backgroundColor={comment.user.color}
      />
      <div className="flex flex-1 flex-col justify-center break-all">
        <p>
          <span className="pr-2 font-bold">{comment.user.name}</span>
          {comment.text}
        </p>
        <Timeago
          date={comment.createdAt}
          minPeriod={60}
          className="text-xs opacity-80 dark:text-white/75"
        />
      </div>
      {user.id === comment.user.id && (
        <deleteComment.Form
          action="/api/feed/delete"
          method="post"
          className="flex items-center"
        >
          <input type="hidden" name="_action" value="DELETE_COMMENT" />
          <input type="hidden" name="commentId" value={comment.id} />
          <button
            type="submit"
            className="transition-colors hover:text-red-400 disabled:text-gray-600"
            aria-label="Delete comment"
            title="Delete comment"
          >
            <AiFillDelete className="h-5 w-5" aria-hidden />
          </button>
        </deleteComment.Form>
      )}
    </div>
  );
};

export default Comment;
