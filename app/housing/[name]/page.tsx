import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import StarRating from "@/components/reviews/StarRating";
import ReviewsSection from "@/components/reviews/ReviewsSection";

export default async function BuildingDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: nameParam } = await params;
  const name = nameParam.replace(/_/g, " ");

  const building = await prisma.building.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (!building) {
    notFound();
  }

  const reviews = await prisma.review.findMany({
    where: {
      building: building.name,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  type Review = (typeof reviews)[0];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-black mb-6">
          {building.name}
        </h1>
        <div className="w-full h-64 rounded-lg border-2 border-gray-300 bg-gray-100 flex items-center justify-center mb-6">
          <p className="text-gray-500">Image placeholder</p>
        </div>
        <p className="text-lg text-gray-600 mb-2">{building.address}</p>
        <p className="text-md text-blue-600 font-medium mb-8">
          {building.type}
        </p>
        <ReviewsSection buildingName={building.name} reviewsCount={reviews.length}>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
              reviews.map((review: Review) => (
                <div
                  key={review.id}
                  className="border border-gray-300 rounded-lg p-4 bg-white"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.author.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Overall:</span>
                        <StarRating value={review.overall} readOnly />
                      </div>
                    </div>
                  </div>
                  {review.text && (
                    <p className="text-gray-700 mt-2">{review.text}</p>
                  )}
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 w-20">Location:</span>
                      <StarRating value={review.location} readOnly />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 w-20">Distance:</span>
                      <StarRating value={review.distance} readOnly />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 w-20">Social:</span>
                      <StarRating value={review.social} readOnly />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 w-20">Noise:</span>
                      <StarRating value={review.noise} readOnly />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 w-20">Clean:</span>
                      <StarRating value={review.clean} readOnly />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 w-20">Value:</span>
                      <StarRating value={review.value} readOnly />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ReviewsSection>
      </div>
    </div>
  );
}

