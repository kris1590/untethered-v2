'use client';
import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import ProtectedRoute from '../components/ProtectedRoute';
// FullCalendar CSS will be loaded automatically by the components

// Custom CSS to make all calendar content black and buttons consistent
const calendarStyles = `
  .fc {
    color: black !important;
  }
  .fc-header-toolbar {
    color: black !important;
  }
  .fc-toolbar-title {
    color: black !important;
  }
  @media (max-width: 640px) {
    .fc-toolbar-title {
      font-size: 0.95rem !important;
      line-height: 1.5 !important;
      letter-spacing: 0.02em !important;
      padding: 0.25rem 0.5rem !important;
      text-align: center !important;
      margin: 0.5rem auto 0.25rem auto !important;
      width: 100%;
      display: block;
    }
    .fc-header-toolbar {
      gap: 0.5rem !important;
    }
  }
  .fc-button {
    color: black !important;
    background-color: hsl(var(--b2)) !important;
    border: 1px solid hsl(var(--bc) / 0.2) !important;
    border-radius: 0.5rem !important;
    padding: 0.5rem 1rem !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
    transition: all 0.2s !important;
    cursor: pointer !important;
    outline: none !important;
  }
  .fc-button:hover {
    background-color: hsl(var(--b3)) !important;
    border-color: hsl(var(--bc) / 0.3) !important;
  }
  .fc-button:focus {
    outline: none !important;
    box-shadow: 0 0 0 2px hsl(var(--bc) / 0.2) !important;
  }
  .fc-button-primary {
    color: black !important;
    background-color: hsl(var(--p)) !important;
    border-color: hsl(var(--p)) !important;
  }
  .fc-button-primary:hover {
    background-color: hsl(var(--pf)) !important;
    border-color: hsl(var(--pf)) !important;
  }
  .fc-button-active {
    background-color: hsl(var(--pf)) !important;
    border-color: hsl(var(--pf)) !important;
    color: black !important;
    font-weight: 700 !important;
    font-size: 1rem !important;
  }
  .fc-daygrid-day-number {
    color: black !important;
  }
  .fc-col-header-cell {
    color: black !important;
  }
  .fc-col-header-cell a {
    color: black !important;
  }
  .fc-daygrid-day {
    color: black !important;
  }
  .fc-daygrid-day.fc-day-today {
    color: black !important;
  }
  .fc-daygrid-day.fc-day-other {
    color: black !important;
  }
  .fc-timegrid-slot-label {
    color: black !important;
  }
  .fc-timegrid-axis {
    color: black !important;
  }
  .fc-list-day-text {
    color: black !important;
  }
  .fc-list-day-side-text {
    color: black !important;
  }
  .fc-event-title {
    color: black !important;
  }
  .fc-event-time {
    color: black !important;
  }
  .fc-more-link {
    color: black !important;
  }
  .fc-daygrid-more-link {
    color: black !important;
  }
  .fc-popover-title {
    color: black !important;
  }
  .fc-popover-body {
    color: black !important;
  }
`;

type CalendarEvent = {
    id?: string;
    title: string;
    start: string | Date;
    end: string | Date;
    type: 'breathwork' | 'topic';
    topic?: string;
    createdAt?: Timestamp;
    facilitator?: string;
    facilitatorEmail?: string;
};

export default function FullCalendarPage() {
    const { user, userData } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState<string | null>(null);
    const [option, setOption] = useState<'breathwork' | 'topic' | null>(null);
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [eventDetailModal, setEventDetailModal] = useState(false);
    const { addToast } = useToast();

    // Fetch events from Firestore
    useEffect(() => {
        const fetchEvents = async () => {
            const qSnap = await getDocs(collection(db, 'calendarEvents'));
            const evts: CalendarEvent[] = [];
            qSnap.forEach(doc => {
                const data = doc.data();
                evts.push({
                    id: doc.id,
                    title: data.title,
                    type: data.type,
                    topic: data.topic,
                    start: data.start?.toDate ? data.start.toDate() : data.start,
                    end: data.end?.toDate ? data.end.toDate() : data.end,
                    createdAt: data.createdAt,
                    facilitator: data.facilitator,
                    facilitatorEmail: data.facilitatorEmail,
                } as CalendarEvent);
            });
            setEvents(evts);
        };
        fetchEvents();
    }, []);

    // Handle date selection
    const handleDateSelect = (selectInfo: DateSelectArg) => {
        setModalDate(selectInfo.startStr);
        setModalOpen(true);
        setOption(null);
        setTopic('');
    };

    // Add new event to Firestore and update UI
    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalDate || !option || (option === 'topic' && !topic)) return;

        // Check if there's already an event of the same type on this date
        const selectedDate = new Date(modalDate);
        const existingEventOfSameType = events.find(event => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === selectedDate.toDateString() && event.type === option;
        });

        if (existingEventOfSameType) {
            const eventType = option === 'breathwork' ? 'breathwork session' : 'topic';
            addToast('error', `A ${eventType} already exists for ${selectedDate.toLocaleDateString()}. Please choose a different date or event type.`);
            return;
        }

        setLoading(true);

        const evt: CalendarEvent = {
            title: option === 'breathwork' ? 'Breathwork Session' : `Topic: ${topic}`,
            start: modalDate,
            end: modalDate,
            type: option,
            ...(option === 'topic' && { topic }),
            createdAt: Timestamp.now(),
            facilitator: userData?.displayName || user?.email || 'Unknown',
            facilitatorEmail: user?.email || '',
        };

        try {
            const docRef = await addDoc(collection(db, 'calendarEvents'), {
                ...evt,
                start: Timestamp.fromDate(new Date(evt.start)),
                end: Timestamp.fromDate(new Date(evt.end)),
            });
            setEvents([{ ...evt, id: docRef.id }, ...events]);
            setModalOpen(false);
            setOption(null);
            setTopic('');
            addToast('success', 'Event booked successfully!');
        } catch (error) {
            addToast('error', 'Failed to book event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle event click to show details
    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = events.find(e => e.id === clickInfo.event.id);
        if (event) {
            setSelectedEvent(event);
            setEventDetailModal(true);
        }
    };

    // Delete event
    const handleDeleteEvent = async (eventId: string) => {
        if (!user) return;

        const event = events.find(e => e.id === eventId);
        const currentUserDisplayName = userData?.displayName || user?.email || 'Unknown';

        if (!event || event.facilitator !== currentUserDisplayName) {
            addToast('error', 'You can only delete your own events');
            return;
        }



        try {
            // Delete from Firestore
            await deleteDoc(doc(db, 'calendarEvents', eventId));

            // Remove from local state
            setEvents(events.filter(e => e.id !== eventId));
            setEventDetailModal(false);
            setSelectedEvent(null);
            addToast('success', 'Event deleted successfully!');
        } catch (error) {
            addToast('error', 'Failed to delete event. Please try again.');
        }
    };

    // Close modal function
    const closeModal = () => {
        setModalOpen(false);
        setOption(null);
        setTopic('');
    };

    // Close event detail modal function
    const closeEventDetailModal = () => {
        setEventDetailModal(false);
        setSelectedEvent(null);
    };

    // Render event content with optimized design
    function renderEventContent(eventInfo: any) {
        const isBreathwork = eventInfo.event.extendedProps.type === 'breathwork';
        const title = eventInfo.event.title;
        const shortTitle = title.length > 15 ? title.substring(0, 12) + '...' : title;

        return (
            <div
                className={`
                    ${isBreathwork ? 'bg-primary' : 'bg-success'} 
                    text-white px-1 py-0.5 rounded text-xs font-medium
                    cursor-pointer hover:opacity-90 transition-opacity
                    max-w-full overflow-hidden
                `}
                title={title}
            >
                {shortTitle}
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="bg-base-200 min-h-screen py-6">
                <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />
                <div className="max-w-4xl mx-auto px-2 sm:px-6">
                    <div className="card bg-base-100 shadow-md rounded-xl">
                        <div className="card-body px-1 py-4 sm:p-8">
                            <h1 className="text-2xl font-semibold text-foreground mb-4 text-center">
                                Community calendar
                            </h1>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                initialView="dayGridMonth"
                                events={events}
                                selectable={true}
                                select={handleDateSelect}
                                eventClick={handleEventClick}
                                eventContent={renderEventContent}
                                height={window.innerWidth < 600 ? 430 : 600}
                                aspectRatio={1.5}
                                contentHeight="auto"
                                dayMaxEvents={3}
                                buttonText={{
                                    today: 'Today',
                                    month: 'Month',
                                    week: 'Week',
                                    day: 'Day'
                                }}
                                eventDisplay="block"
                                themeSystem="standard"
                            />
                        </div>
                    </div>
                </div>

                {/* Modal for Adding Event */}
                {modalOpen && (
                    <dialog className="modal modal-open">
                        <div className="modal-box max-w-md bg-base-100 shadow-xl rounded-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Book for {modalDate && new Date(modalDate).toLocaleDateString()}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="btn btn-ghost btn-sm btn-circle focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleAddEvent} className="space-y-6">
                                <div className="form-control">
                                    <span className="label-text font-medium text-foreground mb-2">Event type</span>
                                    <label className="flex gap-3 items-center cursor-pointer p-2 hover:bg-base-200 rounded">
                                        <input
                                            type="radio"
                                            name="option"
                                            value="breathwork"
                                            className="radio focus:outline-none border-1 border-black"
                                            checked={option === 'breathwork'}
                                            onChange={() => setOption('breathwork')}
                                        />
                                        <span className="text-foreground">Breathwork session</span>
                                    </label>
                                    <label className="flex gap-3 items-center cursor-pointer mt-3 p-2 hover:bg-base-200 rounded">
                                        <input
                                            type="radio"
                                            name="option"
                                            value="topic"
                                            className="radio radio-primary focus:outline-none border-1 border-black"
                                            checked={option === 'topic'}
                                            onChange={() => setOption('topic')}
                                        />
                                        <span className="text-foreground">Book topic</span>
                                    </label>
                                </div>
                                {option === 'topic' && (
                                    <div className="form-control">
                                        <label>
                                            <span className="label-text font-medium text-foreground">Topic</span>
                                        </label>
                                        <input
                                            className="input input-bordered w-full text-foreground mt-2 focus:outline-none"
                                            value={topic}
                                            onChange={e => setTopic(e.target.value)}
                                            placeholder="Enter your topic..."
                                            required
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between mt-8">
                                    <button
                                        type="button"
                                        className="btn btn-ghost w-full sm:w-auto text-foreground focus:outline-none"
                                        onClick={closeModal}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full sm:w-auto text-white focus:outline-none"
                                        disabled={loading || !option || (option === 'topic' && !topic)}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>
                                                Booking...
                                            </>
                                        ) : (
                                            'Book event'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button onClick={closeModal} className="sr-only">close</button>
                        </form>
                    </dialog>
                )}

                {/* Event Detail Modal */}
                {eventDetailModal && selectedEvent && (
                    <dialog className="modal modal-open">
                        <div className="modal-box max-w-md bg-base-100 shadow-xl rounded-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-foreground">
                                    Event details
                                </h2>
                                <button
                                    onClick={closeEventDetailModal}
                                    className="btn btn-ghost btn-sm btn-circle focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="card bg-base-200 p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`badge badge-lg ${selectedEvent.type === 'breathwork'
                                            ? 'badge-primary'
                                            : 'badge-success'
                                            }`}>
                                            {selectedEvent.type === 'breathwork' ? 'Breathwork' : 'Topic'}
                                        </div>
                                        <span className="text-sm text-neutral">
                                            {new Date(selectedEvent.start).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-foreground mb-2">
                                        {selectedEvent.title}
                                    </h3>

                                    {selectedEvent.topic && (
                                        <p className="text-neutral mb-3">
                                            <strong>Topic:</strong> {selectedEvent.topic}
                                        </p>
                                    )}

                                    <div className="text-sm text-neutral">
                                        <p><strong>Facilitator:</strong> {selectedEvent.facilitator}</p>
                                    </div>
                                </div>

                                {(userData?.displayName || user?.email) === selectedEvent.facilitator && (
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={() => handleDeleteEvent(selectedEvent.id!)}
                                            className="btn btn-error btn-sm text-white focus:outline-none"
                                        >
                                            Delete event
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button onClick={closeEventDetailModal} className="sr-only">close</button>
                        </form>
                    </dialog>
                )}
            </div>
        </ProtectedRoute>
    );
}

