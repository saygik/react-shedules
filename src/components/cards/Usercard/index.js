import React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';


export default function UserCard(props) {
  const { popupCard } = props
  if (!popupCard) return <></>
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card sx={{
        maxWidth: '320px',
        height: '140px',
        boxShadow: '7px 7px 5px rgba(0,0,0,0.6)'
      }} variant="outlined">
        <CardContent
          sx={{
            padding: '12px 8px 2px 15px',
            '&:last-child': { pb: 2 },
          }}
        >
          <Typography variant="h6" component="div" sx={{ lineHeight: 1, fontSize:'0.95rem' }}>
            {popupCard.title}
          </Typography>
          <Typography  color="text.secondary" sx={{ fontSize:'0.9rem', mb:1 }}>
            {popupCard.extendedProps.title}
          </Typography>
          <Divider className={"MuiDivider-root"} light />
          <Typography variant="body2">
            {popupCard.extendedProps.telephoneNumber}
          </Typography>
        </CardContent>
      </Card>
    </Box>



  );
}