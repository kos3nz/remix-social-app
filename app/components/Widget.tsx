import TimeAgo from 'react-timeago';
import { BsInfoCircleFill } from 'react-icons/bs';
import { Article } from '~/routes/feed/index';

type Props = {
  articles: Article[];
};

const Widget = ({ articles }: Props) => {
  return (
    <div className="hidden space-y-4 xl:inline">
      {/* News */}
      <div className="w-11/12 space-y-2 overflow-hidden rounded-lg border border-gray-300 bg-white py-2.5 dark:border-none dark:bg-[#1D2226]">
        <div className="flex items-center justify-between px-2.5 font-bold">
          <h4>News</h4>
          <BsInfoCircleFill className="h-4 w-4" />
        </div>

        <div className="space-y-1">
          {articles.map((article) => (
            <div
              key={article.url}
              className="flex cursor-pointer items-center space-x-2 px-2.5 py-4 hover:bg-black/10 dark:hover:bg-black/20"
            >
              <div>
                <h5 className="max-w-xs truncate pr-10 text-sm font-medium">
                  {article.title}
                </h5>
                <TimeAgo
                  date={article.publishedAt}
                  minPeriod={60}
                  className="mt-0.5 text-xs opacity-80 dark:text-white/75"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Ads */}
      <div className="sticky top-[72px] h-64 w-11/12 overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-none dark:bg-[#1D2226]">
        <img src="https://rb.gy/kbfeaa" alt="ads" />
      </div>
    </div>
  );
};

export default Widget;
