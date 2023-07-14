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
    case 'LIKE': {
      try {
        const postId = formData.get('postId') as string;

        const post = await db.post.findUnique({
          where: {
            id: postId,
          },
          include: {
            likes: {
              select: {
                id: true,
                userId: true,
              },
            },
          },
        });

        const alreadyLiked = post?.likes.find(
          (like) => like.userId === user.id
        );

        if (!alreadyLiked) {
          await db.like.create({
            data: { userId: user.id, postId: postId },
          });
          await db.post.update({
            where: { id: postId },
            data: {
              likesCount: { increment: 1 },
            },
          });

          return json(
            { message: 'Liked' },
            {
              status: 201,
            }
          );
        } else if (alreadyLiked) {
          await db.like.delete({
            where: {
              id: alreadyLiked.id,
            },
          });
          await db.post.update({
            where: { id: postId },
            data: {
              likesCount: { decrement: 1 },
            },
          });

          return json(
            { message: 'Removed like' },
            {
              status: 200,
            }
          );
        }

        break;
      } catch (error) {
        return json(error, {
          status: 500,
        });
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
