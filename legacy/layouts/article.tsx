import * as React from "react";
import hydrate from "next-mdx-remote/hydrate";
import { Header } from "components/header";
import { Container } from "components/container";
import { Navigation } from "components/navigation";
import { parse, format } from "url";
import { ArticlePageProps } from "types";
import { FeedbackForm } from "components/feedback-form";

export const components = {};

export function ArticleLayout({ note, body, links, meta }: ArticlePageProps) {
  const isDraft = meta.tags?.includes("draft");
  const hasNote = isDraft;
  const isMDX = meta.tags?.includes("mdx") ?? false;
  const articleProps: React.HTMLAttributes<HTMLDivElement> = isMDX
    // @ts-expect-error
    ? { children: hydrate(body, { components }) }
    : {
        dangerouslySetInnerHTML: { __html: body },
      };
  return (
    <section className="space-y-6 mb-12">
      <Header>
        <Container>
          <Navigation
            current="articles"
            title={note.title ?? "Articles"}
            description={meta.description ?? note.headline}
          />
        </Container>
      </Header>

      <Container>
        <section className="space-y-10 relative">
          {hasNote ? (
            <aside className="prose dark:prose-dark sm:prose-lg mx-auto">
              {isDraft ? (
                <blockquote>
                  Warning: You are reading a draft article, sentences may be
                  incomplete and ideas may be still in the open, typos are
                  expected.
                  <br />
                  <a href="https://twitter.com/sergiodxa">
                    Follow me on Twitter
                  </a>{" "}
                  to know when it's ready.
                </blockquote>
              ) : null}
            </aside>
          ) : null}

          <article
            className="prose dark:prose-dark sm:prose-lg mx-auto"
            {...articleProps}
          />

          {links?.length > 0 ? (
            <aside className="max-w-prose mx-auto border-t border-gray-500 py-6 mb-6">
              <p className="text-gray-900 dark:text-gray-100 font-bold leading-normal">
                Links on this note ???
              </p>

              <ul>
                {links.map((link) => {
                  const url = parse(link.url);

                  return (
                    <li key={link.id} className="mt-1 ml-4 truncate">
                      <a
                        className="text-gray-900 dark:text-gray-100 font-semibold underline"
                        href={link.url}
                        title={link.title}
                        rel="noopener noreferrer"
                      >
                        {link.host}
                      </a>
                      <span className="text-gray-600 dark:text-gray-400">
                        {format({
                          pathname: url.pathname,
                          query: url.query,
                          hash: url.hash,
                        })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </aside>
          ) : null}
        </section>
      </Container>

      <section className="max-w-prose mx-auto">
        <FeedbackForm path={note.path} />
      </section>

      <Container>
        <footer className="mb-12">
          <p className="text-gray-600 dark:text-gray-400 text-sm text-right">
            Powered by{" "}
            <a
              href="https://collectednotes.com"
              className="underline"
              rel="noopener noreferrer"
            >
              Collected Notes
            </a>
          </p>
        </footer>
      </Container>
    </section>
  );
}
