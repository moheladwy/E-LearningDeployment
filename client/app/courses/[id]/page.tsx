"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getCourseDetails(id: number) {
  const URL = "http://localhost:8080/learning/course/" + id;
  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
}

const handleEnroll = async (id: number) => {
  const URL = "http://localhost:8080/learning/enroll/";
  const cookie = require("js-cookie");
  const payload = {
    jwt: cookie.get("jwt"),
    enrollment: {
      courseId: id,
    },
  };
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    alert("Enrolled request sent successfully");
    window.location.href = "/student/courses";
    return;
  } else {
    alert("Enrolled request failed");
    window.location.href = "/student/courses";
    return;
  }
};

export default async function Component({
  params,
}: {
  params: { id: number };
}) {
  const course = await getCourseDetails(params.id);

  const cookies = require("js-cookie");
  if (cookies.get("role") != "student") {
    window.location.href = "/";
  }

  return (
    <main key="1" className="flex flex-col min-h-screen bg-gray-950 text-white">
      <header className="py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="flex items-center gap-2" href="/student/courses">
              <ArrowLeftIcon className="w-5 h-5" />
              <h1 className="text-2xl font-bold">Course Details</h1>
            </Link>
          </div>
        </div>
      </header>
      <section className="container mx-auto py-8 px-4 md:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="bg-gray-800 shadow-md rounded-lg p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{course.name}</h2>
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 fill-primary" />
                <span className="font-semibold">{course.rating}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Category: {course.category}</p>
              <p className="text-gray-400">Duration: {course.duration} weeks</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                Capacity: {course.enrolled}/{course.capacity} students
              </p>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Course Content</h3>
              <p>{course.content}</p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => handleEnroll(course.id)}
                className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md"
              >
                Enroll
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

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
function ArrowLeftIcon(props: any) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
