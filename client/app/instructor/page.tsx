import Link from "next/link";
import { cookies } from "next/headers";
import { UserDropdown } from "@/components/account-dropdown";
import { accountAPI } from "../config";

async function getAccountDetails(id: number) {
	const URL: string = accountAPI + ":8081/account/user/" + id;
	// const URL: string = "http://localhost:8081/account/user/" + id;
	try {
		const res = await fetch(URL);
		const response = await res.json();
		const accountDetails: any = response;
		// console.log(accountDetails);
		return accountDetails.name;
	} catch (error) {
		return null;
	}
}

function getInitials(name: string) {
	const initials = name
		.match(/(\b\S)?/g)
		?.join("")
		?.match(/(^\S|\S$)?/g)
		?.join("");
	return initials || "N/A";
}

export default async function InstructorPage() {
	const cookieStore = cookies();
	const id = cookieStore.get("id")?.value;
	if (!id) {
		return <div>Not logged in</div>;
	}
	const accountDetails: string = await getAccountDetails(
		id as unknown as number
	);
	if (!accountDetails || cookieStore.get("role")?.value !== "instructor") {
		return <div>Failed to fetch account</div>;
	}
	const initials = getInitials(accountDetails);

	return (
		<main className="flex flex-col min-h-screen bg-gray-950 text-white">
			<header className="bg-gray-950 text-white py-4 px-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">Instructor Dashboard</h1>
					<UserDropdown
						initials={initials}
						accountDetails={accountDetails}
					/>
				</div>
			</header>
			<section className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					<Link
						className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-700 transition-colors h-full"
						href="/instructor/create"
					>
						<PlusIcon className="w-8 h-8" />
						<h3 className="text-lg font-semibold">Create Course</h3>
					</Link>
					<Link
						className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-700 transition-colors h-full"
						href="/instructor/courses"
					>
						<BookIcon className="w-8 h-8" />
						<h3 className="text-lg font-semibold">All Courses</h3>
					</Link>
					<Link
						className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-700 transition-colors h-full"
						href="/instructor/enrollments"
					>
						<UsersIcon className="w-8 h-8" />
						<h3 className="text-lg font-semibold">
							Manage Enrollments
						</h3>
					</Link>
				</div>
			</section>
		</main>
	);
}

function BookIcon(props: any) {
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
			<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
		</svg>
	);
}

function PlusIcon(props: any) {
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
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
}

function UsersIcon(props: any) {
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
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	);
}
