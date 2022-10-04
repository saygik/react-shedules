import bloader from '../assets/images/big-loader.svg'
import Box from '@mui/material/Box';

function Loader () {
    return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '100vh',
    }}>
        <img src={bloader}/>
    </Box>  );
}

export default Loader;