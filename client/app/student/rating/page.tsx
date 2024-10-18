"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const FormSchema = z.object({
  courseId: z.coerce.number().int().nonnegative(),
  rating: z.coerce.number().nonnegative().max(5),
  review: z.string().min(2, {
    message: "Review must be at least 2 characters.",
  }),
});

export default function RatingForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      courseId: 0,
      rating: 0,
      review: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const cookies: any = require("js-cookie");
    const ratingObj = {
      ...data,
    };
    const payload = {
      rating: ratingObj,
      jwt: cookies.get("jwt"),
    };
    console.log(payload);
    const URL = "http://localhost:8080/learning/rating/submit";
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      alert("Rating submitted.");
      router.push("/student");
    } else {
      // console.log(response.statusText);
      alert("Rating submission failed. Please try again.");
      router.push("/student");
    }
  }

  return (
    <main className="flex justify-center mt-16">
      <div className="sticky top-0 py-4 px-6">
        <header className="py-3 border-b-4">
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-2" href="/student">
              <ArrowLeftIcon className="w-5 h-5" />
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
            </Link>
          </div>
        </header>{" "}
        <div className="flex justify-between items-center mb-6 pt-3">
          <h2 className="text-2xl font-bold">Submit a rating</h2>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course ID</FormLabel>
                <FormControl>
                  <Input placeholder="Course ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input placeholder="Rating" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review</FormLabel>
                <FormControl>
                  <Input placeholder="Review" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
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
