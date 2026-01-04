import { create } from 'zustand';

interface Appointment {
    id: string;
    patientName: string;
    patientId: string;
    time: string;
    date: string;
    status: string;
    address?: string;
    contact?: string;
}

interface AppState {
    appointments: Appointment[];
    setAppointments: (appointments: Appointment[]) => void;
    updateAppointmentStatus: (id: string, status: string) => void;
    notifications: any[];
    addNotification: (notification: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
    appointments: [],
    setAppointments: (appointments) => set({ appointments }),
    updateAppointmentStatus: (id, status) => set((state) => ({
        appointments: state.appointments.map((app) =>
            app.id === id ? { ...app, status } : app
        )
    })),
    notifications: [],
    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
    })),
}));
