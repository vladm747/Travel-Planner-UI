import axios from 'axios';
import type { MealBreakResponseDto } from '../dto/mealBreak/MealBreakResponseDto';
import type {MealBreakRequestDto} from "../dto/mealBreak/MealBreakRequestDto.ts";

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/activities/mealBreaks',
    // or use: `${process.env.REACT_APP_URL}/api/v1/activities/mealBreaks`
});

// Get a single meal break by ID
export const getMealBreakById = async (id: number): Promise<MealBreakResponseDto> => {
    try {
        const response = await api.get<MealBreakResponseDto>(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching meal break by ID', error);
        throw error;
    }
};

// Get all meal breaks by trip ID
export const getAllMealBreaksByTrip = async (tripId: number): Promise<MealBreakResponseDto[]> => {
    try {
        const response = await api.get<MealBreakResponseDto[]>(`?tripId=${tripId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching meal breaks by trip', error);
        throw error;
    }
};

// Add a new meal break to a trip
export const addMealBreakToTrip = async (
    tripId: number,
    mealBreakDto: MealBreakRequestDto
): Promise<MealBreakResponseDto> => {
    try {
        const response = await api.post<MealBreakResponseDto>(`?tripId=${tripId}`, mealBreakDto);
        return response.data;
    } catch (error) {
        console.error('Error adding meal break', error);
        throw error;
    }
};

// Update an existing meal break
export const updateMealBreak = async (
    id: number,
    mealBreakDto: MealBreakRequestDto
): Promise<MealBreakResponseDto> => {
    try {
        const response = await api.put<MealBreakResponseDto>(`/update/${id}`, mealBreakDto);
        return response.data;
    } catch (error) {
        console.error('Error updating meal break', error);
        throw error;
    }
};

// Delete a meal break from a trip
export const deleteMealBreak = async (
    tripId: number,
    mealBreakId: number
): Promise<void> => {
    try {
        await api.delete(`?tripId=${tripId}&mealBreakId=${mealBreakId}`);
    } catch (error) {
        console.error('Error deleting meal break', error);
        throw error;
    }
};
