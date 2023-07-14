import { createCookieSessionStorage, redirect } from 'remix';
import { db } from './db.server';

// Get session secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('No Session Secret');
}

// Create session storage
export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: 'remix_session',
      secure: process.env.NODE_ENV === 'production',
      secrets: [sessionSecret],
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
    },
  });

// Create session
export async function createUserSession(
  userId: string,
  jwt: string,
  redirectTo: string
) {
  const session = await getSession();
  session.set('userId', userId);
  session.set('access_token', jwt);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

// Get user session
export function getUserSession(request: Request) {
  return getSession(request.headers.get('Cookie'));
}

// Get logged in user
export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') {
    return null;
  }

  try {
    return await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        likes: {
          select: {
            postId: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);

    // return null;
    throw error;
  }
}

// Authentication
export async function redirectUser(
  request: Request,
  options: { redirect: string }
) {
  const user = await getUser(request);
  if (user) {
    throw redirect(options.redirect);
  }
  return null;
}

export async function requireUser(
  request: Request,
  options: { redirect: string }
) {
  const user = await getUser(request);
  if (!user) {
    throw redirect(options.redirect);
  }
  return user;
}

export async function logout(request: Request, opts: { redirect: string }) {
  const session = await getSession(request.headers.get('Cookie'));
  return redirect(opts.redirect, {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}
