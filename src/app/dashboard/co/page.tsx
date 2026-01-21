"use client";

import { useAuth } from "@/contexts/auth.context";
import {
    UserCheck,
    Briefcase,
    Calendar,
    Eye,
    TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function CODashboard() {
    const { user } = useAuth();

    const stats = [
        {
            title: "Hiring Requests",
            value: "0",
            icon: Briefcase,
            color: "bg-purple-500",
            link: "/hiring-requests",
        },
        {
            title: "Candidates",
            value: "0",
            icon: UserCheck,
            color: "bg-green-500",
            link: "/candidates",
        },
        {
            title: "Interviews",
            value: "0",
            icon: Calendar,
            color: "bg-orange-500",
            link: "/interviews",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <h1 className="text-3xl font-bold text-dark dark:text-white">
                    Welcome back, {user?.username}!
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    CO Dashboard - View-Only Access
                </p>
            </div>

            {/* View-Only Notice */}
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        You have view-only access to the system
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.title}
                            href={stat.link}
                            className="group rounded-lg bg-white p-6 shadow-1 transition-all hover:shadow-lg dark:bg-gray-dark dark:shadow-card"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.title}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-dark dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.color} rounded-lg p-3`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* High-Level Metrics */}
            <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark dark:text-white">
                        High-Level Overview
                    </h2>
                    <TrendingUp className="h-5 w-5 text-gray-500" />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <span className="font-medium text-dark dark:text-white">
                            Total Hiring Requests
                        </span>
                        <span className="text-xl font-bold text-primary">0</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <span className="font-medium text-dark dark:text-white">
                            Active Candidates
                        </span>
                        <span className="text-xl font-bold text-primary">0</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <span className="font-medium text-dark dark:text-white">
                            Scheduled Interviews
                        </span>
                        <span className="text-xl font-bold text-primary">0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
