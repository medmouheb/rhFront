"use client";

import { useEffect, useState } from "react";
import hiringRequestsService from "@/services/hiring-requests.service";
import type { HiringRequest } from "@/types/hiring-request.types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth.context";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";

export default function HiringRequestsPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<HiringRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await hiringRequestsService.getHiringRequests();
            setRequests(response.requests || []);
        } catch (err: any) {
            setError(err.message || "Failed to fetch hiring requests");
        } finally {
            setLoading(false);
        }
    };

    const canCreate = ["RH", "Manager", "Directeur"].includes(user?.role || "");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-white">
                        Hiring Requests
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Manage recruitment needs and open positions
                    </p>
                </div>
                {canCreate && (
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
                        <Plus className="h-5 w-5" />
                        Create Request
                    </button>
                )}
            </div>

            {/* Requests Table */}
            <div className="rounded-lg bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">{error}</div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No hiring requests found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {requests.map((request) => (
                                    <tr
                                        key={request.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-dark dark:text-white">
                                                {request.position}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {request.department}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={
                                                    request.priority === "Urgent"
                                                        ? "error"
                                                        : request.priority === "High"
                                                            ? "warning"
                                                            : "info"
                                                }
                                            >
                                                {request.priority}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={
                                                    request.status === "Approved"
                                                        ? "success"
                                                        : request.status === "Rejected"
                                                            ? "error"
                                                            : "info"
                                                }
                                            >
                                                {request.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/hiring-requests/${request.id}`}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
