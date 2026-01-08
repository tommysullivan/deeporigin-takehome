import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import { getURLsWithClicks, URLsWithClicks } from "../data/getURLsWithClicks";
import { shortURLFromSlug } from "@/data/shortURLFromSlug";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useUser();
  const [urls, setUrls] = useState<URLsWithClicks>([]);
  const [loading, setLoading] = useState(true);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(10);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = () => {
      getURLsWithClicks({ data: user.id })
        .then(setUrls)
        .catch(console.error)
        .finally(() => setLoading(false));
      setSecondsUntilRefresh(10);
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsUntilRefresh((prev) => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800">
      <nav className="text-right p-3">
        <Nav />
      </nav>
      <SignedIn>
        <main className="flex justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-400">
                Autorefreshing in {secondsUntilRefresh}s
              </p>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : urls.length === 0 ? (
              <p className="text-gray-400">
                You haven't created any short URLs yet.
              </p>
            ) : (
              <div className="space-y-4">
                {urls.map((url) => (
                  <div
                    key={url.id}
                    className="bg-slate-700 rounded-lg p-4 hover:bg-slate-650 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">
                          Short URL
                        </div>
                        <a
                          href={shortURLFromSlug(url.shortURLSlug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 hover:underline mb-3 block"
                        >
                          {shortURLFromSlug(url.shortURLSlug)}
                        </a>
                        <div className="text-sm text-gray-400 mb-1">
                          Original URL
                        </div>
                        <div className="text-white break-all">
                          {url.originalURL}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-blue-400">
                          {url.clickCount}
                        </div>
                        <div className="text-sm text-gray-400">
                          {url.clickCount === 1 ? "click" : "clicks"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </SignedIn>
    </div>
  );
}
