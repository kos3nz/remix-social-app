import { createCookieSessionStorage, redirect } from 'remix';
import bcrypt from 'bcryptjs';
import { db } from './db.server';

type LoginForm = {
  username: string;
  password: string;
};

// Login user
export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return null;

  // Check password
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return user;
}

// Register new user
export async function register({ username, password }: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: {
      username,
      passwordHash,
    },
  });
}

// Get session secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('No Session Secret');
}

// Create session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: 'remix_blog_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true,
  },
});

// Create session
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

// Get user session
function getUserSession(req: Request) {
  return storage.getSession(req.headers.get('Cookie'));
}

// Get logged in user
export async function getUser(req: Request) {
  const session = await getUserSession(req);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') {
    return null;
  }

  try {
    return await db.user.findUnique({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    return null;
  }
}

// Log out user and destroy session
export async function logout(req: Request) {
  const session = await getUserSession(req);
  return redirect('/auth/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}
