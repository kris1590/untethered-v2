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
        <div className="bg-base-200 min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                        Team culture
                    </h1>
                    <p className="text-lg text-neutral max-w-2xl mx-auto">
                        The principles that ground us and guide us forward.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Vision */}
                    <div className="card bg-base-100 shadow-md rounded-xl">
                        <div className="card-body p-6 md:p-8">
                            <h2 className="card-title text-xl font-semibold text-foreground mb-4">
                                Vision
                            </h2>
                            <p className="text-foreground leading-relaxed">
                                The Untethered is about the pursuit of freedom: freedom from self-limiting beliefs,
                                approval seeking, and the patterns in our life that have held us back from stepping into our full potential.
                            </p>
                        </div>
                    </div>

                    {/* Purpose */}
                    <div className="card bg-base-100 shadow-md rounded-xl">
                        <div className="card-body p-6 md:p-8">
                            <h2 className="card-title text-xl font-semibold text-foreground mb-4">
                                Purpose
                            </h2>
                            <p className="text-foreground leading-relaxed">
                                The Untethered is a community where men gather for genuine connection, honest dialogue,
                                and the pursuit of growth that elevates both the individual and the group as a whole.
                            </p>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="card bg-base-100 shadow-md rounded-xl">
                        <div className="card-body p-6 md:p-8">
                            <h2 className="card-title text-xl font-semibold text-foreground mb-6">
                                Values
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {values.map((v) => (
                                    <div
                                        key={v.title}
                                        className="flex items-start gap-4 p-4 bg-base-200 rounded-xl"
                                    >
                                        <div className="text-2xl pt-1">{v.icon}</div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">
                                                {v.title}
                                            </h3>
                                            <p className="text-neutral text-sm leading-relaxed">
                                                {v.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
