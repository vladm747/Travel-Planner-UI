import axios from 'axios';
import type { ScheduleResponseDto } from '../dto/schedule/ScheduleResponseDto';
import type { TravelMode } from '../enums/TravelMode';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/schedules',
    // baseURL: `${process.env.REACT_APP_URL}/api/v1/schedules`, // for prod
});

// Get a single schedule by ID
export const getScheduleById = async (id: number) => {
    try {
        const response = await api.get<ScheduleResponseDto>(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching schedule by ID', error);
        throw error;
    }
};

// Get all schedules for a specific trip
export const getSchedulesByTripId = async (tripId: number): Promise<ScheduleResponseDto[]> => {
    try {
        const response = await api.get<ScheduleResponseDto[]>(`?tripId=${tripId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules for trip', error);
        throw error;
    }
};

// Create full schedule for a trip
export const createFullScheduleByTrip = async (
    tripId: number,
    travelMode: TravelMode,
    startTime: string // in "HH:mm" format
): Promise<ScheduleResponseDto[]> => {
    try {
        const response = await api.post<ScheduleResponseDto[]>(
            `?tripId=${tripId}&travelMode=${travelMode}&startTime=${startTime}`
        );
        return response.data;
    } catch (error) {
        console.error('Error creating schedule', error);
        throw error;
    }
};
