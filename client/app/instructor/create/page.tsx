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
import { courseAPI } from "@/app/config";

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
});

export default function RegisterForm() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
			duration: 0,
			category: "",
			capacity: 0,
			content: "",
		},
	});

	const router = useRouter();

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const cookies: any = require("js-cookie");
		const requestBody = {
			...data,
			instructorId: cookies.get("id"),
		};
		const payload = {
			course: requestBody,
			jwt: cookies.get("jwt"),
		};
		const URL = courseAPI + ":8080/learning/course/create";
		const response = await fetch(
			courseAPI + ":8080/learning/course/create",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}
		);
		if (response.ok) {
			alert("Course created successfully.");
			router.push("/instructor");
		} else {
			alert("Course creation failed. Please try again.");
		}
	}

	return (
		<main className="flex justify-center mt-16">
			<div className="sticky top-0 py-4 px-6">
				<header className="py-3 border-b-4">
					<div className="flex items-center justify-between">
						<Link
							className="flex items-center gap-2"
							href="/instructor"
						>
							<ArrowLeftIcon className="w-5 h-5" />
							<h1 className="text-2xl font-bold">
								Instructor Dashboard
							</h1>
						</Link>
					</div>
				</header>{" "}
				<div className="flex justify-between items-center mb-6 pt-3">
					<h2 className="text-2xl font-bold">Create a course</h2>
				</div>
			</div>
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
