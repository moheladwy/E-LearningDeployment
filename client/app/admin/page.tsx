import Link from "next/link";
import { UserDropdown } from "@/components/account-dropdown";
import { cookies } from "next/headers";
import { course, account } from "../config";

async function getAccountDetails(id: number) {
	const URL: string = account + ":8081/account/user/" + id;
	// const URL: string = "http://localhost:8081/account/user/" + id;
	try {
		const res = await fetch(URL);
		const response = await res.json();
		const accountDetails: any = response;
		return accountDetails.name;
	} catch (error) {
		return null;
	}
}

async function fetchAccountStats() {
	const URL: string = account + ":8081/account/stats";
	// const URL: string = "http://localhost:8081/account/stats";
	try {
		const res = await fetch(URL, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				jwt: cookies().get("jwt")?.value as string,
			},
		});
		const response = await res.json();
		const stats: any = response;
		return stats;
	} catch (error) {
		return null;
	}
}

async function fetchCourseStats() {
	const URL: string = course + ":8080/learning/course/stats";
	// const URL: string = "http://localhost:8080/learning/course/stats";

	const res = await fetch(URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			jwt: cookies().get("jwt")?.value as string,
		},
	});
	const response = await res.json();
	return response;
}

async function fetchEnrollmentStats() {
	const URL: string = course + ":8080/learning/enrollment/stats";
	// const URL: string = "http://localhost:8080/learning/enrollment/stats";
	const res = await fetch(URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			jwt: cookies().get("jwt")?.value as string,
		},
	});
	const response = await res.json();
	return response;
}

function getInitials(name: string) {
	const initials = name
		.match(/(\b\S)?/g)
		?.join("")
		?.match(/(^\S|\S$)?/g)
		?.join("");
	return initials || "N/A";
}

export default async function AdminPage() {
	const cookieStore = cookies();
	const id = cookieStore.get("id")?.value;
	if (!id) {
		return <div>Not logged in</div>;
	}
	const accountDetails: string = await getAccountDetails(
		id as unknown as number
	);
	if (!accountDetails || cookieStore.get("role")?.value !== "admin") {
		return <div>Failed to fetch account</div>;
	}
	const initials = getInitials(accountDetails);
	const accountStats = await fetchAccountStats();
	const courseStats = await fetchCourseStats();
	const enrollmentStats = await fetchEnrollmentStats();
	return (
		<main
			key="1"
			className="flex flex-col min-h-screen bg-gray-950 text-white"
		>
			<header className="py-4 px-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">Admin Dashboard</h1>
					<UserDropdown
						initials={initials}
						accountDetails={accountDetails}
					/>
				</div>
			</header>
			<section className="container mx-auto py-4 px-4 md:px-6 lg:px-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
				<Link
					className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col gap-4 hover:bg-gray-700 transition-colors"
					href="/admin/accounts"
				>
					<div className="flex items-center justify-center">
						<UsersIcon className="h-8 w-8 mr-2" />
						<h2 className="text-xl font-bold">Manage Accounts</h2>
					</div>
				</Link>
				<Link
					className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col gap-4 hover:bg-gray-700 transition-colors"
					href="/admin/requests"
				>
					<div className="flex items-center justify-center">
						<BookIcon className="h-8 w-8 mr-2" />
						<h2 className="text-xl font-bold">Course Requests</h2>
					</div>
				</Link>
				<Link
					className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col gap-4 hover:bg-gray-700 transition-colors"
					href="/admin/courses"
				>
					<div className="flex items-center justify-center">
						<ClipboardIcon className="h-8 w-8 mr-2" />
						<h2 className="text-xl font-bold">Manage Courses</h2>
					</div>
				</Link>
			</section>
			<section className="container mx-auto py-8 px-4 md:px-6 lg:px-8 flex-1 grid grid-cols-1 lg:grid-cols-1 gap-8">
				<div className="bg-gray-800 shadow-md rounded-lg p-6 flex flex-col gap-4 mx-auto w-full">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<UsersIcon className="h-8 w-8 mb-2 text-gray-50" />
							<h3 className="text-xl font-bold text-gray-50">
								Students
							</h3>
							<p className="text-4xl font-bold text-gray-50">
								{accountStats.students}
							</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<SchoolIcon className="h-8 w-8 mb-2 text-gray-50" />
							<h3 className="text-xl font-bold text-gray-50">
								Instructors
							</h3>
							<p className="text-4xl font-bold text-gray-50">
								{accountStats.instructors}
							</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<BookIcon className="h-8 w-8 mb-2 text-gray-50" />
							<h3 className="text-xl font-bold text-gray-50">
								Admins
							</h3>
							<p className="text-4xl font-bold text-gray-50">
								{accountStats.admins}
							</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<BookIcon className="h-8 w-8 mb-2 text-gray-50" />
							<h3 className="text-xl font-bold text-gray-50">
								Accepted Courses
							</h3>
							<p className="text-4xl font-bold text-gray-50">
								{courseStats.accepted}
							</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<BookIcon className="h-8 w-8 mb-2 text-gray-50" />
							<h3 className="text-xl font-bold text-gray-50">
								Rejected Courses
							</h3>
							<p className="text-4xl font-bold text-gray-50">
								{courseStats.rejected}
							</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<BookIcon className="h-8 w-8 mb-2 text-gray-50" />
							<h3 className="text-xl font-bold text-gray-50">
								Pending Courses
							</h3>
							<p className="text-4xl font-bold text-gray-50">
								{courseStats.pending}
							</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<BookIcon className="h-8 w-8 mb-2 text-gray-50" />
							<h3 className="text-xl font-bold text-gray-50">
								Accepted Enrollments
							</h3>
							<p className="text-4xl font-bold text-gray-50">
								{enrollmentStats.accepted}
							</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<BookIcon className="h-8 w-8 mb-2 text-gray-50" />
							<h3 className="text-xl font-bold text-gray-50">
								Rejected Enrollments
							</h3>
							<p className="text-4xl font-bold text-gray-50">
								{enrollmentStats.rejected}
							</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<BookIcon className="h-8 w-8 mb-2 text-gray-50" />
							<h3 className="text-xl font-bold text-gray-50">
								Pending Enrollments
							</h3>
							<p className="text-4xl font-bold text-gray-50">
								{enrollmentStats.pending}
							</p>
						</div>
					</div>
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

function ClipboardIcon(props: any) {
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
			<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
			<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
		</svg>
	);
}

function SchoolIcon(props: any) {
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
			<path d="M14 22v-4a2 2 0 1 0-4 0v4" />
			<path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
			<path d="M18 5v17" />
			<path d="m4 6 8-4 8 4" />
			<path d="M6 5v17" />
			<circle cx="12" cy="9" r="2" />
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
