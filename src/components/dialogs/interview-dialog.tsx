"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Interview, InterviewStatus } from "@/types/interview.types";
import candidatesService from "@/services/candidates.service";
import type { Candidate } from "@/types/candidate.types";

interface InterviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (interviewData: any) => Promise<void>;
    interview?: Interview | null;
    mode: "create" | "edit";
}

export function InterviewDialog({ isOpen, onClose, onSave, interview, mode }: InterviewDialogProps) {
    const [formData, setFormData] = useState({
        candidateId: interview?.candidateId || "",
        hiringRequestId: interview?.hiringRequestId || "",
        interviewDate: interview?.interviewDate ? new Date(interview.interviewDate).toISOString().slice(0, 16) : "",
        duration: interview?.duration || 60,
        location: interview?.location || "",
        interviewers: interview?.interviewers?.join(", ") || "",
        status: (interview?.status || "Scheduled") as InterviewStatus,
        notes: interview?.notes || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [candidates, setCandidates] = useState<Candidate[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchCandidates();
        }
    }, [isOpen]);

    const fetchCandidates = async () => {
        try {
            const response = await candidatesService.getCandidates();
            setCandidates(response.candidates || []);
        } catch (err) {
            console.error("Failed to fetch candidates:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.candidateId || !formData.interviewDate || !formData.location) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            const submitData = {
                ...formData,
                interviewers: formData.interviewers.split(",").map(i => i.trim()).filter(i => i),
                duration: Number(formData.duration),
            };

            await onSave(submitData);
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to save interview");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark m-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark dark:text-white">
                        {mode === "create" ? "Schedule Interview" : "Edit Interview"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Candidate */}
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Candidate *
                            </label>
                            <select
                                value={formData.candidateId}
                                onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                disabled={loading}
                                required
                            >
                                <option value="">Select candidate</option>
                                {candidates.map((candidate) => (
                                    <option key={(candidate as any)._id} value={(candidate as any)._id}>
                                        {candidate.firstName} {candidate.lastName} - {candidate.position}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Interview Date */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.interviewDate}
                                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                disabled={loading}
                                min="15"
                                step="15"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Location *
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="e.g., Office Room 301 or Zoom link"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as InterviewStatus })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                disabled={loading}
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Rescheduled">Rescheduled</option>
                            </select>
                        </div>

                        {/* Interviewers */}
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Interviewers (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.interviewers}
                                onChange={(e) => setFormData({ ...formData, interviewers: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="e.g., John Doe, Jane Smith"
                                disabled={loading}
                            />
                        </div>

                        {/* Notes */}
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                rows={3}
                                placeholder="Additional notes..."
                                disabled={loading}
                            />
                        </div>
                    </div>

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
                            {loading ? "Saving..." : mode === "create" ? "Schedule Interview" : "Update Interview"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
