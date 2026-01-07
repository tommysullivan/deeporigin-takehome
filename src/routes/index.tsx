import { createFileRoute } from "@tanstack/react-router";
import { FaArrowCircleRight, FaCheckCircle, FaLink } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: App });

const urlRegex = "https?://[A-Za-z0-9]([A-Za-z0-9\\-]*[A-Za-z0-9])?(\\.[A-Za-z0-9]([A-Za-z0-9\\-]*[A-Za-z0-9])?)+(:\\d+)?(/[^\\s]*)?"

function App() {
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  return (
    <>
      <div
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #1e293b, #334155, #1e293b)",
          margin: 0,
          padding: 0,
          height: "100vh",
          color: "white",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          id="content"
          className="flex gap-2 flex-col p-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{marginTop: "30vh"}}
        >
          <h1 className="flex gap-2 items-center text-3xl">
            URL Shortener
            <FaLink />
          </h1>
          <form 
            className="grid grid-cols-12 gap-4 group items-start"
            onSubmit={(e) => {
              e.preventDefault();
              setShortUrl("http://localhost/u/shortUrlHere");
            }}
          >
            <section className=" gap-2 col-span-12 md:col-span-9">
              <input
                value="https://example.for.testing:3000/here"
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
                  placeholder-shown:border-slate-300!
                "
                required
                pattern={urlRegex}
              />
              <p
                className="
                  hidden text-sm text-red-400
                  peer-invalid:block
                  peer-placeholder-shown:hidden!
                  font-bold
                  ml-4
                "
              >
                Must be a valid http or https URL
              </p>
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
                    <span className={`absolute bg-black text-white text-xs px-2 py-1 rounded top-full mt-1 whitespace-nowrap ${copied ? 'block' : 'hidden group-hover:block'}`}>
                      {copied ? "Copied!" : "Copy to clipboard"}
                    </span>
                  </div>
                </span>
              </h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
