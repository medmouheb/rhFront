"use client";

import { useAuth } from "@/contexts/auth.context";
import {
    Users,
    UserCheck,
    Briefcase,
    Calendar,
    TrendingUp,
    Clock
} from "lucide-react";
import Link from "next/link";

export default function RHDashboard() {
    const { user } = useAuth();

    const stats = [
        {
            title: "Total Users",
            value: "0",
            icon: Users,
            color: "bg-blue-500",
            link: "/users",
        },
        {
            title: "Active Candidates",
            value: "0",
            icon: UserCheck,
            color: "bg-green-500",
            link: "/candidates",
        },
        {
            title: "Hiring Requests",
            value: "0",
            icon: Briefcase,
            color: "bg-purple-500",
            link: "/hiring-requests",
        },
        {
            title: "Interviews Scheduled",
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
                    RH Dashboard - Full system access
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Activity */}
                <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-dark dark:text-white">
                            Recent Activity
                        </h2>
                        <Clock className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="space-y-3">
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            No recent activity
                        </p>
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
                    <div className="space-y-3">
                        <Link
                            href="/users"
                            className="block rounded-lg bg-primary/10 p-3 text-primary transition hover:bg-primary/20"
                        >
                            <span className="font-medium">Manage Users</span>
                        </Link>
                        <Link
                            href="/candidates"
                            className="block rounded-lg bg-primary/10 p-3 text-primary transition hover:bg-primary/20"
                        >
                            <span className="font-medium">View Candidates</span>
                        </Link>
                        <Link
                            href="/hiring-requests"
                            className="block rounded-lg bg-primary/10 p-3 text-primary transition hover:bg-primary/20"
                        >
                            <span className="font-medium">Hiring Requests</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
