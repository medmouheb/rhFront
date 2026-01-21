"use client";

import { useAuth } from "@/contexts/auth.context";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

export default function InterviewsPage() {
    const { user } = useAuth();

    const canSchedule = ["RH", "Manager"].includes(user?.role || "");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-white">
                        Interviews
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Schedule and manage candidate interviews
                    </p>
                </div>
                {canSchedule && (
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
                        <Plus className="h-5 w-5" />
                        Schedule Interview
                    </button>
                )}
            </div>

            {/* Calendar View Placeholder */}
            <div className="rounded-lg bg-white p-12 text-center shadow-1 dark:bg-gray-dark dark:shadow-card">
                <CalendarIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-xl font-medium text-dark dark:text-white">
                    Interview Calendar
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    No interviews scheduled yet
                </p>
            </div>
        </div>
    );
}
