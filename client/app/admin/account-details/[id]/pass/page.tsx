"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
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

const PasswordFormSchema = z.object({
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function Component({ params }: { params: { id: number } }) {
  async function changePassword(data: z.infer<typeof PasswordFormSchema>) {
    const cookies: any = require("js-cookie");
    const payload = {
      id: params.id,
      password: data.password,
    };
    const response = await fetch("http://localhost:8081/account/changePass", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        jwt: cookies.get("jwt"),
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      alert("Password updated successfully.");
      window.location.reload();
    } else {
      alert("Failed to update password.");
      window.location.reload();
    }
  }

  const passwordForm = useForm<z.infer<typeof PasswordFormSchema>>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });
  return (
    <>
      <header className="py-3 border-b-4">
        <div className="flex items-center justify-between">
          <Link
            className="flex items-center gap-2"
            href={"/admin/acount-details/" + params.id}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </Link>
        </div>
      </header>
      <section className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Accounts</h2>
        </div>
      </section>
      <main className="flex justify-center mt-2 mx-10">
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(changePassword)}
            className="w-2/3 space-y-6 mx-10"
          >
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Password</Button>
          </form>
        </Form>
      </main>
    </>
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
