import { dbTypesafe } from "@/db/dbTypesafe";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getURLBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const result = await dbTypesafe
      .selectFrom("urls")
      .select(["id", "originalURL"])
      .where("shortURLSlug", "=", slug)
      .executeTakeFirst();

    if (result) {
      // Record the click before redirecting
      await dbTypesafe
        .insertInto("clicks")
        .values({ url_id: result.id })
        .execute();
    }

    return result?.originalURL ?? null;
  });

export const Route = createFileRoute("/urls/$slug")({
  loader: async ({ params }) => {
    const originalURL = await getURLBySlug({ data: params.slug });

    if (originalURL) {
      throw redirect({
        href: originalURL,
        code: 302,
      });
    }

    return { slug: params.slug };
  },
  component: NotFoundComponent,
});

function NotFoundComponent() {
  const { slug } = Route.useParams();

  return (
    <div className="flex items-center justify-center h-screen bg-slate-800 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-2">URL Not Found</p>
        <p className="text-gray-400">
          The short URL slug{" "}
          <code className="bg-slate-700 px-2 py-1 rounded">{slug}</code> does
          not exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
