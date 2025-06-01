import type {PlaceType} from "../../enums/PlaceType.ts";
import type {GoogleReviewDto} from "./GoogleReviewDto.ts";

export interface GooglePlaceDto {
    placeType: PlaceType;
    name: string;
    description: string;
    rating: number;
    openingTime: string;  // assuming ISO time string, e.g., "08:00:00"
    closingTime: string;  // same as above
    reviews: GoogleReviewDto[];
    latitude: number;
    longitude: number;
}