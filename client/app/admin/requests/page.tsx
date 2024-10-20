"use client";

import { CourseRequestCard } from "@/components/course-card-adm";
import Link from "next/link";
import { useEffect, useState } from "react";

async function fetchPendingCourseRequests(token: string) {
	const URL = "http://courses-service:8080/learning/course/pending";
	const response = await fetch(URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			jwt: token,
		},
	});
	if (response.ok) {
		const courseRequests = await response.json();
		return courseRequests;
	}
	return [];
}

const handleAccept = async (courseId: number) => {
	const URL = "http://courses-service:8080/learning/course/accept/";
	const jwt = require("js-cookie").get("jwt");
	const response = await fetch(URL + courseId, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			jwt: jwt,
		},
	});
	if (response.ok) {
		alert("Course request accepted");
		window.location.href = "/admin/requests";
	} else {
		alert("Failed to accept course request");
	}
};

const handleReject = async (courseId: number) => {
	const URL = "http://courses-service:8080/learning/course/reject/";
	const jwt = require("js-cookie").get("jwt");
	const response = await fetch(URL + courseId, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			jwt: jwt,
		},
	});
	if (response.ok) {
		alert("Course request rejected");
		window.location.href = "/admin/requests";
	} else {
		alert("Failed to reject course request");
	}
};

export default function CourseRequestsPage() {
	const [courseRequests, setCourseRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const cookies = require("js-cookie");

	useEffect(() => {
		const fetchData = async () => {
			const token = cookies.get("jwt");
			if (token) {
				const courseRequestsData = await fetchPendingCourseRequests(
					token
				);
				setCourseRequests(courseRequestsData);
			}
			setLoading(false);
		};

		fetchData();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<main className="flex flex-col min-h-screen bg-gray-950 text-white">
			<header className="py-3 border-b-4">
				<div className="flex items-center justify-between">
					<Link className="flex items-center gap-2" href="/admin">
						<ArrowLeftIcon className="w-5 h-5" />
						<h1 className="text-2xl font-bold">Admin Dashboard</h1>
					</Link>
				</div>
			</header>
			<section className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold">
						Manage Course Requests
					</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{courseRequests.length > 0 ? (
						courseRequests.map((courseRequest: any) => (
							<CourseRequestCard
								key={courseRequest.id}
								id={courseRequest.id}
								onAccept={() => handleAccept(courseRequest.id)}
								onReject={() => handleReject(courseRequest.id)}
							/>
						))
					) : (
						<p className="text-center text-gray-400">
							No Course Requests found.
						</p>
					)}
				</div>
			</section>
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
