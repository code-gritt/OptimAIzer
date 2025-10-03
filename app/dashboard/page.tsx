"use client";

export const dynamic = "force-dynamic"; // Force CSR
export const revalidate = 0;

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Hero, HeroSubtitle, HeroTitle } from "../components/hero";
import { Button } from "../components/button";
import { useAuthStore } from "../../lib/store";
import {
  getMe,
  getActivities,
  updateActivity,
  deleteActivity,
} from "../../lib/mutation";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { Dialog, DialogContent, DialogTrigger } from "react-dialog";
import { Edit, Trash2 } from "lucide-react";
import { Loader } from "../components/Loader";

interface Activity {
  id: number;
  user_id: number;
  activity: string;
  timestamp: string;
  user: { email: string };
}

function DashboardContent() {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    const fetchUserAndActivities = async (authToken: string) => {
      setLoading(true);
      try {
        const userData = await getMe(authToken);
        const activityData = await getActivities(authToken);
        useAuthStore.setState({ user: userData, token: authToken });
        setActivities(activityData);
      } catch (err: any) {
        setError(err.message);
        useAuthStore.getState().clearAuth();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    if (tokenFromUrl) {
      fetchUserAndActivities(tokenFromUrl);
      router.replace("/dashboard");
    } else if (token) {
      fetchUserAndActivities(token);
    } else {
      router.push("/login");
    }

    const updateActivities = async () => {
      if (token) {
        const newActivities = await getActivities(token);
        setActivities(newActivities);
      }
    };
    window.addEventListener("activityUpdated", updateActivities);
    return () =>
      window.removeEventListener("activityUpdated", updateActivities);
  }, [token, searchParams, router]);

  const columns: ColumnDef<Activity>[] = [
    { accessorKey: "id", header: "ID" },
    {
      accessorKey: "user.email",
      header: "User",
      cell: ({ row }: { row: Row<Activity> }) => {
        const initials = row.original.user.email.slice(0, 2).toUpperCase();
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ac8eff] text-sm font-semibold text-white">
            {initials}
          </div>
        );
      },
    },
    { accessorKey: "activity", header: "Activity" },
    { accessorKey: "timestamp", header: "Timestamp" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<Activity> }) => {
        const activity = row.original;
        const [isEditOpen, setIsEditOpen] = useState(false);
        const [isDeleteOpen, setIsDeleteOpen] = useState(false);
        const [editActivity, setEditActivity] = useState(activity.activity);

        const handleEdit = async () => {
          try {
            await updateActivity(token!, activity.id, editActivity);
            setActivities((prev) =>
              prev.map((a) =>
                a.id === activity.id ? { ...a, activity: editActivity } : a
              )
            );
            setIsEditOpen(false);
          } catch (err: any) {
            setError(err.message);
          }
        };

        const handleDelete = async () => {
          try {
            await deleteActivity(token!, activity.id);
            setActivities((prev) => prev.filter((a) => a.id !== activity.id));
            setIsDeleteOpen(false);
          } catch (err: any) {
            setError(err.message);
          }
        };

        return (
          <div className="flex space-x-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <button>
                  <Edit className="h-5 w-5 text-[#ac8eff] hover:text-white" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <h3 className="text-lg font-semibold text-white">
                  Edit Activity
                </h3>
                <input
                  type="text"
                  value={editActivity}
                  onChange={(e) => setEditActivity(e.target.value)}
                  className="mt-2 w-full rounded-md border border-white-a08 bg-background/50 p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ac8eff]"
                />
                <div className="mt-4 flex space-x-2">
                  <Button variant="primary" size="small" onClick={handleEdit}>
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <button>
                  <Trash2 className="text-red-500 hover:text-red-300 h-5 w-5" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <h3 className="text-lg font-semibold text-white">
                  Delete Activity
                </h3>
                <p className="mt-2 text-white/80">
                  Are you sure you want to delete this activity?
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="primary" size="small" onClick={handleDelete}>
                    Confirm
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: activities,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <Loader show={true} />;
  if (!user || !token) return null;

  return (
    <Hero>
      <HeroTitle className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
        Welcome, {user.email}
      </HeroTitle>
      <HeroSubtitle className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
        Your Credits: {user.credits} <br />
        Start reviewing and debugging your code with OptimAIzer’s AI-powered
        tools.
      </HeroSubtitle>

      <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Button
          href="/upload"
          variant="primary"
          size="large"
          className="w-full text-center sm:w-auto"
        >
          Upload Code
        </Button>
        <Button
          href="/analysis"
          variant="secondary"
          size="large"
          className="w-full text-center sm:w-auto"
        >
          Start Analysis
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-white">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-white-a08">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 text-left font-semibold text-white/80"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white-a08 hover:bg-background/30"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
    </Hero>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loader show={true} />}>
      <DashboardContent />
    </Suspense>
  );
}
