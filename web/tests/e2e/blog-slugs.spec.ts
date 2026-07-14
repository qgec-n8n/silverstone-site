import { expect, test } from "@playwright/test";

import { PUBLISHED_BLOG_POSTS } from "../../src/data/blog-posts";

test("published blog canonicals and hero assets return 200 without redirects", async ({
  request,
}) => {
  for (const post of PUBLISHED_BLOG_POSTS) {
    const path = `/blog/${post.slug}`;
    const response = await request.get(path, { maxRedirects: 0 });

    expect(response.status(), path).toBe(200);
    expect(response.headers().location, path).toBeUndefined();
    expect(await response.text(), path).toContain(
      `<link rel="canonical" href="https://silverstone-ai.com${path}"`,
    );

    const heroResponse = await request.get(post.heroImage, { maxRedirects: 0 });
    expect(heroResponse.status(), post.heroImage).toBe(200);
    expect(heroResponse.headers().location, post.heroImage).toBeUndefined();
  }
});

test("an unlisted blog slug remains a genuine 404", async ({ request }) => {
  const response = await request.get("/blog/nonexistent-article-check", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(404);
  expect(response.headers().location).toBeUndefined();
});
