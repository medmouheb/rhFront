"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Candidate, CandidateStatus } from "@/types/candidate.types";

interface CandidateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (candidateData: any) => Promise<void>;
    candidate?: Candidate | null;
    mode: "create" | "edit";
}

export function CandidateDialog({ isOpen, onClose, onSave, candidate, mode }: CandidateDialogProps) {
    const [formData, setFormData] = useState({
        firstName: candidate?.firstName || "",
        lastName: candidate?.lastName || "",
        email: candidate?.email || "",
        phone: candidate?.phone || "",
        position: candidate?.position || "",
        positionAppliedFor: candidate?.positionAppliedFor || "",
        status: (candidate?.status || "RECEIVED") as CandidateStatus,
        resume: candidate?.resume || "",
        coverLetter: candidate?.coverLetter || "",
        source: candidate?.source || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
            setError("First name, last name, and email are required");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            await onSave(formData);
            onClose();

            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                position: "",
                positionAppliedFor: "",
                status: "RECEIVED",
                resume: "",
                coverLetter: "",
                source: "",
            });
        } catch (err: any) {
            setError(err.message || "Failed to save candidate");
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
                        {mode === "create" ? "Add New Candidate" : "Edit Candidate"}
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
                        {/* First Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                First Name *
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="Enter first name"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="Enter last name"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="email@example.com"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="+1234567890"
                                disabled={loading}
                            />
                        </div>

                        {/* Position */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Position
                            </label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="e.g., Software Engineer"
                                disabled={loading}
                            />
                        </div>

                        {/* Position Applied For */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Position Applied For
                            </label>
                            <input
                                type="text"
                                value={formData.positionAppliedFor}
                                onChange={(e) => setFormData({ ...formData, positionAppliedFor: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="e.g., Senior Developer"
                                disabled={loading}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as CandidateStatus })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                disabled={loading}
                            >
                                <option value="RECEIVED">Received</option>
                                <option value="SHORTLISTED">Shortlisted</option>
                                <option value="TECHNICAL_INTERVIEW">Technical Interview</option>
                                <option value="HR_INTERVIEW">HR Interview</option>
                                <option value="SELECTED">Selected</option>
                                <option value="MEDICAL_VISIT">Medical Visit</option>
                                <option value="OFFER_SENT">Offer Sent</option>
                                <option value="HIRED">Hired</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>

                        {/* Source */}
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Source
                            </label>
                            <input
                                type="text"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="e.g., LinkedIn, Referral, Job Board"
                                disabled={loading}
                            />
                        </div>

                        {/* Resume URL */}
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Resume URL
                            </label>
                            <input
                                type="url"
                                value={formData.resume}
                                onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="https://..."
                                disabled={loading}
                            />
                        </div>

                        {/* Cover Letter */}
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                Cover Letter
                            </label>
                            <textarea
                                value={formData.coverLetter}
                                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                rows={3}
                                placeholder="Cover letter or additional notes..."
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
                            {loading ? "Saving..." : mode === "create" ? "Add Candidate" : "Update Candidate"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
