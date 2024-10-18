"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/course-card";
import { useState, useEffect } from "react";

async function getAllCourses() {
  const URL: string = "http://localhost:8080/learning/course/courses";
  const res = await fetch(URL);
  const response = await res.json();
  return response;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("rating");
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesData = await getAllCourses();
      setCourses(coursesData);
      setFilteredCourses(coursesData);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let updatedCourses = [...courses];

    if (searchQuery) {
      updatedCourses = updatedCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "rating") {
      updatedCourses.sort((a, b) => b.rating - a.rating);
    }

    setFilteredCourses(updatedCourses);
  }, [searchQuery, sortOption, courses]);

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 py-4 px-6 backdrop-blur-md bg-black/30">
        <header className="py-3 border-b-4">
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-2" href="/student">
              <ArrowLeftIcon className="w-5 h-5" />
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
            </Link>
          </div>
        </header>
        <div className="flex justify-between items-center mb-6 pt-3">
          <h2 className="text-2xl font-bold">All Courses</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2" variant="outline">
                <ListIcon className="w-4 h-4" />
                Sort by Rating
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={handleSortChange}
              >
                <DropdownMenuRadioItem value="rating">
                  Rating
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-center mb-6">
          <form className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              className="bg-gray-800 border-none pl-10 pr-4 py-2 rounded-md focus:ring-2 focus:ring-gray-400 focus:outline-none"
              placeholder="Search courses..."
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>
        </div>
      </div>

      <section className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course: any) => (
              <CourseCard
                key={course.id}
                courseId={course.id}
                courseName={course.name}
                courseCategory={course.category}
                courseRating={course.rating}
                link={`/courses/${course.id}`}
              />
            ))
          ) : (
            <p className="text-center text-gray-400">No courses found.</p>
          )}
        </div>
      </section>
      <button className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-3 shadow-md transition-colors">
        <ArrowUpIcon className="w-6 h-6" />
        <span className="sr-only">Back to top</span>
      </button>
    </main>
  );
}

function ArrowUpIcon(props: any) {
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
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
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

function ListIcon(props: any) {
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
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function SearchIcon(props: any) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
