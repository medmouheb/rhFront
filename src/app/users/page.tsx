"use client";

import { useEffect, useState } from "react";
import usersService from "@/services/users.service";
import type { User } from "@/types/user.types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth.context";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState("");

    // Only RH can access this page
    if (currentUser?.role !== "RH") {
        return (
            <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
                <p className="text-red-600 dark:text-red-400">
                    Access denied. Only RH users can manage users.
                </p>
            </div>
        );
    }

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await usersService.getUsers({
                role: roleFilter || undefined,
            });
            setUsers(response.users || []);
        } catch (err: any) {
            setError(err.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await usersService.deleteUser(id);
            fetchUsers();
        } catch (err: any) {
            alert(err.message || "Failed to delete user");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-white">
                        Users Management
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Manage system users and their roles
                    </p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
                    <Plus className="h-5 w-5" />
                    Add User
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-lg bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 md:w-auto dark:border-gray-600 dark:bg-gray-800"
                >
                    <option value="">All Roles</option>
                    <option value="RH">RH</option>
                    <option value="Manager">Manager</option>
                    <option value="CO">CO</option>
                    <option value="Directeur">Directeur</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="rounded-lg bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">{error}</div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No users found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-dark dark:text-white">
                                                {user.username}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={
                                                    user.role === "RH"
                                                        ? "error"
                                                        : user.role === "Manager"
                                                            ? "warning"
                                                            : user.role === "Directeur"
                                                                ? "success"
                                                                : "info"
                                                }
                                            >
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button className="text-yellow-600 hover:text-yellow-700">
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
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
