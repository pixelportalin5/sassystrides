import {
  ArrowLeft,
  ArrowRight,
  Link2,
  Mail,
  Send,
  Share2,
} from 'lucide-react';
import { lazy, memo, Suspense, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import ArticleContentWithAds from '../components/ArticleContentWithAds';
import PostFeedWithAds from '../components/PostFeedWithAds';
import BlogCard from '../components/BlogCard';
import CategoryBanner from '../components/CategoryBanner';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import {
  CATEGORY_CACHE_TIME,
  CATEGORY_STALE_TIME,
  categoryQueryKeys,
  fetchPostBySlugQuery,
  fetchRelatedPostsQuery,
  normalizePosts,
} from '../services/categoryQueries';
import {
  DEFAULT_AUTHOR_AVATAR,
  getReadingTime,
  stripHtml,
} from '../services/wordpressApi';
const TrendingWidget = lazy(() => import('../components/TrendingWidget'));

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));

const getAuthorAvatar = (post) => post?.authorAvatar || DEFAULT_AUTHOR_AVATAR;

const ArticleSkeleton = () => (
  <div className="min-h-screen bg-ivory text-ink">
    <Navbar />
    <main className="space-y-6 pb-10">
      <div className="mx-auto max-w-[1400px] px-4 pt-4">
        <div className="h-28 animate-pulse border border-ink/10 bg-parchment" />
      </div>
      <section className="mx-auto grid max-w-[1400px] gap-8 px-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)]">
        <div className="space-y-6">
          <div className="h-5 w-72 animate-pulse bg-espresso/10" />
          <div className="h-24 max-w-4xl animate-pulse bg-espresso/10" />
          <div className="h-[560px] animate-pulse bg-champagne/70" />
          <div className="space-y-4 border border-ink/10 bg-porcelain p-8">
            {[0, 1, 2, 3, 4].map((item) => (
              <div key={item} className="h-4 animate-pulse bg-espresso/10" />
            ))}
          </div>
        </div>
        <aside className="space-y-5">
          <div className="h-80 animate-pulse border border-ink/10 bg-parchment" />
          <div className="h-96 animate-pulse border border-ink/10 bg-porcelain" />
        </aside>
      </section>
    </main>
  </div>
);

const ShareButtons = memo(() => (
  <div className="flex flex-wrap items-center gap-2">
    {[Share2, Send, Mail, Link2].map((Icon, index) => (
      <button
        key={index}
        type="button"
        aria-label={['Share article', 'Send article', 'Email article', 'Copy link'][index]}
        className="grid h-10 w-10 place-items-center border border-ink/10 bg-porcelain transition hover:bg-espresso hover:text-porcelain"
      >
        <Icon size={15} strokeWidth={1.45} />
      </button>
    ))}
  </div>
));

const NewsletterWidget = memo(() => (
  <section className="border border-ink/10 bg-espresso p-6 text-porcelain">
    <p className="micro-label text-champagne">Newsletter</p>
    <h3 className="serif-title mt-4 text-4xl leading-none">Never Miss A Trend</h3>
    <p className="mt-4 text-xs leading-6 text-porcelain/70">
      Weekly fashion notes, runway moods, beauty edits and Sassy Strides exclusives.
    </p>
    <form className="mt-6 space-y-3">
      <input
        type="email"
        required
        placeholder="Email address"
        className="h-11 w-full border border-porcelain/20 bg-porcelain/8 px-4 text-sm outline-none placeholder:text-porcelain/50"
      />
      <button
        type="submit"
        className="w-full bg-porcelain px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-espresso transition hover:bg-champagne"
      >
        Subscribe
      </button>
    </form>
  </section>
));

const Sidebar = memo(({ posts = [] }) => (
  <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
    <CategoryBanner post={posts[0]} slot={2} variant="skyscraper" title="Prada" action="Discover" />
    <Suspense fallback={<div className="h-80 border border-ink/10 bg-porcelain" />}>
      <TrendingWidget posts={posts} />
    </Suspense>
    <NewsletterWidget />
  </aside>
));

const PostNavCard = ({ label, post, direction }) => {
  if (!post) {
    return <div className="hidden md:block" />;
  }

  const isNext = direction === 'next';

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group grid gap-4 border border-ink/10 bg-porcelain p-4 transition hover:bg-parchment sm:grid-cols-[116px_1fr] ${
        isNext ? 'sm:grid-cols-[1fr_116px] sm:text-right' : ''
      }`}
    >
      {!isNext && (
        <img
          src={post.image}
          alt={post.imageAlt}
          srcSet={post.imageSrcSet}
          sizes="116px"
          className="h-28 w-full object-cover saturate-[0.75] transition group-hover:saturate-100"
          loading="lazy"
          decoding="async"
        />
      )}
      <span className="flex flex-col justify-center">
        <span className="mb-2 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-taupe">
          {!isNext && <ArrowLeft size={14} strokeWidth={1.5} />}
          {label}
          {isNext && <ArrowRight size={14} strokeWidth={1.5} />}
        </span>
        <span className="serif-title line-clamp-2 text-3xl leading-none text-espresso transition group-hover:text-bronze">
          {stripHtml(post.title.rendered)}
        </span>
      </span>
      {isNext && (
        <img
          src={post.image}
          alt={post.imageAlt}
          srcSet={post.imageSrcSet}
          sizes="116px"
          className="h-28 w-full object-cover saturate-[0.75] transition group-hover:saturate-100"
          loading="lazy"
          decoding="async"
        />
      )}
    </Link>
  );
};

const BlogDetails = () => {
  const { slug: routeSlug } = useParams();
  const articleSlug = routeSlug ? decodeURIComponent(routeSlug) : '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [articleSlug]);

  const postQuery = useQuery({
    queryKey: categoryQueryKeys.postBySlug(articleSlug),
    queryFn: () => fetchPostBySlugQuery(articleSlug),
    enabled: Boolean(articleSlug),
    staleTime: CATEGORY_STALE_TIME,
    gcTime: CATEGORY_CACHE_TIME,
    refetchOnMount: 'always',
    retry: 1,
    retryDelay: 1000,
  });

  const post = postQuery.data ?? null;
  const primaryCategorySlug = post?.categorySlug;
  const relatedQuery = useQuery({
    queryKey: categoryQueryKeys.relatedPosts(primaryCategorySlug || 'none', articleSlug),
    queryFn: () =>
      fetchRelatedPostsQuery({
        categorySlug: primaryCategorySlug,
        slug: articleSlug,
      }),
    enabled: Boolean(primaryCategorySlug),
    staleTime: CATEGORY_STALE_TIME,
    gcTime: CATEGORY_CACHE_TIME,
  });
  const relatedPosts = useMemo(
    () => normalizePosts(relatedQuery.data || []).slice(0, 3),
    [relatedQuery.data],
  );

  const readingTime = useMemo(
    () => (post ? getReadingTime(post.content.rendered) : 0),
    [post],
  );
  const articleContent = post?.content?.rendered || '';
  const adjacent = useMemo(
    () => ({
      previous: relatedPosts[0] || null,
      next: relatedPosts[1] || null,
    }),
    [relatedPosts],
  );
  const authorAvatar = useMemo(() => getAuthorAvatar(post), [post]);
  const tags = useMemo(() => {
    if (post?.tagNames?.length) {
      return post.tagNames;
    }

    return [post?.categoryName || 'Editorial'].filter(Boolean);
  }, [post]);

  const isLoadingPost =
    !articleSlug ||
    postQuery.isPending ||
    postQuery.isLoading ||
    (postQuery.isFetching && !post);

  const renderState = isLoadingPost
    ? 'loading'
    : postQuery.isError
      ? 'error'
      : !post
        ? 'not-found'
        : 'article';

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    console.debug('[BlogDetails] render-state', {
      routeSlug,
      articleSlug,
      queryKey: categoryQueryKeys.postBySlug(articleSlug),
      status: postQuery.status,
      fetchStatus: postQuery.fetchStatus,
      isPending: postQuery.isPending,
      isLoading: postQuery.isLoading,
      isFetching: postQuery.isFetching,
      isError: postQuery.isError,
      isSuccess: postQuery.isSuccess,
      error: postQuery.error?.message ?? null,
      hasPost: Boolean(post),
      postId: post?.id ?? null,
      renderState,
      errorReason: postQuery.isError ? postQuery.error?.message : null,
      notFoundReason:
        postQuery.isSuccess && !post ? 'query succeeded but article is null' : null,
    });
  }, [
    articleSlug,
    post,
    postQuery.error,
    postQuery.fetchStatus,
    postQuery.isError,
    postQuery.isFetching,
    postQuery.isLoading,
    postQuery.isPending,
    postQuery.isSuccess,
    postQuery.status,
    renderState,
    routeSlug,
  ]);

  if (isLoadingPost) {
    return <ArticleSkeleton />;
  }

  if (postQuery.isError) {
    const message =
      postQuery.error?.message || 'Unable to load this article right now.';

    return (
      <div className="min-h-screen bg-ivory">
        <Navbar />
        <main className="editorial-container grid min-h-[70vh] place-items-center text-center">
          <div>
            <p className="micro-label mb-4 text-bronze">Sassy Strides</p>
            <h1 className="serif-title text-6xl leading-none text-espresso">
              Unable to load article.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-taupe">{message}</p>
            <Link
              to="/"
              className="mt-8 inline-block bg-espresso px-7 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-porcelain"
            >
              Return Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navbar />
        <main className="editorial-container grid min-h-[70vh] place-items-center text-center">
          <div>
            <p className="micro-label mb-4 text-bronze">Sassy Strides</p>
            <h1 className="serif-title text-6xl leading-none text-espresso">Article not found.</h1>
            <Link
              to="/"
              className="mt-8 inline-block bg-espresso px-7 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-porcelain"
            >
              Return Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <Navbar />
      <main className="space-y-7 pb-10">
        <div className="mx-auto max-w-[1400px] px-4 pt-4">
          <CategoryBanner post={relatedPosts[0] || post} slot={1} variant="leaderboard" title="Saint Laurent" />
        </div>

        <div className="mx-auto max-w-[1400px] px-4">
          <nav className="flex flex-wrap items-center gap-2 border-y border-ink/10 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-taupe">
            <Link to="/" className="transition hover:text-bronze">Home</Link>
            <span>/</span>
            <Link to={`/${post.categorySlug || 'fashion'}`} className="transition hover:text-bronze">
              {post.categoryName}
            </Link>
            <span>/</span>
            <span>Article</span>
            <span>/</span>
            <span className="line-clamp-1 text-espresso">{stripHtml(post.title.rendered)}</span>
          </nav>
        </div>

        <section className="mx-auto grid max-w-[1400px] gap-8 px-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)]">
          <article className="min-w-0">
            <header className="border border-ink/10 bg-paper-grain px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
              <p className="micro-label text-bronze">{post.categoryName}</p>
              <h1 className="serif-title mt-5 max-w-5xl text-6xl font-semibold uppercase leading-[0.82] text-espresso sm:text-7xl xl:text-8xl">
                {stripHtml(post.title.rendered)}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-taupe sm:text-lg">
                {stripHtml(post.excerpt.rendered)}
              </p>

              <div className="mt-8 grid gap-5 border-y border-ink/10 py-5 xl:grid-cols-[1fr_auto] xl:items-center">
                <div className="flex flex-wrap items-center gap-4">
                  <img
                    src={authorAvatar}
                    alt={post.authorName}
                    className="h-14 w-14 rounded-full object-cover saturate-[0.85]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="text-sm font-semibold text-espresso">By {post.authorName}</p>
                    <p className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-taupe">
                      {formatDate(post.date)} · {readingTime} Min Read
                    </p>
                  </div>
                </div>
                <ShareButtons />
              </div>
            </header>

            <figure className="overflow-hidden border-x border-b border-ink/10 bg-champagne">
              <img
                src={post.heroImage || post.image}
                alt={post.imageAlt}
                srcSet={post.imageSrcSet}
                sizes="(min-width: 1024px) 980px, 100vw"
                className="h-[360px] w-full object-cover object-center saturate-[0.82] sm:h-[520px] lg:h-[640px]"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </figure>

            <section className="border-x border-b border-ink/10 bg-porcelain px-6 py-8 shadow-soft sm:px-10 lg:px-16">
              <ArticleContentWithAds html={articleContent} seed={0.61} />

              <div className="mt-10 border-t border-ink/10 pt-7">
                <p className="micro-label mb-4 text-espresso">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-ink/10 bg-parchment px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-taupe"
                    >
                      {stripHtml(tag)}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </article>

          <Sidebar posts={relatedPosts} />
        </section>

        <section className="mx-auto grid max-w-[1400px] gap-4 border-y border-ink/10 px-4 py-7 md:grid-cols-2">
          <PostNavCard label="Previous Post" post={adjacent.previous} />
          <PostNavCard label="Next Post" post={adjacent.next} direction="next" />
        </section>

        {relatedPosts.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-4 py-4">
            <div className="mb-5 flex items-center justify-between border-b border-ink/10 pb-3">
              <h2 className="micro-label text-espresso">Related Posts</h2>
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-taupe">
                From {post.categoryName}
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <PostFeedWithAds
                items={relatedPosts}
                adClassName="md:col-span-3"
                renderItem={(item, index) => (
                  <BlogCard key={item.id} post={item} variant="compact" index={index + 6} />
                )}
              />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetails;
