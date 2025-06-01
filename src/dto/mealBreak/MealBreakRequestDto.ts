import type {MealBreakType} from "../../enums/MealBreakType.ts";

export interface MealBreakRequestDto {
    name: MealBreakType;
    description: string;
    startTime: string; // expected format: "HH:mm" (24-hour)
    endTime: string;   // expected format: "HH:mm" (24-hour)
}