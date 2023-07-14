import {
  useActionData,
  Link,
  Form,
  type MetaFunction,
  type ActionFunction,
  type LoaderFunction,
} from 'remix';
import { db } from '~/utils/db.server';
import { createUserSession, redirectUser } from '~/utils/session.server';
import { validateField, badRequest } from '~/utils/functions';
import { BsGoogle } from 'react-icons/bs';
import { useRef, useState } from 'react';
import { supabase } from '~/utils/supabase';
import Footer from '~/components/Footer';

export const meta: MetaFunction = () => ({
  title: 'Sign in to Fake LinkedIn',
});

export const loader: LoaderFunction = async ({ request }) => {
  await redirectUser(request, { redirect: '/feed' });

  return {};
};

type ActionData =
  | {
      fields: {
        email: string;
        password: string;
      };
      fieldErrors?: {
        email: string | undefined;
        password: string | undefined;
      };
      formError?: string;
    }
  | undefined;

type FormFields = {
  email: string;
  password: string;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const fields = Object.fromEntries(form) as FormFields;
  const email = fields.email;
  const password = fields.password;

  // if validation error, return
  const fieldErrors = {
    email: validateField('Email', email, 3),
    password: validateField('Password', password, 6),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  // sign in the user
  const {
    session,
    user: sbUser,
    error,
  } = await supabase.auth.signIn({
    email,
    password,
  });

  // if error, return
  if (error) {
    return badRequest({ fields, formError: error.message });
  }

  const user = await db.user.findUnique({
    where: { id: sbUser?.id },
  });

  // if no error but no credentials, return
  if (!session || !user) {
    return badRequest({
      fields,
      formError: 'Something went wrong. Please try again later.',
    });
  }

  return createUserSession(user.id, session.access_token, '/feed');
};

function Login() {
  const actionData = useActionData<ActionData>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<HTMLInputElement>(null);

  const showPassword = () => {
    if (passwordRef.current) {
      const inputType = passwordRef.current.type;
      if (inputType === 'password') passwordRef.current.type = 'text';
      else passwordRef.current.type = 'password';
    }
  };

  return (
    <>
      <main className="flex h-full flex-col items-center justify-center">
        <div className="absolute top-10 left-12 h-8 w-32">
          <img
            src="https://rb.gy/vtbzlp"
            alt="header"
            className="object-contain"
          />
        </div>

        <div className="w-full max-w-max space-y-4 rounded-md bg-white py-6 px-5 shadow-lg">
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold">Sign in</h1>
            <p className="text-sm">Stay updated on your professional world</p>
          </div>
          <Form method="post">
            <div className="form-control mb-5">
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={actionData?.fields?.email}
                className="form-input peer"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className={`form-label bg-white peer-focus:-translate-y-6 peer-focus:-translate-x-1 peer-focus:scale-75 ${
                  email && '-translate-y-6 -translate-x-1 scale-75'
                }`}
              >
                Email
              </label>
              <div className="error-message">
                {actionData?.fieldErrors?.email && actionData.fieldErrors.email}
                {actionData?.formError && actionData.formError}
              </div>
            </div>
            <div className="form-control">
              <input
                ref={passwordRef}
                type="password"
                name="password"
                id="password"
                defaultValue={actionData?.fields?.password}
                className="form-input peer"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className={`form-label bg-white peer-focus:-translate-y-6 peer-focus:-translate-x-2 peer-focus:scale-75 ${
                  password && '-translate-y-6 -translate-x-2 scale-75'
                }`}
              >
                Password
              </label>
              <button
                type="button"
                className="absolute top-4 right-3 text-xs font-bold text-sky-600"
                onClick={showPassword}
              >
                Show
              </button>
              <div className="error-message">
                {actionData?.fieldErrors?.password &&
                  actionData.fieldErrors.password}
              </div>
            </div>

            <p className="mt-2 cursor-pointer text-sm font-bold text-sky-600">
              Forgot password?
            </p>

            <div className="mt-3">
              <button
                className="form-button bg-sky-600 text-white hover:bg-sky-700"
                type="submit"
              >
                Sign in
              </button>
            </div>

            <div className="my-3 flex items-center space-x-4">
              <span className="h-[1px] w-1/2 bg-black/10" />
              <span className="text-xs">or</span>
              <span className="h-[1px] w-1/2 bg-black/10" />
            </div>

            <div>
              <button
                className="form-button text-black/75 ring-1 ring-black/75 hover:bg-gray-100 hover:ring-black"
                type="submit"
              >
                <BsGoogle />
                Sign in with Google
              </button>
            </div>
          </Form>
        </div>

        <div className="mt-4 flex items-center gap-x-2">
          <p className="text-sm">New to LinkedIn?</p>
          <Link to="/" className="text-sm font-bold text-sky-600">
            Join now
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;
