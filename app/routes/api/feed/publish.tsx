import { ActionFunction, json, redirect } from 'remix';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user) {
    return redirect('/login', {
      status: 400,
      statusText: 'You must login first to publish a post!',
    });
  }

  // REVIEW: Bug: button value not submitted if form is inside a container that calls stopPropagation on the click event
  // Expected behavior: Object.fromEntries(formData) -> {text: 'foo', photoUrl: 'bar', _action: 'publish' }
  // Actual behavior: Object.fromEntries(formData) -> {text: 'foo', photoUrl: 'bar' }
  // built-in <form> element works normally.

  const formData = await request.formData();
  const action = formData.get('_action');

  if (action === 'PUBLISH_POST') {
    try {
      const text = formData.get('text') as string;
      const photoUrl = formData.get('photoUrl') as string;

      await db.post.create({
        data: { text, photoUrl, userId: user.id },
      });

      return json(
        { message: 'Published successfully' },
        {
          status: 201,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  if (action === 'PUBLISH_COMMENT') {
    try {
      const postId = formData.get('postId') as string;
      const comment = formData.get('comment') as string;

      await db.comment.create({
        data: { text: comment, postId, userId: user.id },
      });

      return json(
        { message: 'Published successfully' },
        {
          status: 201,
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
