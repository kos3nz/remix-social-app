import { ActionFunction, LoaderFunction } from 'remix';
import { logout } from '~/utils/session.server';

export const action: ActionFunction = async ({ request }) => {
  return logout(request, { redirect: '/login' });
};

export const loader: LoaderFunction = async ({ request }) => {
  return logout(request, { redirect: '/login' });
};
