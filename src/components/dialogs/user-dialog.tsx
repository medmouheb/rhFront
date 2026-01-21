"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { User, UserRole } from "@/types/user.types";

interface UserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userData: { username: string; password?: string; role: UserRole }) => Promise<void>;
    user?: User | null;
    mode: "create" | "edit";
}

export function UserDialog({ isOpen, onClose, onSave, user, mode }: UserDialogProps) {
    const [formData, setFormData] = useState({
        username: user?.username || "",
        password: "",
        role: (user?.role || "Manager") as UserRole,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.username.trim()) {
            setError("Username is required");
            return;
        }

        if (mode === "create" && !formData.password) {
            setError("Password is required for new users");
            return;
        }

        try {
            setLoading(true);
            const submitData: any = {
                username: formData.username,
                role: formData.role,
            };

            // Only include password if provided
            if (formData.password) {
                submitData.password = formData.password;
            }

            await onSave(submitData);
            onClose();

            // Reset form
            setFormData({
                username: "",
                password: "",
                role: "Manager",
            });
        } catch (err: any) {
            setError(err.message || "Failed to save user");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark dark:text-white">
                        {mode === "create" ? "Add New User" : "Edit User"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder="Enter username"
                            disabled={loading}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                            Password {mode === "edit" && "(leave blank to keep current)"}
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder={mode === "create" ? "Enter password" : "Enter new password (optional)"}
                            disabled={loading}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                            Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            disabled={loading}
                        >
                            <option value="rh">RH</option>
                            <option value="manager">Manager</option>
                            <option value="co">CO</option>
                            <option value="directeur">Directeur</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : mode === "create" ? "Create User" : "Update User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
