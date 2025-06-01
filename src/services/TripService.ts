import axios from 'axios';
import type {CreateTripDto} from "../dto/trip/CreateTripDto.ts";

const api = axios.create({
    baseURL: `http://localhost:8080/api/v1/trips`, // Replace with your backend URL
    // baseURL: `${process.env.REACT_APP_URL}`, // Replace with your backend URL
});

export const GetAllTripsAsync = async() => {
    try {
        const response = await api.get('');

        return await response.data;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};


export const CreateTrip = async ( createDTO: CreateTripDto) => {
    try {
        const response = await api.post('', createDTO);

        return response.data;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};