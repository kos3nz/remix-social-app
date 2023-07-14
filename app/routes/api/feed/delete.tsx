import { ActionFunction, json, redirect } from 'remix';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user) {
    return redirect('/login', {
      status: 400,
      statusText: 'You must login first to delete a post!',
    });
  }

  const formData = await request.formData();

  if (formData.get('_action') === 'DELETE_POST') {
    try {
      const postId = formData.get('postId') as string;

      await db.post.delete({ where: { id: postId } });

      return json(
        { message: 'The post has been deleted!' },
        {
          status: 200,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  if (formData.get('_action') === 'DELETE_COMMENT') {
    try {
      const commentId = formData.get('commentId') as string;

      await db.comment.delete({ where: { id: commentId } });

      return json(
        { message: 'The comment has been deleted!' },
        {
          status: 200,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  return json(
    { message: 'Something went wrong' },
    {
      status: 400,
      statusText: 'Something went wrong',
    }
  );
};
