import React, {useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {
    AccessTime,
    Add as AddIcon,
    Event,
    LocationOn,
    Refresh as RefreshIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import type {ScheduleResponseDto} from "../../dto/schedule/ScheduleResponseDto.ts";
import {TravelMode, TravelModeLabels} from "../../enums/TravelMode.ts";

// Mock API functions (replace with your actual API calls)
const mockGetSchedulesByTripId = async (tripId: number): Promise<ScheduleResponseDto[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
        {
            id: 1,
            startTime: "09:00",
            endTime: "11:00",
            trip: { id: tripId, city: "Paris" },
            activity: { id: 1, name: "Eiffel Tower Visit", description: "Iconic tower with panoramic city views" }
        },
        {
            id: 2,
            startTime: "12:00",
            endTime: "14:00",
            trip: { id: tripId, city: "Paris" },
            activity: { id: 2, name: "Louvre Museum", description: "World's largest art museum" }
        },
        {
            id: 3,
            startTime: "15:30",
            endTime: "17:00",
            trip: { id: tripId, city: "Paris" },
            activity: { id: 3, name: "Seine River Cruise", description: "Scenic boat tour along the Seine" }
        }
    ];
};

const mockCreateFullScheduleByTrip = async (
    tripId: number,
    travelMode: TravelMode,
    startTime: string
): Promise<ScheduleResponseDto[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return [
        {
            id: 4,
            startTime: startTime,
            endTime: "10:30",
            trip: { id: tripId, city: "Rome" },
            activity: { id: 4, name: "Colosseum Tour", description: "Ancient Roman amphitheater" }
        },
        {
            id: 5,
            startTime: "11:00",
            endTime: "13:00",
            trip: { id: tripId, city: "Rome" },
            activity: { id: 5, name: "Vatican Museums", description: "Papal palaces and Sistine Chapel" }
        },
        {
            id: 6,
            startTime: "14:30",
            endTime: "16:00",
            trip: { id: tripId, city: "Rome" },
            activity: { id: 6, name: "Trevi Fountain", description: "Baroque fountain and coin tossing tradition" }
        }
    ];
};

const ScheduleDetails = () => {
    const [schedules, setSchedules] = useState<ScheduleResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [tripId, setTripId] = useState<number>(1);
    const [travelMode, setTravelMode] = useState<TravelMode>(TravelMode.WALK);
    const [startTime, setStartTime] = useState<string>('09:00');

    const handleGetSchedules = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await mockGetSchedulesByTripId(tripId);
            // const data = await getSchedulesByTripId(tripId);
            setSchedules(data);
        } catch (err) {
            setError('Failed to fetch schedules');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSchedule = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await mockCreateFullScheduleByTrip(tripId, travelMode, startTime);
            // const data = await createFullScheduleByTrip(tripId, travelMode, startTime);
            setSchedules(data);
        } catch (err) {
            setError('Failed to create schedule');
        } finally {
            setLoading(false);
        }
    };

    const formatTimeRange = (start, end) => {
        return `${start} - ${end}`;
    };

    const getActivityColor = (index) => {
        const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
        return colors[index % colors.length];
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="primary" />
                    Розклад відвідування місць
                </Typography>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="ID подорожі"
                            type="number"
                            value={tripId}
                            onChange={(e) => setTripId(Number(e.target.value))}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Спосіб подорожування</InputLabel>
                            <Select
                                value={travelMode}
                                label="Travel Mode"
                                onChange={(e) => setTravelMode(e.target.value as TravelMode)}
                            >
                                {Object.values(TravelMode).map((mode) => (
                                    <MenuItem key={mode} value={mode}>
                                        {TravelModeLabels[mode]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Час початку"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                                onClick={handleGetSchedules}
                                disabled={loading}
                                fullWidth
                            >
                                Отримати існуючий розклад
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                        onClick={handleCreateSchedule}
                        disabled={loading}
                        size="large"
                    >
                        Створити новий Розклад
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
            </Paper>

            {schedules.length > 0 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Event color="primary" />
                        Розклад для {schedules[0]?.trip?.city}
                    </Typography>

                    <Grid container spacing={2}>
                        {schedules.map((schedule, index) => (
                            <Grid item xs={12} md={6} lg={4} key={schedule.id}>
                                <Card
                                    elevation={3}
                                    sx={{
                                        height: '100%',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 6
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                                                {schedule.activity.name}
                                            </Typography>
                                            <Chip
                                                label={`#${schedule.id}`}
                                                size="small"
                                                color={getActivityColor(index)}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <AccessTime color="action" fontSize="small" />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatTimeRange(schedule.startTime, schedule.endTime)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <LocationOn color="action" fontSize="small" />
                                            <Typography variant="body2" color="text.secondary">
                                                {schedule.trip.city}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ mb: 2 }} />

                                        <Typography variant="body2" color="text.primary">
                                            {schedule.activity.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {schedules.length === 0 && !loading && (
                <Paper elevation={1} sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <ScheduleIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Розкладів не знайдено
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Натисніть "Отримати існуючий розклад" або "Створити новий розклад" щоб створити новий.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default ScheduleDetails;