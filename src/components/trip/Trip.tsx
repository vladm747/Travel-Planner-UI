import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TripList from "./TripList.tsx";

function Trip() {
    return (
        <Box sx={{
            minHeight: 'calc(100vh - 64px)', // Full height minus AppBar height
            width: '100%',
            margin: 0, // Remove any default margins
            padding: 0, // Remove padding to make it truly full width
            backgroundColor: '#f5f5f5' // Optional background color
        }}>
            <Box display="flex" justifyContent="center" mt={2}>
                {/* Your trip content will go here */}
                <Typography variant="body1">
                    <TripList/>
                </Typography>
            </Box>
        </Box>
    )
}

export default Trip