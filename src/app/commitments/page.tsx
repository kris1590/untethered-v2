import React from 'react';

const commitments = [
    {
        num: 'I',
        title: 'Attend Regularly',
        subtitle: 'Be here. That is the work.',
        details: [
            <span key="ceiling"><strong>Ceiling:</strong> Aim to attend every live weekly call unless genuinely prevented otherwise. Your presence is your biggest investment and the group’s greatest gift.</span>,
            <span key="floor"><strong>Floor:</strong> You must attend at least 2 out of 4 calls each month to remain an active member (50%). If that’s not sustainable, you’ll be asked to step away until you have the bandwidth. Our intimacy and trust depend on a reliable presence.</span>,
            <span key="miss">If you will miss a call, let us know in advance and stay plugged in. Drop an update or share reflections in the WhatsApp chat so the connection stays alive.</span>
        ],
        color: "bg-blue-500"
    },
    {
        num: 'II',
        title: 'Keep It Confidential',
        subtitle: "What's shared here stays here. Period.",
        details: [
            "Everything spoken in calls or group chats is private. We guard this space so men can speak without fear, knowing vulnerability is honored. The only exception is if someone shares intentions to harm themselves or others."
        ],
        color: "bg-green-500"
    },
    {
        num: 'III',
        title: 'Speak Your Truth',
        subtitle: "Bring the real you. That's why you're here.",
        details: [
            "We all wear masks. The Untethered invites you to drop yours and speak honestly, even when it's hard. Here, your unfiltered truth belongs and is worthy of respect."
        ],
        color: "bg-purple-500"
    },
    {
        num: 'IV',
        title: 'Listen With Respect',
        subtitle: "Honor the courage it takes for a man to share.",
        details: [
            "When someone speaks, hold space without interrupting, judging, or rushing to solve their problem. Instead, offer curiosity and questions. Let each man wrestle with his own truths and find his own way."
        ],
        color: "bg-orange-500"
    },
    {
        num: 'V',
        title: 'Engage and Contribute',
        subtitle: "This isn't a spectator sport.",
        details: [
            "Connection thrives on participation both in live calls and in the WhatsApp chat (highly suggested you turn on notifications). The more you invest in the discussions, the more The Untethered becomes the community you need it to be."
        ],
        color: "bg-red-500"
    },
    {
        num: 'VI',
        title: 'Protect the Space',
        subtitle: "Keep it personal, not polarizing.",
        details: [
            "We're here to find brotherhood, not battlegrounds. Politics, religion, and other charged topics are kept out so we can focus on what connects us. Our greatest strength lies in the common ground we share."
        ],
        color: "bg-indigo-500"
    },
];

export default function Commitments() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 md:py-16">
            <div className="max-w-2xl mx-auto px-4">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-accent mb-2">
                        Our Commitments
                    </h1>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">
                        The foundation of trust and connection that binds our brotherhood together.
                    </p>
                </header>

                <section className="flex flex-col gap-6">
                    {commitments.map((c) => (
                        <div
                            key={c.num}
                            className="flex gap-4 items-start bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm"
                        >
                            <div className={`w-10 h-10 ${c.color} rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 mt-1`}>
                                {c.num}
                            </div>
                            <div>
                                <div className="font-semibold text-slate-800 dark:text-slate-100 text-lg mb-1">
                                    {c.title}
                                    <span className="block text-sm font-normal text-slate-500 dark:text-slate-400">
                                        {c.subtitle}
                                    </span>
                                </div>
                                <div className="space-y-3 text-slate-700 dark:text-slate-300 text-sm md:text-base mt-2">
                                    {c.details.map((d, i) => (
                                        <div key={i}>{d}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}
