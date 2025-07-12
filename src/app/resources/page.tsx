'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import {
    collection, addDoc, getDocs, deleteDoc, doc, Timestamp, orderBy, query,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

type Resource = {
    id?: string;
    topic: string;
    description: string;
    link: string;
    uploadedBy: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    createdAt?: Timestamp;
};

export default function ResourcePage() {
    const { user, userData } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [form, setForm] = useState({ topic: '', description: '', link: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [deletingResource, setDeletingResource] = useState<string | null>(null);
    const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [expandedResource, setExpandedResource] = useState<string | null>(null);

    useEffect(() => {
        const fetchResources = async () => {
            setFetching(true);
            try {
                const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const list: Resource[] = [];
                querySnapshot.forEach((doc) =>
                    list.push({ id: doc.id, ...doc.data() } as Resource)
                );
                setResources(list);
            } catch (error) {
                console.error('Error fetching resources:', error);
            } finally {
                setFetching(false);
            }
        };
        fetchResources();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.topic || (!form.link && !selectedFile) || !user) {
            setShowToast({ type: 'error', message: 'Please provide either a link or upload a file.' });
            setTimeout(() => setShowToast(null), 3000);
            return;
        }

        const uploadedBy = userData?.displayName || user?.email?.split('@')[0] || 'Anonymous';
        console.log('Creating resource with uploadedBy:', uploadedBy);
        setLoading(true);
        try {
            let fileUrl = '';
            let fileName = '';
            let fileType = '';
            if (selectedFile) {
                fileUrl = await uploadFile(selectedFile);
                fileName = selectedFile.name;
                fileType = selectedFile.type;
            }

            const resourceData = {
                ...form,
                uploadedBy,
                createdAt: Timestamp.now(),
                ...(fileUrl && { fileUrl }),
                ...(fileName && { fileName }),
                ...(fileType && { fileType }),
            };

            const docRef = await addDoc(collection(db, 'resources'), resourceData);

            setResources([
                { ...form, uploadedBy, id: docRef.id, ...(fileUrl && { fileUrl }), ...(fileName && { fileName }), ...(fileType && { fileType }) },
                ...resources,
            ]);

            setForm({ topic: '', description: '', link: '' });
            setSelectedFile(null);
            setFileError('');
            setShowToast({ type: 'success', message: 'Resource added successfully!' });
            setTimeout(() => setShowToast(null), 3000);
        } catch (err) {
            setShowToast({ type: 'error', message: 'Failed to upload resource. Please try again.' });
            setTimeout(() => setShowToast(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const formatUrl = (url: string) => {
        if (!/^https?:\/\//i.test(url)) return `https://${url}`;
        return url;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError('');
        if (!file) {
            setSelectedFile(null);
            return;
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setFileError('File size must be less than 5MB');
            setSelectedFile(null);
            e.target.value = '';
            return;
        }
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/webm', 'video/ogg', 'application/pdf'
        ];
        if (!allowedTypes.includes(file.type)) {
            setFileError('Please select a valid file type (image, video, or PDF)');
            setSelectedFile(null);
            e.target.value = '';
            return;
        }
        setSelectedFile(file);
    };

    const uploadFile = async (file: File): Promise<string> => {
        const storageRef = ref(storage, `resources/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    };

    const handleDeleteResource = async (resource: Resource) => {
        if (!resource.id || !user) return;
        const currentUser = userData?.displayName || user?.email?.split('@')[0] || 'Anonymous';
        console.log('Delete check - Resource uploaded by:', resource.uploadedBy, 'Current user:', currentUser);
        if (resource.uploadedBy !== currentUser) {
            setShowToast({ type: 'error', message: 'You can only delete resources you uploaded.' });
            setTimeout(() => setShowToast(null), 3000);
            return;
        }
        setDeletingResource(resource.id);
        try {
            await deleteDoc(doc(db, 'resources', resource.id));
            if (resource.fileUrl) {
                try {
                    const fileRef = ref(storage, resource.fileUrl);
                    await deleteObject(fileRef);
                } catch (error) { }
            }
            setResources(resources.filter(r => r.id !== resource.id));
            setShowToast({ type: 'success', message: 'Resource deleted successfully!' });
            setTimeout(() => setShowToast(null), 3000);
        } catch (error) {
            setShowToast({ type: 'error', message: 'Failed to delete resource.' });
            setTimeout(() => setShowToast(null), 3000);
        } finally {
            setDeletingResource(null);
        }
    };

    // --- "Read More" expand logic ---
    const isExpanded = (id: string) => expandedResource === id;
    const toggleExpand = (id: string) => setExpandedResource(isExpanded(id) ? null : id);

    return (
        <div className="bg-base-200 min-h-screen py-10">
            {/* Toast Notifications */}
            {showToast && (
                <div className="toast toast-top toast-end">
                    <div className={`alert ${showToast.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        <span>{showToast.message}</span>
                    </div>
                </div>
            )}
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-foreground mb-3">
                        Resource library
                    </h1>
                    <p className="text-lg text-neutral max-w-2xl mx-auto">
                        Share and discover valuable resources: articles, videos, PDFs and more.
                    </p>
                    {/* Debug info */}
                    <div className="mt-4 p-2 bg-base-200 rounded text-xs">
                        <p>Current user: {userData?.displayName || user?.email?.split('@')[0] || 'Anonymous'}</p>
                        <p>User email: {user?.email}</p>
                        <p>UserData displayName: {userData?.displayName}</p>
                    </div>
                </div>
                {/* Upload Form */}
                <div className="card bg-base-100 shadow-md rounded-xl mb-6">
                    <div className="card-body p-4 sm:p-8">
                        <h2 className="card-title text-xl font-semibold text-foreground mb-4">
                            Add new resource
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-foreground">Topic</span>
                                </label>
                                <input
                                    className="input input-bordered w-full focus:outline-none"
                                    placeholder="Resource topic"
                                    value={form.topic}
                                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-foreground">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full focus:outline-none"
                                    placeholder="Brief description"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    rows={2}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-foreground">Resource link (or upload a file below)</span>
                                </label>
                                <input
                                    className="input input-bordered w-full focus:outline-none"
                                    placeholder="https://resource-link.com"
                                    type="url"
                                    value={form.link}
                                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-foreground">Upload file (optional)</span>
                                </label>
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full focus:outline-none"
                                    accept="image/*,video/*,.pdf"
                                    onChange={handleFileChange}
                                />
                                <label className="label">
                                    <span className="label-text-alt text-neutral">
                                        Max 5MB • Images, Videos, PDFs
                                    </span>
                                </label>
                                {fileError && (
                                    <div className="alert alert-error mt-2">
                                        <span>{fileError}</span>
                                    </div>
                                )}
                                {selectedFile && (
                                    <div className="alert alert-info mt-2">
                                        <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="btn btn-primary w-full sm:w-auto rounded-lg focus:outline-none"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Uploading...
                                        </>
                                    ) : (
                                        'Upload resource'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- MOBILE FRIENDLY CARD LAYOUT --- */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Shared resources</h2>
                    {fetching ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : resources.length === 0 ? (
                        <div className="text-center py-8 text-neutral">
                            <div className="text-5xl mb-2">📚</div>
                            <div>No resources yet</div>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:gap-6">
                            {resources.map(res => {
                                const currentUser = userData?.displayName || user?.email?.split('@')[0] || 'Anonymous';
                                const canDelete = res.uploadedBy === currentUser;

                                return (
                                    <div key={res.id || res.link} className="card shadow-sm bg-base-100 rounded-xl p-4 sm:p-6 flex flex-col">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">{res.topic}</h3>
                                                <div className="text-sm text-neutral mb-1">by {res.uploadedBy} · {res.createdAt && res.createdAt.toDate().toLocaleDateString()}</div>
                                            </div>
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDeleteResource(res)}
                                                    disabled={deletingResource === res.id}
                                                    className="btn btn-error btn-xs rounded-lg focus:outline-none"
                                                    title="Delete this resource"
                                                >
                                                    {deletingResource === res.id ? (
                                                        <span className="loading loading-spinner loading-xs"></span>
                                                    ) : (
                                                        'Delete'
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-2 text-neutral text-sm whitespace-pre-line">
                                            {res.description && (res.description.length > 110 && !isExpanded(res.id!))
                                                ? (
                                                    <>
                                                        {res.description.slice(0, 110)}...
                                                        <button
                                                            onClick={() => toggleExpand(res.id!)}
                                                            className="btn btn-link btn-xs ml-1 px-0 align-baseline focus:outline-none"
                                                        >
                                                            Read more
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {res.description}
                                                        {res.description && res.description.length > 110 &&
                                                            <button
                                                                onClick={() => toggleExpand(res.id!)}
                                                                className="btn btn-link btn-xs ml-1 px-0 align-baseline focus:outline-none"
                                                            >
                                                                Show less
                                                            </button>
                                                        }
                                                    </>
                                                )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {res.link && (
                                                <a
                                                    href={formatUrl(res.link)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary btn-xs rounded-lg focus:outline-none"
                                                >
                                                    🔗 Resource link
                                                </a>
                                            )}
                                            {res.fileUrl && (
                                                <a
                                                    href={res.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-secondary btn-xs rounded-lg focus:outline-none"
                                                >
                                                    {res.fileType?.startsWith('image/') ? '📷 Image' :
                                                        res.fileType?.startsWith('video/') ? '🎥 Video' :
                                                            res.fileType === 'application/pdf' ? '📄 PDF' :
                                                                '📎 File'}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
