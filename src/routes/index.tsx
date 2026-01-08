import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  UserButton,
} from "@clerk/clerk-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FaArrowCircleRight, FaCheckCircle, FaLink } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import z from "zod";

export const Route = createFileRoute("/")({ component: App });

import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";

const getShortURLInput = z.object({
  originalURL: z.url(),
});

const getShortURL = createServerFn({
  method: "GET",
})
  .inputValidator(getShortURLInput)
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth();
      console.log(data);
      if (!userId) {
        throw new Error(
          "Unauthorized: You must be signed in to access this resource"
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      return {
        shortUrl: "https://example.com/shortURL",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

const Nav = () => {
  return (
    <>
      <SignedIn>
        <div className="flex flex-row justify-end items-center gap-5">
          <Link to="/" className="text-blue-300 hover:underline">
            Dashboard
          </Link>
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
};

export const urlRegex =
  "https?://[A-Za-z0-9]([A-Za-z0-9\\-]*[A-Za-z0-9])?(\\.[A-Za-z0-9]([A-Za-z0-9\\-]*[A-Za-z0-9])?)+(:\\d+)?(/[^\\s]*)?";

function App() {
  const { redirectToSignIn } = useClerk();
  const [originalURL, setOriginalURL] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  return (
    <>
      <div className="m0 p0 h-screen text-white bg-linear-to-b from-slate-800 via-slate-700 to-slate-800">
        <nav className="text-right p-3">
          <Nav />
        </nav>
        <main className="flex justify-center">
          <div
            id="content"
            className="flex gap-2 flex-col p-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ marginTop: "30vh" }}
          >
            <h1 className="flex gap-2 items-center text-3xl">
              URL Shortener
              <FaLink />
            </h1>
            <form
              className="grid grid-cols-12 gap-4 group items-start"
              onSubmit={(e) => {
                e.preventDefault();
                getShortURL({ data: { originalURL } })
                  .then(({ shortUrl }) => setShortUrl(shortUrl))
                  .catch(alert);
              }}
            >
              <section className=" gap-2 col-span-12 md:col-span-9">
                <input
                  // value="https://example.for.testing:3000/here"
                  value={originalURL}
                  onChange={e => { setOriginalURL(e.target.value); setShortUrl(''); }}
                  type="text"
                  placeholder="Enter URL to shorten"
                  autoFocus={true}
                  onInvalid={(e) => e.preventDefault()}
                  className="
                    text-black bg-white text-lg peer
                    w-full rounded-full border-4 p-4 outline-none
                    border-slate-300
                    invalid:border-red-500
                    valid:border-emerald-500
                    placeholder-shown:border-slate-300!"
                  required
                  pattern={urlRegex}
                />
                <p
                  className="
                    hidden text-sm text-red-400
                    peer-invalid:block
                    peer-placeholder-shown:hidden!
                    font-bold
                    ml-4"
                >
                  Must be a valid http or https URL
                </p>
                <SignedOut>
                  <p className="ml-4 mt-4">
                    <a
                      onClick={() => redirectToSignIn()}
                      className="text-blue-300 hover:underline cursor-pointer"
                    >
                      Sign In
                    </a>{" "}
                    first if you want to track your URLs!
                  </p>
                </SignedOut>
              </section>
              <section className="col-span-12 md:col-span-3">
                <button
                  type="submit"
                  className="
                    w-full
                    rounded-full
                    border-4 border-white
                    bg-blue-600
                    hover:bg-blue-500
                    group-has-invalid:hover:bg-blue-600
                    text-white
                    text-lg
                    px-6 py-4
                    cursor-pointer
                    transition-all duration-300
                    group-has-invalid:opacity-50
                    group-has-invalid:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  Shorten{" "}
                  <FaArrowCircleRight style={{ display: "inline-block" }} />
                </button>
              </section>
            </form>
            {shortUrl && (
              <div
                id="success-message"
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <h1 className="mt-3">
                  <span className="text-green-600">
                    <FaCheckCircle style={{ display: "inline-block" }} />
                    <strong> Success!</strong> Here's your short URL:{" "}
                  </span>
                  <span id="short-url-and-button" className="whitespace-nowrap">
                    <a
                      href={shortUrl}
                      target="_blank"
                      className="text-blue-300 font-bold"
                    >
                      {shortUrl}
                    </a>
                    <div className="relative group whitespace-nowrap inline-block">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(shortUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 3000);
                        }}
                        className="rounded-full bg-gray-500 ml-2 p-2 hover:bg-gray-300 hover:cursor-pointer"
                      >
                        <FaRegCopy />
                      </button>
                      <span
                        className={`absolute bg-black text-white text-xs px-2 py-1 rounded top-full mt-1 whitespace-nowrap ${copied ? "block" : "hidden group-hover:block"}`}
                      >
                        {copied ? "Copied!" : "Copy to clipboard"}
                      </span>
                    </div>
                  </span>
                </h1>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
