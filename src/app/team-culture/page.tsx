import React from 'react'

const values = [
    {
        icon: "🚀",
        title: "Presence",
        text: "Reconnect to the body and the here and now."
    },
    {
        icon: "🚀",
        title: "Honesty",
        text: "Speak truth and allow yourself to be seen."
    },
    {
        icon: "🚀",
        title: "Growth",
        text: "Expand awareness, skills, and capacity for living fully."
    },
    {
        icon: "🚀",
        title: "Brotherhood",
        text: "Bonded as brothers—one man's wins or struggles belong to us all."
    },
    {
        icon: "🚀",
        title: "Integrity",
        text: "Align words and actions; hold each other accountable."
    },
    {
        icon: "🚀",
        title: "Courage",
        text: "Choose vulnerability, face discomfort, and take risks."
    },
    {
        icon: "🚀",
        title: "Curiosity",
        text: "Stay open-minded and embrace a learner's mindset."
    }
];

export default function TeamCulture() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 md:py-16">
            <div className="max-w-2xl mx-auto px-4">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-accent mb-2">
                        Team Culture
                    </h1>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">
                        The principles that ground us and guide us forward.
                    </p>
                </header>

                {/* Vision */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                        Vision
                    </h2>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 text-slate-700 dark:text-slate-300">
                        The Untethered is about the pursuit of freedom: freedom from self-limiting beliefs,
                        approval seeking, and the patterns in our life that have held us back from stepping into our full potential.
                    </div>
                </section>

                {/* Purpose */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                        Purpose
                    </h2>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 text-slate-700 dark:text-slate-300">
                        The Untethered is a community where men gather for genuine connection, honest dialogue,
                        and the pursuit of growth that elevates both the individual and the group as a whole.
                    </div>
                </section>

                {/* Values */}
                <section>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        Values
                    </h2>
                    <div className="flex flex-col gap-4">
                        {values.map((v) => (
                            <div
                                key={v.title}
                                className="flex items-start gap-4 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm"
                            >
                                <div className="text-3xl pt-1">{v.icon}</div>
                                <div>
                                    <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                                        {v.title}
                                    </div>
                                    <div className="text-slate-700 dark:text-slate-300 text-sm">
                                        {v.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
