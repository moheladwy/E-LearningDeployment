import Link from "next/link";
import { Button } from "@/components/ui/button";

const CourseCard = ({
  courseId,
  courseName,
  courseRating,
  courseCategory,
  link,
}: {
  courseId: string;
  courseName: string;
  courseRating: number;
  courseCategory: string;
  link: string;
}) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <StarIcon
      key={i}
      className={`w-5 h-5 ${
        i < courseRating ? "text-yellow-500" : "text-gray-600"
      }`}
    />
  ));

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-700 transition-colors h-full w-72">
      <h3 className="text-lg font-semibold line-clamp-2 text-center">
        {courseName}
      </h3>
      <p className="text-gray-400 text-sm">Category: {courseCategory}</p>
      <div className="flex items-center gap-1 text-yellow-500">
        {stars}
        <span className="text-gray-400 text-sm">({courseRating})</span>
      </div>
      <Link className="w-full" href={link}>
        <Button className="w-full" variant="outline">
          View Details
        </Button>
      </Link>
    </div>
  );
};

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export { CourseCard };
