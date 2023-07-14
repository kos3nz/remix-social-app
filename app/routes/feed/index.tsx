import { useCallback, useEffect, useState } from 'react';
import { type LoaderFunction, type MetaFunction, useLoaderData } from 'remix';
import { AnimatePresence } from 'framer-motion';
import { User } from '@prisma/client';
import clsx from 'clsx';
import FeedPosts from '~/components/FeedPosts';
import { Dialog, useDialog } from '~/components/Dialog';
import Post from '~/components/Post';
import PostForm from '~/components/PostForm';
import Sidebar from '~/components/Sidebar';
import Widget from '~/components/Widget';
import { db } from '~/utils/db.server';
import { requireUser } from '~/utils/session.server';
import { articles } from '~/constants/articles';

export const meta: MetaFunction = () => ({
  title: 'Feed',
});

export type PostSelect = {
  id: string;
  text: string;
  photoUrl: string;
  likesCount: number;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    color: string;
  };
  comments: {
    id: string;
    text: string;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      color: string;
    };
  }[];
};

export type Article = {
  url: string;
  title: string;
  publishedAt: string;
};

type LoaderData = {
  user: User & {
    likes: {
      postId: string;
    }[];
  };
  posts: PostSelect[];
  articles: Article[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request, { redirect: '/login' });

  const posts = await db.post.findMany({
    take: 20,
    select: {
      id: true,
      text: true,
      photoUrl: true,
      likesCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      comments: {
        select: {
          id: true,
          createdAt: true,
          text: true,
          user: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get Google News API
  // const results = await fetch(
  //   `https://newsapi.org/v2/top-headlines?country=nz&apiKey=${process.env.NEWS_API_KEY}`
  // ).then((res) => res.json());
  // const articles = results.articles.slice(0, 5);

  return {
    posts,
    user,
  };
};

export default function FeedIndex() {
  const { user, posts } = useLoaderData<LoaderData>();

  const { isDialogOpen, openDialog, closeDialog, dialogType, setDialogType } =
    useDialog();

  // Dialog Content
  const [dialogContent, setDialogContent] = useState<PostSelect | null>(null);

  const handleInputDialog = (post?: PostSelect) => {
    if (post) setDialogContent(post);
    setDialogType('dropIn');
    openDialog();
  };

  const handlePostDialog = useCallback((post: PostSelect) => {
    setDialogContent(post);
    setDialogType('gifYouUp');
    openDialog();
  }, []);

  const handleClose = useCallback(() => {
    setDialogContent(null);
    closeDialog();
  }, []);

  useEffect(() => {
    // When dialog is open and a comment is added or deleted, update the dialog content state
    if (isDialogOpen) {
      const updatedPost = posts.find((post) => post.id === dialogContent?.id);
      // if the updated post is found, update. Otherwise, keep the old one
      setDialogContent(updatedPost || dialogContent);
    }
  }, [posts]);

  return (
    <>
      {/* Main Section */}
      <main className="flex h-full justify-center px-4 pt-20 dark:bg-black dark:text-white sm:px-12 xl:gap-x-5">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Left */}
          <Sidebar user={user} />
          {/* Center */}
          <FeedPosts
            posts={posts}
            user={user}
            handleInputDialog={handleInputDialog}
            handlePostDialog={handlePostDialog}
          />
        </div>
        {/* Right */}
        <div>
          <Widget articles={articles} />
        </div>
      </main>

      {/* Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <Dialog
            handleClose={handleClose}
            type={dialogType}
            className={clsx(
              {
                'mx-6 flex w-full max-w-lg flex-col justify-center rounded-xl bg-white dark:bg-[#1D2226] md:-mt-96':
                  dialogType === 'dropIn',
              },
              {
                'mx-6 -mt-[7vh] flex w-full max-w-6xl rounded-lg bg-[#1D2226]':
                  dialogType === 'gifYouUp',
              }
            )}
          >
            {dialogType === 'dropIn' && (
              <PostForm
                post={dialogContent as PostSelect}
                handleClose={handleClose}
              />
            )}
            {dialogType === 'gifYouUp' && (
              <>
                <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-l-lg">
                  <img
                    alt="post"
                    onDoubleClick={handleClose}
                    src={dialogContent?.photoUrl}
                    className="object-contain"
                  />
                </div>

                <div className="w-full rounded-r-lg bg-white dark:bg-[#1D2226] md:w-3/5">
                  <Post
                    user={user}
                    post={dialogContent as PostSelect}
                    isDialogPost
                    handleClose={handleClose}
                  />
                </div>
              </>
            )}
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
