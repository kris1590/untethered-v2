import React from 'react'

export default function Commitments() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 md:mb-16">
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                            Our Commitments
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            The foundation of trust and connection that binds our brotherhood together
                        </p>
                    </div>

                    {/* I. Attend Regularly */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">I</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                                Attend Regularly: Be Here. That is the work.
                            </h2>
                        </div>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                            <p>
                                <strong>Ceiling:</strong> Aim to attend every live weekly call unless genuinely prevented otherwise.
                                Your presence is your biggest investment and the group's greatest gift.
                            </p>
                            <p>
                                <strong>Floor:</strong> You must attend at least 2 out of 4 calls each month to remain an active member (50%).
                                If that's not sustainable, you'll be asked to step away until you have the bandwidth.
                                Our intimacy and trust depend on a reliable presence.
                            </p>
                            <p>
                                If you will miss a call, let us know in advance and stay plugged in. Drop an update or share
                                reflections in the WhatsApp chat so the connection stays alive.
                            </p>
                        </div>
                    </div>

                    {/* II. Keep It Confidential */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">II</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                                Keep It Confidential: What's shared here stays here. Period.
                            </h2>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                            Everything spoken in calls or group chats is private. We guard this space so men can speak
                            without fear, knowing vulnerability is honored. The only exception is if someone shares
                            intentions to harm themselves or others.
                        </p>
                    </div>

                    {/* III. Speak Your Truth */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">III</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                                Speak Your Truth: Bring the real you. That's why you're here.
                            </h2>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                            We all wear masks. The Untethered invites you to drop yours and speak honestly, even when
                            it's hard. Here, your unfiltered truth belongs and is worthy of respect.
                        </p>
                    </div>

                    {/* IV. Listen With Respect */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">IV</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                                Listen With Respect: Honor the courage it takes for a man to share.
                            </h2>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                            When someone speaks, hold space without interrupting, judging, or rushing to solve their problem.
                            Instead, offer curiosity and questions. Let each man wrestle with his own truths and find his own way.
                        </p>
                    </div>

                    {/* V. Engage and Contribute */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">V</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                                Engage and Contribute: This isn't a spectator sport.
                            </h2>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                            Connection thrives on participation both in live calls and in the WhatsApp chat (highly suggested
                            you turn on notifications). The more you invest in the discussions, the more The Untethered
                            becomes the community you need it to be.
                        </p>
                    </div>

                    {/* VI. Protect the Space */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">VI</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                                Protect the Space: Keep it personal, not polarizing
                            </h2>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                            We're here to find brotherhood, not battlegrounds. Politics, religion, and other charged topics
                            are kept out so we can focus on what connects us. Our greatest strength lies in the common ground we share.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}