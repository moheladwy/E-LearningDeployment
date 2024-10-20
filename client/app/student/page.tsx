import Link from "next/link";
import { cookies } from "next/headers";
import { UserDropdown } from "@/components/account-dropdown";

async function getAccountDetails(id: number) {
	const URL: string = "http://accounts-service:8081/account/user/" + id;
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

export default async function StudentPage() {
	const cookieStore = cookies();
	const id = cookieStore.get("id")?.value;
	if (!id) {
		return <div>Not logged in</div>;
	}
	const accountDetails: string = await getAccountDetails(
		id as unknown as number
	);
	if (!accountDetails || cookieStore.get("role")?.value !== "student") {
		return <div>Failed to fetch account</div>;
	}
	const initials = getInitials(accountDetails);

	return (
		<main className="flex flex-col min-h-screen">
			<header className="bg-gray-950 text-white py-4 px-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">Student Dashboard</h1>
					<UserDropdown
						initials={initials}
						accountDetails={accountDetails}
					/>
				</div>
			</header>
			<section className="container mx-auto py-8 px-4 md:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				<Link
					className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
					href="/student/courses"
				>
					<BookOpenIcon className="w-8 h-8 text-gray-600" />
					<span className="text-gray-700 font-medium">
						ALL COURSES
					</span>
				</Link>
				<Link
					className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
					href="/student/notifications"
				>
					<BellIcon className="w-8 h-8 text-gray-600" />
					<span className="text-gray-700 font-medium">
						NOTIFICATIONS
					</span>
				</Link>
				<Link
					className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
					href="/student/enrollments"
				>
					<ClipboardListIcon className="w-8 h-8 text-gray-600" />
					<span className="text-gray-700 font-medium">
						VIEW ENROLLMENTS
					</span>
				</Link>
				<Link
					className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
					href="/student/rating"
				>
					<StarIcon className="w-8 h-8 text-gray-600" />
					<span className="text-gray-700 font-medium">
						SUBMIT COURSE RATING
					</span>
				</Link>
			</section>
		</main>
	);
}

function BellIcon(props: any) {
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
			<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
			<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
		</svg>
	);
}

function BookOpenIcon(props: any) {
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
			<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
			<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
		</svg>
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

function ClipboardListIcon(props: any) {
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
			<path d="M12 11h4" />
			<path d="M12 16h4" />
			<path d="M8 11h.01" />
			<path d="M8 16h.01" />
		</svg>
	);
}
