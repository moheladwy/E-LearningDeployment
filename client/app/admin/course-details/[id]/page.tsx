"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState, useEffect } from "react";
import { get } from "http";
import { getRedirectError } from "next/dist/client/components/redirect";
import { course } from "@/app/config";

const FormSchema = z.object({
	name: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	duration: z.coerce.number().int().nonnegative(),
	category: z.string().min(2, {
		message: "Category must be at least 2 characters.",
	}),
	capacity: z.coerce.number().int().nonnegative(),
	content: z.string().min(2, {
		message: "Content must be at least 2 characters.",
	}),
	id: z.coerce.number().int().readonly(),
});

async function getCourseDetails(id: number) {
	const URL = course + ":8080/learning/course/" + id;
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

async function getCourseReviews(id: number) {
	const URL = course + ":8080/learning/rating/course/" + id;
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

async function onSubmit(data: z.infer<typeof FormSchema>) {
	const cookies: any = require("js-cookie");
	const requestBody = {
		...data,
	};
	const payload = {
		course: requestBody,
		jwt: cookies.get("jwt"),
	};
	// console.log(payload);
	const URL = course + ":8080/learning/course/update";
	const response = await fetch(URL, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	if (response.ok) {
		alert("Course updated successfully.");
		window.location.href = "/admin/courses";
	} else {
		alert("Course updating failed. Please try again.");
		window.location.href = "/admin/courses";
	}
}

async function deleteCourse(id: number) {
	const cookies: any = require("js-cookie");
	const URL = course + ":8080/learning/course/remove/" + id;
	const response = await fetch(URL, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			jwt: cookies.get("jwt"),
		},
	});
	if (response.ok) {
		alert("Course deleted successfully.");
		window.location.href = "/admin/courses";
	} else {
		alert("Course deletion failed. Please try again.");
		window.location.href = "/admin/courses";
	}
}

export default function Component({ params }: { params: { id: number } }) {
	const [course, setCourse] = useState<any>("");
	const [reviews, setReviews] = useState<any>([]);

	useEffect(() => {
		async function getCourse() {
			try {
				const fetchedCourse = await getCourseDetails(params.id);
				setCourse(fetchedCourse);
			} catch (error) {
				console.error(error);
				alert("Failed to load course details.");
			}
		}
		async function getReviews() {
			try {
				const fetchedReviews = await getCourseReviews(params.id);
				setReviews(fetchedReviews);
			} catch (error) {
				console.error(error);
				alert("Failed to load course reviews.");
			}
		}
		const cookies = require("js-cookie");
		if (cookies.get("role") !== "admin") {
			window.location.href = "/";
		} else {
			getCourse();
			getReviews();
		}
	}, [params.id]);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
			duration: 0,
			category: "",
			capacity: 0,
			content: "",
			id: params.id,
		},
	});

	useEffect(() => {
		if (course) {
			form.reset(course);
		}
	}, [course, form]);
	return (
		<main
			key="1"
			className="flex flex-col min-h-screen bg-gray-950 text-white"
		>
			<header className="py-4 px-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Link
							className="flex items-center gap-2"
							href="/admin/courses"
						>
							<ArrowLeftIcon className="w-5 h-5" />
							<h1 className="text-2xl font-bold">
								Course Details
							</h1>
						</Link>
					</div>
				</div>
			</header>
			<section className="container mx-auto py-8 px-4 md:px-6 lg:px-8 flex-1">
				<div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
					<div className="bg-gray-800 shadow-md rounded-lg p-6 flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold">
								{course.name}
							</h2>
							<div className="flex items-center gap-2">
								<StarIcon className="w-5 h-5 fill-primary" />
								<span className="font-semibold">
									{course.rating}
								</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<p className="text-gray-400">
								Category: {course.category}
							</p>
							<p className="text-gray-400">
								Duration: {course.duration} weeks
							</p>
						</div>
						<div className="flex items-center justify-between">
							<p className="text-gray-400">
								Capacity: {course.enrolled}/{course.capacity}{" "}
								students
							</p>
						</div>
						<div className="flex-1">
							<h3 className="text-xl font-bold mb-2">
								Course Content
							</h3>
							<p>{course.content}</p>
						</div>
					</div>
				</div>
			</section>
			<section className="container mx-auto py-8 px-4 md:px-6 lg:px-8 flex-1">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-2/3 space-y-6"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="duration"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course duration</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Category</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="capacity"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course capacity</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="id"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											className="hidden disabled:invisible"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Update Details</Button>
					</form>
				</Form>
				<Button
					className="my-10"
					onClick={() => deleteCourse(params.id)}
				>
					Delete Course
				</Button>
			</section>
			<section className="container mx-auto py-8 px-4 md:px-6 lg:px-8 flex-1">
				<div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
					<div className="bg-gray-800 shadow-md rounded-lg p-6 flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold">
								Course Reviews
							</h2>
						</div>
						<div className="flex-1">
							<ul className="space-y-2">
								{reviews.map((review: any) => (
									<li className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div>
												<p className="font-medium">
													From Student ID:{" "}
													{review.studentId}
												</p>
												<p className="font-medium">
													Comment: {review.review}
												</p>
												<p className="text-gray-400">
													{review.rating}/5
												</p>
											</div>
										</div>
									</li>
								))}
							</ul>
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
