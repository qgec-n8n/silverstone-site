import { Link, useParams, type MetaFunction } from "react-router";

import { getBlogPostBySlug } from "~/data/blog-posts";
import { ArticlePage } from "~/routes/templates/article-page";

export const meta: MetaFunction = ({ params }) => {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return [{ title: "Blog article not found | Silverstone AI" }];
  }

  return [
    { title: post.metaTitle },
    { name: "description", content: post.metaDescription },
    { property: "og:title", content: post.metaTitle },
    { property: "og:description", content: post.metaDescription },
    { property: "og:type", content: "article" },
    { property: "og:image", content: post.heroImage },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

export default function ArticleRoute() {
  const params = useParams();
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-6 py-20 text-center">
        <div>
          <p className="ss-eyebrow mb-4 font-mono text-muted-foreground">404</p>
          <h1 className="text-h2">This article is not published.</h1>
          <p className="mt-4 text-body-lg text-muted-foreground">
            The insights index links to every live Silverstone article.
          </p>
          <Link className="mt-6 inline-flex text-primary underline" to="/blog">
            Return to insights
          </Link>
        </div>
      </div>
    );
  }

  return <ArticlePage post={post} />;
}
