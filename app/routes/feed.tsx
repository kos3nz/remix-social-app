import { Outlet, useLoaderData, type LoaderFunction } from 'remix';
import Header from '~/components/Header';
import { requireUser } from '~/utils/session.server';
import { type ColorScheme, getColorScheme } from '~/utils/theme.server';

type LoaderData = {
  colorScheme: ColorScheme;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request, { redirect: '/login' });

  const colorScheme = await getColorScheme(request);

  return { colorScheme };
};

export default function Feed() {
  const { colorScheme } = useLoaderData<LoaderData>();

  return (
    <div>
      <Header theme={colorScheme} />
      <Outlet />
    </div>
  );
}
