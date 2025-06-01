import type {PlaceType} from "../../enums/PlaceType.ts";
import type {ReviewResponseDto} from "../../dto/google/ReviewResponseDto.ts";

export interface PlaceResponseDto {
    id: number;
    placeType: PlaceType;
    name: string;
    description: string;
    rating: number;
    openingTime: string;
    closingTime: string;
    reviews: ReviewResponseDto[];
    latitude: number;
    longitude: number;
}

// Define or import PlaceType as appropriate (enum or union type)
