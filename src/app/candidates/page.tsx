"use client";

import { useEffect, useState } from "react";
import candidatesService from "@/services/candidates.service";
import type { Candidate } from "@/types/candidate.types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";
import { Eye, Edit, Trash2, Plus, Search } from "lucide-react";
import { CandidateDialog } from "@/components/dialogs/candidate-dialog";

export default function CandidatesPage() {
    const { user } = useAuth();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    useEffect(() => {
        fetchCandidates();
    }, [statusFilter, searchTerm]);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidatesService.getCandidates({
                status: statusFilter || undefined,
                search: searchTerm || undefined,
            });
            setCandidates(response.data || []);
        } catch (err: any) {
            setError(err.message || "Failed to fetch candidates");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedCandidate(null);
        setDialogMode("create");
        setIsDialogOpen(true);
    };

    const handleEdit = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    const handleSave = async (candidateData: any) => {
        if (dialogMode === "create") {
            await candidatesService.createCandidate(candidateData);
        } else if (selectedCandidate) {
            await candidatesService.updateCandidate((selectedCandidate as any)._id, candidateData);
        }
        fetchCandidates();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this candidate?")) return;

        try {
            await candidatesService.deleteCandidate(id);
            fetchCandidates();
        } catch (err: any) {
            alert(err.message || "Failed to delete candidate");
        }
    };

    const canEdit = user?.role === "RH" || user?.role === "Manager";
    const canDelete = user?.role === "RH";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-white">
                        Candidates
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Manage and track candidate applications
                    </p>
                </div>
                {canEdit && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
                    >
                        <Plus className="h-5 w-5" />
                        Add Candidate
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="rounded-lg bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 dark:border-gray-600 dark:bg-gray-800"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                    >
                        <option value="">All Statuses</option>
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
            </div>

            {/* Candidates Table */}
            <div className="rounded-lg bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">{error}</div>
                ) : candidates.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No candidates found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Applied For
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
                                {candidates.map((candidate) => (
                                    <tr
                                        key={(candidate as any)._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-dark dark:text-white">
                                                {candidate.firstName} {candidate.lastName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {candidate.email}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {candidate.position}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {candidate.positionAppliedFor || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={
                                                candidate.status === "HIRED" ? "success" :
                                                    candidate.status === "REJECTED" ? "error" :
                                                        candidate.status === "OFFER_SENT" || candidate.status === "SELECTED" ? "success" :
                                                            candidate.status === "TECHNICAL_INTERVIEW" || candidate.status === "HR_INTERVIEW" ? "warning" :
                                                                candidate.status === "SHORTLISTED" ? "info" : "default"
                                            }>
                                                {candidate.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/candidates/${(candidate as any)._id}`}
                                                    className="text-blue-600 hover:text-blue-700"
                                                    aria-label={`View ${candidate.firstName} ${candidate.lastName}`}
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </Link>
                                                {canEdit && (
                                                    <button
                                                        onClick={() => handleEdit(candidate)}
                                                        className="text-yellow-600 hover:text-yellow-700"
                                                        aria-label={`Edit ${candidate.firstName} ${candidate.lastName}`}
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        onClick={() => handleDelete((candidate as any)._id)}
                                                        className="text-red-600 hover:text-red-700"
                                                        aria-label={`Delete ${candidate.firstName} ${candidate.lastName}`}
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Candidate Dialog */}
            <CandidateDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
                candidate={selectedCandidate}
                mode={dialogMode}
            />
        </div>
    );
}
