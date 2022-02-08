import { useLoaderData, Link, LoaderFunction } from 'remix';
import { db } from '~/utils/db.server';

export type Post = {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
};

// server-side code
export const loader: LoaderFunction = async () => ({
  posts: await db.post.findMany({
    take: 20,
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  }),
});

// client-side code
export default function PostItems() {
  const { posts } = useLoaderData<{ posts: Post[] }>();

  return (
    <div>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="new" className="btn">
          New Post
        </Link>
      </div>
      <ul className="posts-list">
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={post.slug}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString('ja-JP')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
