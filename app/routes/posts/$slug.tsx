import { Link, redirect, useLoaderData } from 'remix';
import type { LoaderFunction, ActionFunction } from 'remix';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

type UserType = {
  id: string;
};

type PostType = {
  userId: string;
  title: string;
  body: string;
};

type LoaderData = {
  user: UserType;
  post: PostType;
};

// server-side
export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request);
  const post = await db.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) throw new Error('Post not found');

  return { user, post };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get('_method') === 'delete') {
    const user = await getUser(request);

    const post = await db.post.findUnique({
      where: { slug: params.slug },
    });

    if (!post) throw new Error('Post not found');

    if (user && post.userId === user.id) {
      await db.post.delete({ where: { slug: params.slug } });
    }

    return redirect('/posts');
  }
};

// client-side
export default function Post() {
  const { post, user } = useLoaderData<LoaderData>();

  return (
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">{post.body}</div>

      {user && post.userId === user.id && (
        <div className="page-footer">
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete">Delete</button>
          </form>
        </div>
      )}
    </div>
  );
}
