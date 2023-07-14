import {
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
import tailwindStyles from '~/tailwind.css';
import { getUser } from '~/utils/session.server';
import { type User } from '@prisma/client';
import clsx from 'clsx';
import { getColorScheme } from './utils/theme.server';

export const meta: MetaFunction = () => {
  const title = 'Fake LinkedIn: Remix Social App';
  const description = 'A cool social app built with Remix';
  const keywords = 'remix, react, javascript';

  return { title, description, keywords };
};

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: tailwindStyles,
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const pathname = new URL(request.url).pathname;
  const colorScheme = await getColorScheme(request);

  return { colorScheme, pathname };
};

type DocumentProps = { children: ReactNode };

function Document({ children }: DocumentProps) {
  const { colorScheme, pathname } = useLoaderData();

  return (
    <html
      lang="en"
      className={clsx({
        [colorScheme]: pathname !== '/' && pathname !== '/login',
      })}
    >
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

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

type ErrorBoundaryProps = {
  error: Error;
};

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  console.log(error);

  return (
    <Document>
      <main className="flex h-full items-center justify-center text-lg">
        <h1 className="font-bold text-red-500">Error: &nbsp;</h1>
        <p>{error.message}</p>
      </main>
    </Document>
  );
}
