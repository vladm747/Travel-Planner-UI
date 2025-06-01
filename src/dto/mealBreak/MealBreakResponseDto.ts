export interface MealBreakResponseDto {
    id: number;
    name: string;
    description: string;
    startTime: string;  // format: "HH:mm"
    endTime: string;    // format: "HH:mm"
    duration: number;   // assumed in minutes
    latitude: number;
    longitude: number;
}
