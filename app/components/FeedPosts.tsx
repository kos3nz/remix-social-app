import type { User } from '@prisma/client';
import type { PostSelect } from '~/routes/feed/index';
import Post from './Post';
import PostInput from './PostInput';

type Props = {
  posts: PostSelect[];
  user: User & {
    likes: {
      postId: string;
    }[];
  };
  handleInputDialog: () => void;
  handlePostDialog: (post: PostSelect) => void;
};

const FeedPosts = ({
  posts,
  user,
  handleInputDialog,
  handlePostDialog,
}: Props) => {
  return (
    <div className="w-full max-w-lg space-y-4 pb-24">
      <PostInput handleDialog={handleInputDialog} user={user} />
      {/* Posts */}
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          user={user}
          handlePostDialog={handlePostDialog}
          handleInputDialog={handleInputDialog}
        />
      ))}
    </div>
  );
};

export default FeedPosts;
