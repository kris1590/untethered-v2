import React from 'react'

export default function TeamCulture() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 md:mb-16">
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                            Team Culture
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            The foundation of our community and the principles that guide us forward
                        </p>
                    </div>

                    {/* Vision Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">I</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                                Vision
                            </h2>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                            The Untethered is about the pursuit of freedom: Freedom from self-limiting beliefs,
                            approval seeking, and the patterns in our life that have held us back from stepping
                            into our full potential.
                        </p>
                    </div>

                    {/* Purpose Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">II</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                                Purpose
                            </h2>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                            The Untethered is a community where men gather for genuine connection, honest dialogue,
                            and the pursuit of growth that elevates both the individual and the group as a whole.
                        </p>
                    </div>

                    {/* Values Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center mb-6">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">III</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                                Values
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Value Cards */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                                <div className="flex items-center mb-3">
                                    <span className="text-2xl mr-3">🚀</span>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Presence</h3>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base">
                                    We reconnect to our bodies and bring our attention to the here and now.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                                <div className="flex items-center mb-3">
                                    <span className="text-2xl mr-3">🚀</span>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Honesty</h3>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base">
                                    We speak truth and allow ourselves to be seen for who we really are.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                                <div className="flex items-center mb-3">
                                    <span className="text-2xl mr-3">🚀</span>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Growth</h3>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base">
                                    We actively seek to expand our awareness, skills, and capacity for living and loving fully.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
                                <div className="flex items-center mb-3">
                                    <span className="text-2xl mr-3">🚀</span>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Brotherhood</h3>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base">
                                    We are bonded as brothers, knowing that one man's wins or struggles belong to us all.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
                                <div className="flex items-center mb-3">
                                    <span className="text-2xl mr-3">🚀</span>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Integrity</h3>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base">
                                    We align our words with our actions, holding each other accountable to live true to what we believe.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
                                <div className="flex items-center mb-3">
                                    <span className="text-2xl mr-3">🚀</span>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Courage</h3>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base">
                                    We choose vulnerability, face discomfort, and take risks in the pursuit of deeper freedom and truth.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-xl p-6 border border-teal-200 dark:border-teal-700 md:col-span-2">
                                <div className="flex items-center mb-3">
                                    <span className="text-2xl mr-3">🚀</span>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Curiosity</h3>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base">
                                    We stay open-minded, ask questions, and embrace a learner's mindset in all we do.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}