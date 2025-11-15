export default function Home() {
  return (
    <div className="flex min-h-screen items-start font-sans bg-white">
      <main className="flex w-full flex-col items-center pt-8 gap-8">
        <div className="w-full max-w-2xl px-4">
          <input
            type="text"
            placeholder="Search for a building..."
            className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-lg text-gray-600 placeholder:text-gray-400 shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="w-full max-w-4xl px-4">
          <div className="w-full h-96 rounded-lg border-2 border-gray-400 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Map placeholder</p>
          </div>
        </div>
      </main>
    </div>
  );
}
