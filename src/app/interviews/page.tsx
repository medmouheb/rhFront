"use client";

import { useEffect, useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import interviewsService from "@/services/interviews.service";
import type { Interview } from "@/types/interview.types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth.context";
import { Plus, Trash2, Edit } from "lucide-react";
import { InterviewDialog } from "@/components/dialogs/interview-dialog";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function InterviewsPage() {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<View>("month");
    const [date, setDate] = useState(new Date());

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await interviewsService.getInterviews();
            setInterviews(response.interviews || []);
        } catch (err: any) {
            setError(err.message || "Failed to fetch interviews");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedInterview(null);
        setDialogMode("create");
        setIsDialogOpen(true);
    };

    const handleEdit = (interview: Interview) => {
        setSelectedInterview(interview);
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    const handleSave = async (interviewData: any) => {
        if (dialogMode === "create") {
            await interviewsService.createInterview(interviewData);
        } else if (selectedInterview) {
            await interviewsService.updateInterview((selectedInterview as any)._id, interviewData);
        }
        fetchInterviews();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this interview?")) return;

        try {
            await interviewsService.deleteInterview(id);
            fetchInterviews();
        } catch (err: any) {
            alert(err.message || "Failed to delete interview");
        }
    };

    // Transform interviews for calendar
    const calendarEvents = useMemo(() => {
        return interviews.map((interview) => ({
            id: (interview as any)._id,
            title: `${interview.candidateName || "Interview"} - ${interview.position || ""}`,
            start: new Date(interview.interviewDate),
            end: new Date(new Date(interview.interviewDate).getTime() + interview.duration * 60000),
            resource: interview,
        }));
    }, [interviews]);

    // Event style getter
    const eventStyleGetter = (event: any) => {
        const interview: Interview = event.resource;
        let backgroundColor = "#3174ad";

        switch (interview.status) {
            case "Scheduled":
                backgroundColor = "#3b82f6"; // blue
                break;
            case "Completed":
                backgroundColor = "#10b981"; // green
                break;
            case "Cancelled":
                backgroundColor = "#ef4444"; // red
                break;
            case "Rescheduled":
                backgroundColor = "#f59e0b"; // orange
                break;
        }

        return {
            style: {
                backgroundColor,
                borderRadius: "5px",
                opacity: 0.8,
                color: "white",
                border: "0px",
                display: "block",
            },
        };
    };

    const canSchedule = user?.role === "RH" || user?.role === "Manager";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-white">Interviews</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Schedule and manage candidate interviews
                    </p>
                </div>
                {canSchedule && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
                    >
                        <Plus className="h-5 w-5" />
                        Schedule Interview
                    </button>
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 rounded-lg bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-blue-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-green-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-red-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Cancelled</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-orange-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Rescheduled</span>
                </div>
            </div>

            {/* Calendar */}
            <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading interviews...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">{error}</div>
                ) : (
                    <div style={{ height: "700px" }}>
                        <Calendar
                            localizer={localizer}
                            events={calendarEvents}
                            startAccessor="start"
                            endAccessor="end"
                            view={view}
                            onView={setView}
                            date={date}
                            onNavigate={setDate}
                            eventPropGetter={eventStyleGetter}
                            onSelectEvent={(event) => handleEdit(event.resource)}
                            popup
                            style={{ height: "100%" }}
                        />
                    </div>
                )}
            </div>

            {/* Upcoming Interviews List */}
            <div className="rounded-lg bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-dark dark:text-white">
                        Upcoming Interviews
                    </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {interviews
                        .filter((interview) => new Date(interview.interviewDate) > new Date())
                        .sort((a, b) => new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime())
                        .slice(0, 5)
                        .map((interview) => (
                            <div
                                key={(interview as any)._id}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <div className="flex-1">
                                    <h3 className="font-medium text-dark dark:text-white">
                                        {interview.candidateName || "Interview"}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {interview.position || "Position"} • {interview.location}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        {format(new Date(interview.interviewDate), "PPp")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant={
                                            interview.status === "Scheduled"
                                                ? "info"
                                                : interview.status === "Completed"
                                                    ? "success"
                                                    : interview.status === "Cancelled"
                                                        ? "error"
                                                        : "warning"
                                        }
                                    >
                                        {interview.status}
                                    </Badge>
                                    {canSchedule && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(interview)}
                                                className="text-yellow-600 hover:text-yellow-700"
                                                aria-label={`Edit interview for ${interview.candidateName}`}
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete((interview as any)._id)}
                                                className="text-red-600 hover:text-red-700"
                                                aria-label={`Delete interview for ${interview.candidateName}`}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    {interviews.filter((interview) => new Date(interview.interviewDate) > new Date()).length ===
                        0 && (
                            <div className="p-8 text-center text-gray-500">No upcoming interviews</div>
                        )}
                </div>
            </div>

            {/* Interview Dialog */}
            <InterviewDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
                interview={selectedInterview}
                mode={dialogMode}
            />
        </div>
    );
}
