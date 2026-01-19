import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { IconContext } from "node_modules/react-icons/lib/iconContext";
import ClerkProvider from "../clerk/provider";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "deeporigin - takehome",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex items-center justify-center h-screen bg-slate-800 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-2">Page Not Found</p>
        <p className="text-gray-400">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  ),
  shellComponent: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="m0 p0 font-sans">
        <ClerkProvider>
          <IconContext.Provider value={{ style: { verticalAlign: "middle" } }}>
            <Outlet />
          </IconContext.Provider>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </ClerkProvider>
      </body>
    </html>
  );
}
