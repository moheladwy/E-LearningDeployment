"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { accountAPI } from "./config";

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

const FormSchema = z.object({
	identifier: z.string().min(2, {
		message: "Enter valid username or email.",
	}),
	password: z.string().min(2, {
		message: "Password must be at least 8 characters.",
	}),
});

export default function LoginForm() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	const Cookies: any = require("js-cookie");
	const jose: any = require("jose");
	const router = useRouter();

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const response = await fetch(
			accountAPI + ":8081/account/login",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);

		if (response.ok) {
			const result = await response.json();
			const claims = jose.decodeJwt(result.cookie.token);
			Cookies.set(result.cookie.name, result.cookie.token);
			Cookies.set("id", claims.id);
			Cookies.set("role", claims.role.toLowerCase());
			// console.log(claims);
			alert("Login successful!");

			if (claims.role.toLowerCase() == "student") {
				router.push("/student");
				return;
			} else if (claims.role.toLowerCase() == "instructor") {
				router.push("/instructor");
				return;
			} else if (claims.role.toLowerCase() == "admin") {
				router.push("/admin");
				return;
			} else {
				alert("Invalid role.");
				router.push("/");
				return;
			}
		} else {
			alert("Login failed.");
			router.push("/");
			return;
		}
	}

	return (
		<main className="grid justify-items-center mt-16">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-2/3 space-y-6"
				>
					<FormField
						control={form.control}
						name="identifier"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username or Email</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter username or email"
										{...field}
									/>
								</FormControl>
								{/* <FormDescription>This is your public display name.</FormDescription> */}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								{/* <FormDescription>This is your password.</FormDescription> */}
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			<div>
				<h3>Don&apos;t have an account yet? </h3>
				<a href="/register" className="text-blue-500">
					Register here.
				</a>
			</div>
		</main>
	);
}
