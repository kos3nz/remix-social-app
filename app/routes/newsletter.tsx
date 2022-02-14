import {
  ActionFunction,
  Form,
  Link,
  LinksFunction,
  useActionData,
} from 'remix';
import styles from '~/styles/routes/newsletter.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  return { subscription: true, email: data.email };
};

type Props = {};

export default function NewsLetter({}: Props) {
  const actionData = useActionData();

  const state = actionData?.subscription ? 'success' : 'idle';

  return (
    <main className="flex h-full items-center justify-center bg-gradient-to-r from-cyan-500 to-violet-500">
      <div className="newsletter w-full max-w-3xl rounded-md bg-white">
        <Form
          method="post"
          className="space-y-8"
          aria-hidden={state === 'success'}
        >
          <div className="space-y-1">
            <h2 className="text-center text-4xl font-bold text-slate-900">
              Subscribe!
            </h2>
            <p className="text-center text-xl font-thin text-slate-700">
              Don't miss any of the action!
            </p>
          </div>
          <fieldset className="flex justify-center space-x-2 text-lg">
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="rounded-md py-3 px-6 ring-1 ring-slate-500"
            />
            <button
              type="submit"
              className="rounded-md bg-violet-500 py-3 px-10 text-white"
            >
              Subscribe
            </button>
          </fieldset>
          <p className="text-center text-xl">
            {actionData?.subscription ? <>{actionData.email}</> : <>&nbsp;</>}
          </p>
        </Form>
        <div aria-hidden={state !== 'success'}>
          <Link to=".">back</Link>
        </div>
      </div>
    </main>
  );
}
