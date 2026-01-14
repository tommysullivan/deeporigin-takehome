export function NotFound() {
  return (
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
  );
}
