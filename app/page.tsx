import { prisma } from "@/lib/prisma/client";
import HomeSearch from "@/components/housing/HomeSearch";

export default async function Home() {
  const buildings = await prisma.building.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex min-h-screen items-start font-sans bg-white">
      <main className="flex w-full flex-col items-center pt-8 gap-8">
        <div className="w-full max-w-2xl px-4">
          <HomeSearch buildings={buildings} />
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
