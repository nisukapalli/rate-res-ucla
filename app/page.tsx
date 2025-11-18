import MapWrapper from "@/components/MapWrapper";

export default async function Home() {
  return (
    <div className="flex min-h-screen items-start font-sans bg-white">
      <main className="flex w-full flex-col items-center pt-8 gap-8">
        <div className="w-full max-w-4xl px-4">
          <div className="w-full h-[500px] rounded-lg border-2 border-gray-400 overflow-hidden">
            <MapWrapper />
          </div>
        </div>
      </main>
    </div>
  );
}
