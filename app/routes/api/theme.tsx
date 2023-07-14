import { ActionFunction, json, LoaderFunction, redirect } from 'remix';
import { colorSchemeCookie, getColorScheme } from '~/utils/theme.server';

export const action: ActionFunction = async ({ request }) => {
  // get current color scheme
  const currentColorScheme = await getColorScheme(request);
  const newColorScheme = currentColorScheme === 'light' ? 'dark' : 'light';

  return json(null, {
    headers: {
      'Set-Cookie': await colorSchemeCookie.serialize(newColorScheme),
    },
  });
};

export const loader: LoaderFunction = async ({}) => {
  return redirect('/feed');
};
