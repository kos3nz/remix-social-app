import {
  Form,
  Link,
  useActionData,
  type ActionFunction,
  type LoaderFunction,
} from 'remix';
import HeaderLink from '~/components/HeaderLink';
import {
  MdOutlineExplore,
  MdOndemandVideo,
  MdOutlineBusiness,
  MdPeople,
} from 'react-icons/md';
import Footer from '~/components/Footer';
import { useRef, useState } from 'react';
import { badRequest, pickRandomColor, validateField } from '~/utils/functions';
import { supabase } from '~/utils/supabase';
import { createUserSession, redirectUser } from '~/utils/session.server';
import { db } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ request }) => {
  await redirectUser(request, { redirect: '/feed' });

  return {};
};

type ActionData =
  | {
      fields: FormFields;
      fieldErrors?: {
        name: string | undefined;
        email: string | undefined;
        password: string | undefined;
      };
      formError?: string;
    }
  | undefined;

type FormFields = {
  name: string;
  email: string;
  password: string;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const fields = Object.fromEntries(form) as FormFields;
  const name = fields.name;
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
  } = await supabase.auth.signUp({
    email,
    password,
  });

  // if sign-up error, return
  if (error || !session || !sbUser) {
    return badRequest({ fields, formError: error?.message });
  }

  // create the user in profiles table
  const user = await db.user.create({
    data: {
      id: sbUser.id,
      name,
      email,
      color: pickRandomColor(),
    },
  });

  // if error with creating user
  if (!user) {
    return badRequest({
      fields,
      formError: 'Something went wrong. Please try again later.',
    });
  }

  // all good, set session and move on
  return createUserSession(user.id, session.access_token, '/feed');
};

function Home() {
  const actionData = useActionData<ActionData>();
  const [name, setName] = useState('');
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
    <div className="relative p-4">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="relative h-10 w-36">
          <img
            src="https://rb.gy/vtbzlp"
            alt="header"
            className="object-contain"
          />
        </div>
        <div className="flex items-center divide-gray-300 sm:divide-x">
          <div className="hidden space-x-8 pr-4 sm:flex">
            <HeaderLink Icon={MdOutlineExplore} text="Discover" />
            <HeaderLink Icon={MdPeople} text="People" />
            <HeaderLink Icon={MdOndemandVideo} text="Learning" />
            <HeaderLink Icon={MdOutlineBusiness} text="Jobs" />
          </div>
          <div className="pl-4">
            <Link
              to="/login"
              className="block rounded-full px-5 py-1.5 font-semibold text-blue-700 ring-1 ring-blue-700 transition-all hover:ring-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto mt-8 max-w-6xl md:mt-16">
        <section className="flex flex-col items-center gap-y-10 lg:flex-row lg:flex-nowrap">
          <div className="flex-shrink-0 space-y-6 pl-4 xl:space-y-10">
            <h1 className="mb-10 max-w-2xl text-3xl font-light !leading-snug text-amber-800/80 md:text-4xl lg:text-5xl">
              Welcome to your professional community
            </h1>
            <Form method="post" className="mx-auto max-w-md space-y-4 lg:mx-0">
              <div className="form-control">
                <input
                  type="name"
                  name="name"
                  id="name"
                  defaultValue={actionData?.fields?.name}
                  className="form-input peer bg-gray-50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label
                  htmlFor="name"
                  className={`form-label bg-gray-50 peer-focus:-translate-y-6 peer-focus:scale-90 ${
                    name && '-translate-y-6 scale-90'
                  }`}
                >
                  Name
                </label>
                <div className="error-message">
                  {actionData?.fieldErrors?.name && actionData.fieldErrors.name}
                  {actionData?.formError && actionData.formError}
                </div>
              </div>
              <div className="form-control">
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={actionData?.fields?.email}
                  className="form-input peer bg-gray-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="email"
                  className={`form-label bg-gray-50 peer-focus:-translate-y-6 peer-focus:scale-90 ${
                    email && '-translate-y-6 scale-90'
                  }`}
                >
                  Email
                </label>
                <div className="error-message">
                  {actionData?.fieldErrors?.email &&
                    actionData.fieldErrors.email}
                </div>
              </div>
              <div className="form-control">
                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  id="password"
                  defaultValue={actionData?.fields?.password}
                  className="form-input peer bg-gray-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className={`form-label bg-gray-50 peer-focus:-translate-y-6 peer-focus:-translate-x-2 peer-focus:scale-90 ${
                    password && '-translate-y-6 -translate-x-2 scale-90'
                  }`}
                >
                  Password (6+ characters)
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

              <p className="text-sm">
                <span className="font-semibold text-red-600">
                  Pay attention: &nbsp;
                </span>
                This is a demo site. Please don&apos;t insert your real
                credentials here!!
              </p>

              <div className="mt-3">
                <button
                  className="form-button bg-sky-600 text-base text-white hover:bg-sky-700"
                  type="submit"
                >
                  Agree & Join
                </button>
              </div>
            </Form>
          </div>

          <div className="hidden h-[350px] w-[550px] flex-shrink-0 sm:block lg:h-[560px] lg:w-[700px]">
            <img
              src="https://rb.gy/vkzpzt"
              alt="banner"
              className="object-contain"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
