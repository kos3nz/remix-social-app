import {
  ActionFunction,
  Links,
  LiveReload,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'remix';
import type { MetaFunction, LinksFunction, LoaderFunction } from 'remix';
import type { ReactNode } from 'react';
import globalStyles from '~/styles/global.css';
import tailwindStyles from '~/tailwind.css';
import { getUser } from '~/utils/session.server';
import { colorSchemeCookie, getColorScheme } from './themeCookie';
import Header from './components/Header';

export const meta: MetaFunction = () => {
  const title = 'Remix blog';
  const description = 'A cool blog built with Remix';
  const keywords = 'remix, react, javascript';

  return { title, description, keywords };
};

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: globalStyles,
  },
  {
    rel: 'stylesheet',
    href: tailwindStyles,
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const colorScheme = await getColorScheme(request);
  const user = await getUser(request);
  return { user, colorScheme };
};

export const action: ActionFunction = async ({ request }) => {
  const currentColorScheme = await getColorScheme(request);
  const newColorScheme = currentColorScheme === 'light' ? 'dark' : 'light';

  return redirect(request.url, {
    headers: {
      'Set-Cookie': await colorSchemeCookie.serialize(newColorScheme),
    },
  });
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

type DocumentProps = { children: ReactNode };

function Document({ children }: DocumentProps) {
  const { colorScheme } = useLoaderData();

  return (
    <html lang="en" className={colorScheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

type LayoutProps = { children?: ReactNode };

function Layout({ children }: LayoutProps) {
  const { user, colorScheme } = useLoaderData();

  return (
    <>
      {/* <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>
        <Form method="post">
          <button type="submit">Change Theme</button>
        </Form>

        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method="POST">
                <button className="btn" type="submit">
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav> */}
      <Header theme={colorScheme} />

      <div className="h-full">{children}</div>
    </>
  );
}

type ErrorBoundaryProps = { error: Error };

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  console.log(error);

  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
      </Layout>
    </Document>
  );
}
