import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    CardActions,
    Grid,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Rating,
    Stack,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useLocation } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PlaceIcon from '@mui/icons-material/Place';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Import services
import { GetPlacesNearbyAsync, AddPlaceToTrip, GetAllPlacesByTripAsync, DeletePlace } from '../../services/PlaceService';
import { AddAccommodationToTrip, GetAllAccommodationsByTrip, DeleteAccommodation } from '../../services/AcommodationService.ts';
import { addMealBreakToTrip, getAllMealBreaksByTrip, deleteMealBreak } from '../../services/MealBreakService';

// Import types
import type { TripDto } from '../../dto/trip/TripDto';
import {PlaceType, PlaceTypeLabels} from '../../enums/PlaceType';
import { AccommodationType, AccommodationTypeLabels } from '../../enums/AccommodationType';
import { MealBreakType, MealBreakTypeLabels } from '../../enums/MealBreakType';
import type { GooglePlaceDto } from '../../dto/google/GooglePlaceDto';
import type { AccommodationRequestDto } from '../../dto/acommodation/AccommodationRequestDto';
import type { AccommodationResponseDto } from '../../dto/acommodation/AccommodationResponseDto';
import type { MealBreakRequestDto } from '../../dto/mealBreak/MealBreakRequestDto';
import type { MealBreakResponseDto } from '../../dto/mealBreak/MealBreakResponseDto';
import type { PlaceResponseDto } from '../../dto/places/PlaceResponseDto';

function TripDetails() {
    const location = useLocation();
    const trip = location.state as TripDto;

    // State for data
    const [places, setPlaces] = useState<PlaceResponseDto[]>([]);
    const [accommodations, setAccommodations] = useState<AccommodationResponseDto[]>([]);
    const [mealBreaks, setMealBreaks] = useState<MealBreakResponseDto[]>([]);

    // Modal states
    const [addPlaceModalOpen, setAddPlaceModalOpen] = useState(false);
    const [addAccommodationModalOpen, setAddAccommodationModalOpen] = useState(false);
    const [addMealBreakModalOpen, setAddMealBreakModalOpen] = useState(false);

    // Add Place modal state
    const [selectedPlaceType, setSelectedPlaceType] = useState<PlaceType>(PlaceType.CAFE);
    const [nearbyPlaces, setNearbyPlaces] = useState<GooglePlaceDto[]>([]);
    const [loadingNearbyPlaces, setLoadingNearbyPlaces] = useState(false);

    // Add Accommodation modal state
    const [accommodationForm, setAccommodationForm] = useState<AccommodationRequestDto>({
        name: '',
        description: '',
        accommodationType: AccommodationType.HOTEL,
        pricePerNight: 0,
        stars: 1,
        wifiAvailable: false,
        parkingAvailable: false,
        petFriendly: false
    });

    // Add Meal Break modal state
    const [mealBreakForm, setMealBreakForm] = useState<MealBreakRequestDto>({
        name: MealBreakType.BREAKFAST,
        description: '',
        startTime: '08:00',
        endTime: '09:00'
    });

    // Load data on component mount
    useEffect(() => {
        if (trip?.Id) {
            loadTripData();
        }
    }, [trip]);

    const loadTripData = async () => {
        try {
            const [placesData, accommodationsData, mealBreaksData] = await Promise.all([
                GetAllPlacesByTripAsync(trip.Id),
                GetAllAccommodationsByTrip(trip.Id),
                getAllMealBreaksByTrip(trip.Id)
            ]);
            setPlaces(placesData);
            setAccommodations(accommodationsData);
            setMealBreaks(mealBreaksData);
        } catch (error) {
            console.error('Error loading trip data:', error);
        }
    };

    // Add Place functionality
    const handleSearchNearbyPlaces = async () => {
        if (!trip?.City) return;

        setLoadingNearbyPlaces(true);
        try {
            const results = await GetPlacesNearbyAsync(trip.City, selectedPlaceType);
            setNearbyPlaces(results);
        } catch (error) {
            console.error('Error fetching nearby places:', error);
        } finally {
            setLoadingNearbyPlaces(false);
        }
    };

    const handleAddPlaceToTrip = async (place: GooglePlaceDto) => {
        try {
            await AddPlaceToTrip(place, trip.Id);
            await loadTripData();
        } catch (error) {
            console.error('Error adding place to trip:', error);
        }
    };

    // Add Accommodation functionality
    const handleAddAccommodation = async () => {
        try {
            await AddAccommodationToTrip(trip.Id, accommodationForm);
            setAddAccommodationModalOpen(false);
            setAccommodationForm({
                name: '',
                description: '',
                accommodationType: AccommodationType.HOTEL,
                pricePerNight: 0,
                stars: 1,
                wifiAvailable: false,
                parkingAvailable: false,
                petFriendly: false
            });
            await loadTripData();
        } catch (error) {
            console.error('Error adding accommodation:', error);
        }
    };

    // Add Meal Break functionality
    const handleAddMealBreak = async () => {
        try {
            await addMealBreakToTrip(trip.Id, mealBreakForm);
            setAddMealBreakModalOpen(false);
            setMealBreakForm({
                name: MealBreakType.BREAKFAST,
                description: '',
                startTime: '08:00',
                endTime: '09:00'
            });
            await loadTripData();
        } catch (error) {
            console.error('Error adding meal break:', error);
        }
    };

    // Delete functionality
    const handleDeletePlace = async (placeId: number) => {
        try {
            await DeletePlace(trip.Id, placeId);
            await loadTripData();
        } catch (error) {
            console.error('Error deleting place:', error);
        }
    };

    const handleDeleteAccommodation = async (accommodationId: number) => {
        try {
            await DeleteAccommodation(trip.Id, accommodationId);
            await loadTripData();
        } catch (error) {
            console.error('Error deleting accommodation:', error);
        }
    };

    const handleDeleteMealBreak = async (mealBreakId: number) => {
        try {
            await deleteMealBreak(trip.Id, mealBreakId);
            await loadTripData();
        } catch (error) {
            console.error('Error deleting meal break:', error);
        }
    };

    if (!trip) {
        return (
            <Container>
                <Typography variant="h5" color="error">
                    Подорож не знайдена
                </Typography>
            </Container>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {trip.Name}
                    </Typography>
                    <Chip
                        icon={<LocationOnIcon />}
                        label={trip.City}
                        color="primary"
                        size="large"
                    />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<PlaceIcon />}
                        onClick={() => setAddPlaceModalOpen(true)}
                        color="primary"
                    >
                        Додати місце
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<HotelIcon />}
                        onClick={() => setAddAccommodationModalOpen(true)}
                        color="secondary"
                    >
                        Додати житло
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<RestaurantIcon />}
                        onClick={() => setAddMealBreakModalOpen(true)}
                        color="success"
                    >
                        Додати прийом їжі
                    </Button>
                </Box>

                {/* Content Grid */}
                <Grid container spacing={4}>
                    {/* Places Section */}
                    <Grid size={12} >
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PlaceIcon color="primary" />
                                Місця ({places.length})
                            </Typography>
                            <List>
                                {places.map((place) => (
                                    <ListItem key={place.id} divider>
                                        <ListItemText
                                            primary={place.name}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {place.description}
                                                    </Typography>
                                                    <Rating value={place.rating} readOnly size="small" />
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleDeletePlace(place.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                                {places.length === 0 && (
                                    <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                                        Місця ще не додані
                                    </Typography>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Accommodations Section */}
                    <Grid size={12} >
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <HotelIcon color="secondary" />
                                Житло ({accommodations.length})
                            </Typography>
                            <List>
                                {accommodations.map((accommodation) => (
                                    <ListItem key={accommodation.id} divider>
                                        <ListItemText
                                            primary={accommodation.name}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2">
                                                        {accommodation.accommodationType}
                                                    </Typography>
                                                    <Typography variant="body2" color="primary">
                                                        ${accommodation.pricePerNight}/ніч
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <StarIcon fontSize="small" color="warning" />
                                                        <Typography variant="body2">
                                                            {accommodation.stars}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleDeleteAccommodation(accommodation.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                                {accommodations.length === 0 && (
                                    <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                                        Житло ще не додане
                                    </Typography>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Meal Breaks Section */}
                    <Grid size={12}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <RestaurantIcon color="success" />
                                Прийоми їжі ({mealBreaks.length})
                            </Typography>
                            <List>
                                {mealBreaks.map((mealBreak) => (
                                    <ListItem key={mealBreak.id} divider>
                                        <ListItemText
                                            primary={mealBreak.name}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {mealBreak.description}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <AccessTimeIcon fontSize="small" />
                                                        <Typography variant="body2">
                                                            {mealBreak.startTime} - {mealBreak.endTime}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleDeleteMealBreak(mealBreak.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                                {mealBreaks.length === 0 && (
                                    <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                                        Прийоми їжі ще не додані
                                    </Typography>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Add Place Modal */}
                <Dialog open={addPlaceModalOpen} onClose={() => setAddPlaceModalOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Додати місце до подорожі</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Тип місця</InputLabel>
                                <Select
                                    value={selectedPlaceType}
                                    onChange={(e) => setSelectedPlaceType(e.target.value as PlaceType)}
                                    label="Тип місця"
                                >
                                    {Object.values(PlaceType).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {PlaceTypeLabels[type]}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={handleSearchNearbyPlaces}
                                disabled={loadingNearbyPlaces}
                            >
                                {loadingNearbyPlaces ? 'Пошук...' : 'Знайти поблизу'}
                            </Button>
                        </Box>

                        <Grid container spacing={2}>
                            {nearbyPlaces.map((place, index) => (
                                <Grid size={12} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {place.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {place.description}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Rating value={place.rating} readOnly size="small" />
                                                <Typography variant="body2">
                                                    ({place.rating})
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">
                                                Відкрито: {place.openingTime} - {place.closingTime}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleAddPlaceToTrip(place)}
                                            >
                                                Додати до подорожі
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddPlaceModalOpen(false)}>Закрити</Button>
                    </DialogActions>
                </Dialog>

                {/* Add Accommodation Modal */}
                <Dialog open={addAccommodationModalOpen} onClose={() => setAddAccommodationModalOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Додати житло</DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                label="Назва житла"
                                fullWidth
                                value={accommodationForm.name}
                                onChange={(e) => setAccommodationForm({ ...accommodationForm, name: e.target.value })}
                            />
                            <TextField
                                label="Опис"
                                fullWidth
                                multiline
                                rows={3}
                                value={accommodationForm.description}
                                onChange={(e) => setAccommodationForm({ ...accommodationForm, description: e.target.value })}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Тип житла</InputLabel>
                                <Select
                                    value={accommodationForm.accommodationType}
                                    onChange={(e) =>
                                        setAccommodationForm({ ...accommodationForm, accommodationType: e.target.value as AccommodationType })
                                    }
                                    label="Тип житла"
                                >
                                    {Object.values(AccommodationType).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {AccommodationTypeLabels[type]}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Ціна за ніч"
                                type="number"
                                fullWidth
                                value={accommodationForm.pricePerNight}
                                onChange={(e) => setAccommodationForm({ ...accommodationForm, pricePerNight: Number(e.target.value) })}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Зірки</InputLabel>
                                <Select
                                    value={accommodationForm.stars}
                                    onChange={(e) => setAccommodationForm({ ...accommodationForm, stars: Number(e.target.value) })}
                                    label="Зірки"
                                >
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <MenuItem key={star} value={star}>
                                            {star}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>Додаткові послуги:</Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={accommodationForm.wifiAvailable}
                                            onChange={(e) => setAccommodationForm({ ...accommodationForm, wifiAvailable: e.target.checked })}
                                        />
                                    }
                                    label="Wi-Fi"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={accommodationForm.parkingAvailable}
                                            onChange={(e) => setAccommodationForm({ ...accommodationForm, parkingAvailable: e.target.checked })}
                                        />
                                    }
                                    label="Парковка"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={accommodationForm.petFriendly}
                                            onChange={(e) => setAccommodationForm({ ...accommodationForm, petFriendly: e.target.checked })}
                                        />
                                    }
                                    label="Дозволені домашні тварини"
                                />
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddAccommodationModalOpen(false)}>Скасувати</Button>
                        <Button onClick={handleAddAccommodation} variant="contained">Додати</Button>
                    </DialogActions>
                </Dialog>

                {/* Add Meal Break Modal */}
                <Dialog open={addMealBreakModalOpen} onClose={() => setAddMealBreakModalOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Додати прийом їжі</DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>Тип прийому їжі</InputLabel>
                                <Select
                                    value={mealBreakForm.name}
                                    onChange={(e) =>
                                        setMealBreakForm({ ...mealBreakForm, name: e.target.value as MealBreakType })
                                    }
                                    label="Тип прийому їжі"
                                >
                                    {Object.values(MealBreakType).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {MealBreakTypeLabels[type]}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Опис"
                                fullWidth
                                multiline
                                rows={2}
                                value={mealBreakForm.description}
                                onChange={(e) => setMealBreakForm({ ...mealBreakForm, description: e.target.value })}
                            />
                            <TextField
                                label="Час початку"
                                type="time"
                                fullWidth
                                value={mealBreakForm.startTime}
                                onChange={(e) => setMealBreakForm({ ...mealBreakForm, startTime: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Час закінчення"
                                type="time"
                                fullWidth
                                value={mealBreakForm.endTime}
                                onChange={(e) => setMealBreakForm({ ...mealBreakForm, endTime: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddMealBreakModalOpen(false)}>Скасувати</Button>
                        <Button onClick={handleAddMealBreak} variant="contained">Додати прийом їжі</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </LocalizationProvider>
    );
}

export default TripDetails;