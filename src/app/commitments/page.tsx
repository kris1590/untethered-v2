import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

const commitments = [
    {
        num: 'I',
        title: 'Attend Regularly',
        subtitle: 'Be here. That is the work.',
        details: [
            <span key="ceiling"><strong>Ceiling:</strong> Aim to attend every live weekly call unless genuinely prevented otherwise. Your presence is your biggest investment and the group&apos;s greatest gift.</span>,
            <span key="floor"><strong>Floor:</strong> You must attend at least 2 out of 4 calls each month to remain an active member (50%). If that&apos;s not sustainable, you&apos;ll be asked to step away until you have the bandwidth. Our intimacy and trust depend on a reliable presence.</span>,
            <span key="miss">If you will miss a call, let us know in advance and stay plugged in. Drop an update or share reflections in the WhatsApp chat so the connection stays alive.</span>
        ],
        color: "bg-[#635BFF]"
    },
    {
        num: 'II',
        title: 'Keep It Confidential',
        subtitle: "What's shared here stays here. Period.",
        details: [
            "Everything spoken in calls or group chats is private. We guard this space so men can speak without fear, knowing vulnerability is honored. The only exception is if someone shares intentions to harm themselves or others."
        ],
        color: "bg-[#635BFF]"
    },
    {
        num: 'III',
        title: 'Speak Your Truth',
        subtitle: "Bring the real you. That's why you're here.",
        details: [
            "We all wear masks. The Untethered invites you to drop yours and speak honestly, even when it's hard. Here, your unfiltered truth belongs and is worthy of respect."
        ],
        color: "bg-[#635BFF]"
    },
    {
        num: 'IV',
        title: 'Listen With Respect',
        subtitle: "Honor the courage it takes for a man to share.",
        details: [
            "When someone speaks, hold space without interrupting, judging, or rushing to solve their problem. Instead, offer curiosity and questions. Let each man wrestle with his own truths and find his own way."
        ],
        color: "bg-[#635BFF]"
    },
    {
        num: 'V',
        title: 'Engage and Contribute',
        subtitle: "This isn't a spectator sport.",
        details: [
            "Connection thrives on participation both in live calls and in the WhatsApp chat (highly suggested you turn on notifications). The more you invest in the discussions, the more The Untethered becomes the community you need it to be."
        ],
        color: "bg-[#635BFF]"
    },
    {
        num: 'VI',
        title: 'Protect the Space',
        subtitle: "Keep it personal, not polarizing.",
        details: [
            "We're here to find brotherhood, not battlegrounds. Politics, religion, and other charged topics are kept out so we can focus on what connects us. Our greatest strength lies in the common ground we share."
        ],
        color: "bg-[#635BFF]"
    },
];

export default function Commitments() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f6f9fc] py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-semibold text-[#32325d] mb-6 leading-tight">
                            Our commitments
                        </h1>
                        <p className="text-xl text-[#525f7f] max-w-2xl mx-auto leading-relaxed">
                            The foundation of trust and connection that binds our brotherhood together.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {commitments.map((c) => (
                            <div key={c.num} className="bg-white rounded-lg shadow-sm border border-[#e6ebf1] hover:shadow-md transition-shadow duration-200">
                                <div className="p-8">
                                    <div className="flex gap-8 items-start">
                                        <div className={`w-14 h-14 ${c.color} rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm`}>
                                            {c.num}
                                        </div>
                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <h2 className="text-2xl font-semibold text-[#32325d] mb-2 leading-tight">
                                                    {c.title}
                                                </h2>
                                                <p className="text-[#525f7f] font-medium text-lg">
                                                    {c.subtitle}
                                                </p>
                                            </div>
                                            <div className="space-y-4 text-[#32325d] leading-relaxed">
                                                {c.details.map((d, i) => (
                                                    <div key={i} className="text-base">{d}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
