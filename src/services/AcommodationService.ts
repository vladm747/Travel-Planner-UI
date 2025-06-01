import axios from 'axios';
import type { AccommodationResponseDto } from '../dto/acommodation/AccommodationResponseDto';
import type {AccommodationRequestDto} from "../dto/acommodation/AccommodationRequestDto.ts";


const api = axios.create({
    baseURL: `http://localhost:8080/api/v1/activities/accommodations`,
    // baseURL: `${process.env.REACT_APP_URL}/api/v1/activities/accommodations`,
});

// Get a single accommodation by ID
export const GetAccommodationById = async (id: number): Promise<AccommodationResponseDto> => {
    try {
        const response = await api.get<AccommodationResponseDto>(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching accommodation by ID', error);
        throw error;
    }
};

// Get all accommodations by trip ID
export const GetAllAccommodationsByTrip = async (tripId: number): Promise<AccommodationResponseDto[]> => {
    try {
        const response = await api.get<AccommodationResponseDto[]>(`?tripId=${tripId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching accommodations for trip', error);
        throw error;
    }
};

// Add an accommodation to a trip
export const AddAccommodationToTrip = async (
    tripId: number,
    accommodation: AccommodationRequestDto
): Promise<AccommodationResponseDto> => {
    try {
        const response = await api.post<AccommodationResponseDto>(`?tripId=${tripId}`, accommodation);
        return response.data;
    } catch (error) {
        console.error('Error adding accommodation', error);
        throw error;
    }
};

// Update accommodation
export const UpdateAccommodation = async (
    id: number,
    accommodation: AccommodationRequestDto
): Promise<AccommodationResponseDto> => {
    try {
        const response = await api.put<AccommodationResponseDto>(`/update/${id}`, accommodation);
        return response.data;
    } catch (error) {
        console.error('Error updating accommodation', error);
        throw error;
    }
};

// Delete accommodation
export const DeleteAccommodation = async (
    tripId: number,
    accommodationId: number
): Promise<void> => {
    try {
        await api.delete(`?tripId=${tripId}&accommodationId=${accommodationId}`);
    } catch (error) {
        console.error('Error deleting accommodation', error);
        throw error;
    }
};
