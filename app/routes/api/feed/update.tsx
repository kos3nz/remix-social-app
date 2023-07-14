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

  const formData = await request.formData();
  const action = formData.get('_action');

  switch (action) {
    case 'UPDATE_POST': {
      try {
        const text = formData.get('text') as string;
        const photoUrl = formData.get('photoUrl') as string;
        const postId = formData.get('postId') as string;
        const authorId = formData.get('authorId');

        if (user.id !== authorId) break;

        await db.post.update({
          where: {
            id: postId,
          },
          data: { text, photoUrl },
        });

        return json(
          { message: 'Updated successfully' },
          {
            status: 201,
          }
        );
      } catch (error) {
        throw error;
      }
    }
    default: {
      break;
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
