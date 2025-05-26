import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid
} from '@mui/material';

interface Trip {
    id: number;
    title: string;
    description: string;
}

export default function Trip() {
    const [trips, setTrips] = useState<Trip[]>([]);

    const handleCreateTrip = () => {
        const newTrip: Trip = {
            id: trips.length + 1,
            title: `Trip #${trips.length + 1}`,
            description: `This is a description for trip #${trips.length + 1}`,
        };
        setTrips(prev => [...prev, newTrip]);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Button variant="contained" color="primary" onClick={handleCreateTrip}>
                Create Trip
            </Button>

            <Grid container spacing={2} sx={{ mt: 2 }}>
                {trips.map((trip) => (
                    <Grid item xs={12} sm={6} md={4} key={trip.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{trip.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {trip.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
