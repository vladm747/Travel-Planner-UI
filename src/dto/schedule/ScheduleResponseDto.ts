import type { ActivityResponseDto } from '../activity/ActivityResponseDto';
import type { TripResponseDto } from '../trip/TripResponseDto';

export interface ScheduleResponseDto {
    id: number;
    startTime: string; // Expected format: "HH:mm"
    endTime: string;   // Expected format: "HH:mm"
    trip: TripResponseDto;
    activity: ActivityResponseDto;
}
