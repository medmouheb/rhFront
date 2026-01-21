"use client";

import { useAuth } from "@/contexts/auth.context";
import {
    UserCheck,
    Briefcase,
    Calendar,
    TrendingUp,
    Target,
    BarChart3
} from "lucide-react";
import Link from "next/link";

export default function DirecteurDashboard() {
    const { user } = useAuth();

    const stats = [
        {
            title: "Total Hiring Requests",
            value: "0",
            icon: Briefcase,
            color: "bg-purple-500",
            link: "/hiring-requests",
        },
        {
            title: "Candidates Pipeline",
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
                    Directeur Dashboard - Executive Overview
                </p>
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

            {/* Executive Analytics */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Strategic Overview */}
                <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-dark dark:text-white">
                            Strategic Overview
                        </h2>
                        <Target className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <span className="text-sm font-medium text-dark dark:text-white">
                                Positions to Fill
                            </span>
                            <span className="text-lg font-bold text-primary">0</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <span className="text-sm font-medium text-dark dark:text-white">
                                In Progress
                            </span>
                            <span className="text-lg font-bold text-primary">0</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <span className="text-sm font-medium text-dark dark:text-white">
                                Completed This Month
                            </span>
                            <span className="text-lg font-bold text-primary">0</span>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-dark dark:text-white">
                            Performance Metrics
                        </h2>
                        <BarChart3 className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <span className="text-sm font-medium text-dark dark:text-white">
                                Time to Hire (Avg)
                            </span>
                            <span className="text-lg font-bold text-primary">N/A</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <span className="text-sm font-medium text-dark dark:text-white">
                                Success Rate
                            </span>
                            <span className="text-lg font-bold text-primary">N/A</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <span className="text-sm font-medium text-dark dark:text-white">
                                Active Recruiters
                            </span>
                            <span className="text-lg font-bold text-primary">0</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark dark:text-white">
                        Quick Actions
                    </h2>
                    <TrendingUp className="h-5 w-5 text-gray-500" />
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Link
                        href="/hiring-requests"
                        className="block rounded-lg bg-primary/10 p-4 text-center text-primary transition hover:bg-primary/20"
                    >
                        <span className="font-medium">Review Hiring Requests</span>
                    </Link>
                    <Link
                        href="/candidates"
                        className="block rounded-lg bg-primary/10 p-4 text-center text-primary transition hover:bg-primary/20"
                    >
                        <span className="font-medium">View Candidates</span>
                    </Link>
                    <Link
                        href="/interviews"
                        className="block rounded-lg bg-primary/10 p-4 text-center text-primary transition hover:bg-primary/20"
                    >
                        <span className="font-medium">Interview Schedule</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
