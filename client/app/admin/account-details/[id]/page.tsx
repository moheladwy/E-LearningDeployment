"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  affiliation: z.string().min(2, {
    message: "Affiliation must be at least 2 characters.",
  }),
  role: z.enum(["student", "instructor", "admin"]),
  bio: z.string().min(2, {
    message: "Bio must be at least 2 characters.",
  }),
  yoe: z.coerce.number().int().optional(),
});

export default function Component({ params }: { params: { id: number } }) {
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof FormSchema
  > | null>(null);

  useEffect(() => {
    async function fetchAccountDetails() {
      try {
        const URL = "http://localhost:8081/account/user/" + params.id;
        const response = await fetch(URL);
        const data = await response.json();
        setInitialValues(data);
      } catch (error) {
        alert("Failed to fetch account details.");
        window.location.href = "/admin/accounts";
      }
    }

    fetchAccountDetails();
  }, [params.id]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      affiliation: "",
      role: "student",
      bio: "",
      yoe: 0,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const watchRole = form.watch("role");

  async function updateDetails(data: z.infer<typeof FormSchema>) {
    // console.log(data);
    const cookies: any = require("js-cookie");
    const payload = {
      ...data,
      id: Number(params.id),
    };
    const response = await fetch("http://localhost:8081/account/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        jwt: cookies.get("jwt"),
      },
      body: JSON.stringify(payload),
    });
    // console.log(JSON.stringify(payload));
    if (response.ok) {
      alert("Account details updated successfully.");
      // window.location.reload();
    } else {
      alert("Failed to update account details.");
      // window.location.reload();
    }
  }

  return (
    <>
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
      </section>
      <div className="flex justify-center">
        {" "}
        <Link href={`/admin/account-details/${params.id}/pass`}>
          <Button>Change password</Button>
        </Link>
      </div>
      <main className="flex justify-center mt-2 mx-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updateDetails)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="affiliation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliation</FormLabel>
                  <FormControl>
                    <Input placeholder="University of Waterloo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watchRole === "instructor" && (
              <FormField
                control={form.control}
                name="yoe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update account</Button>
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
