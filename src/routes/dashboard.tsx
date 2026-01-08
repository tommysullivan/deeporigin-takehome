import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { URLEntry } from "@/components/URLEntry";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  useClerk,
} from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import { getURLsWithClicks, URLsWithClicks } from "../data/getURLsWithClicks";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useUser();
  const { redirectToSignIn } = useClerk();
  const [urls, setUrls] = useState<URLsWithClicks>([]);
  const [loading, setLoading] = useState(true);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(10);

  const handleURLUpdate = (id: number, newSlug: string) => {
    setUrls((prevUrls) =>
      prevUrls.map((url) =>
        url.id === id ? { ...url, shortURLSlug: newSlug } : url
      )
    );
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = () => {
      getURLsWithClicks()
        .then(setUrls)
        .catch((error) => {
          console.error("Full error object:", error);
          console.error("error.message:", error?.message);
          console.error("error.status:", error?.status);
          console.error("error.cause:", error?.cause);
          console.error("error.data:", error?.data);
          console.error("JSON stringify:", JSON.stringify(error, null, 2));

          if (error.message === "Unauthorized") {
            redirectToSignIn();
          }
        })
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
                  <URLEntry
                    key={url.id}
                    id={url.id}
                    originalURL={url.originalURL}
                    shortURLSlug={url.shortURLSlug}
                    clickCount={url.clickCount}
                    onUpdate={handleURLUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <main className="flex justify-center p-4">
          <div className="w-full max-w-4xl text-center">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <p className="text-gray-400 mb-4">
              This page requires you to{" "}
              <SignInButton>
                <span className="text-blue-300 hover:underline cursor-pointer">
                  sign in
                </span>
              </SignInButton>
            </p>
          </div>
        </main>
      </SignedOut>
    </div>
  );
}
