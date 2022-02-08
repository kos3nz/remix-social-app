import { Link, redirect, useActionData, json } from 'remix';
import type { ActionFunction, MetaFunction } from 'remix';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';
import { convertToSlug, validateField, badRequest } from '~/utils/functions';

// server-side
export const meta: MetaFunction = () => ({ title: 'Create a new post!' });

// this function gets called after clicking submit button
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const title = form.get('title') as string;
  const body = form.get('body') as string;
  const slug = title && convertToSlug(title);
  const fields = { title, body, slug };
  const user = await getUser(request);

  const fieldErrors = {
    title: validateField(title, 3),
    body: validateField(body, 10),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  if (!user)
    return badRequest({
      fields,
      fieldErrors: { title: 'You must login first to publish a post' },
    });

  const post = await db.post.create({ data: { ...fields, userId: user.id } });

  return redirect(`/posts/${post.slug}`);
};

// client-side
export default function NewPost() {
  const actionData = useActionData();

  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={actionData?.fields?.title}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.title && actionData.fieldErrors.title}
              </p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea
              name="body"
              id="body"
              defaultValue={actionData?.fields?.body}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.body && actionData.fieldErrors.body}
              </p>
            </div>
          </div>
          <button className="btn btn-block" type="submit">
            Add posts
          </button>
        </form>
      </div>
    </>
  );
}
