"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountCard } from "@/components/account-card";
import { account } from "@/app/config";

async function fetchAllAccounts(token: string) {
	const URL = account + ":8081/account/users";
	const response = await fetch(URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			jwt: token,
		},
	});
	if (response.ok) {
		const accounts = await response.json();
		return accounts;
	}
	// console.log(response);
	return [];
}

const handleEdit = async (accountId: number) => {
	window.location.href = "/admin/account-details/" + accountId;
};

const handleDelete = async (accountId: number) => {
	const URL = account + ":8081/account/delete/" + accountId;
	const jwt = require("js-cookie").get("jwt");
	const response = await fetch(URL, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			jwt: jwt,
		},
	});
	if (response.ok) {
		alert("Account deleted successfully");
		window.location.href = "/admin/accounts";
	} else {
		alert("Failed to delete account");
	}
};

export default function AccountsPage() {
	const [accounts, setAccounts] = useState([]);
	const [loading, setLoading] = useState(true);
	const cookies = require("js-cookie");

	useEffect(() => {
		const fetchData = async () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			const token = cookies.get("jwt");
			if (token) {
				const accountData = await fetchAllAccounts(token);
				setAccounts(accountData);
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
					<h2 className="text-2xl font-bold">Manage Accounts</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{accounts.length > 0 ? (
						accounts.map((account: any) => (
							<AccountCard
								key={account.id}
								id={account.id}
								viewDetails={() => handleEdit(account.id)}
								removeAccount={() => handleDelete(account.id)}
								role={account.role}
								name={account.name}
							/>
						))
					) : (
						<p className="text-center text-gray-400">
							No Accounts Found.
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
