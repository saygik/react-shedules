//* React
import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
//* MUI 
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import { lightBlue, blueGrey } from '@mui/material/colors';
import List from '@mui/material/List';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArticleIcon from '@mui/icons-material/Article';
import CommentIcon from '@mui/icons-material/Comment';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
//**********
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//* internal
import { useData } from '../../context/data'
import { StyledSelectItem, StyledSelect, StyledButton, ButtonBox, StyledTextField, StyledTextFieldMultiline, StyledTextFieldCalendar } from './StyledElements';
//****************************************************************************

export default function FormDialog({ open, handleClose }) {
  const { selectedEvent } = useData()
  const newEvent = useMemo(() => (!selectedEvent || selectedEvent?.id === 0), [selectedEvent])
  const [name, setName] = useState('')
  const [tip, setTip] = useState(2)
  const [comment, setComment] = useState('')
  const [start, setStart] = useState(dayjs())
  const [end, setEnd] = useState(dayjs())
  const [allDay, setAllDay] = useState(true);



  useEffect(() => {
    return () => {
      setName('')
    }

  }, [selectedEvent])


  useEffect(() => {
    if (!selectedEvent || selectedEvent?.id === 0) {
      setTip(2)
      setName('')
      setStart(dayjs())
      setEnd(dayjs())
      return
    }
    setTip(1)
    setName(selectedEvent.name)
    setAllDay(selectedEvent.allDay)
    setStart(selectedEvent.start)
    setEnd(selectedEvent.end || selectedEvent.start)
    return () => {
      setName('')
    }

  }, [selectedEvent])



  const handleChangeAllDay = (event) => {
    if (event.target.checked) {
      setStart(dayjs(start).startOf('day'))
      setEnd(dayjs(end).startOf('day'))

    }
    setAllDay(event.target.checked);
  };
  // console.log('start', end)
  // console.log('end', end)
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent
        sx={{
          padding: 1,
          borderRadius: '0px',
          borderColor: lightBlue[700],
          borderTopWidth: '5px',
          borderTopStyle: 'solid',
          width: "450px"
        }}
      >
        <Stack sx={{ m: 2 }}>
          <Stack direction="row">
            <InventoryIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
            <FormControl sx={{ width: '100%' }} size="small">
              <InputLabel id="demo-select-small">тип</InputLabel>
              <StyledSelect
                disabled={!newEvent}
                id="tip-select"
                value={tip}
                label="тип"
                onChange={(event) => {
                  setTip(event.target.value);
                }}
              >
                <StyledSelectItem disabled={newEvent} value={1}>График дежурств</StyledSelectItem>
                <StyledSelectItem value={2}>Событие</StyledSelectItem>
                <StyledSelectItem value={3}>Задача</StyledSelectItem>
              </StyledSelect>
            </FormControl>
          </Stack>
          <Stack direction="row">
            <AccountCircleIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
            <StyledTextField
              disabled={!newEvent}
              onChange={(e) => { setName(e.target.value) }}
              autoFocus
              id="name"
              label="ФИО"
              type="text"
              value={name}
              fullWidth
            />
          </Stack>
          {/* <Stack direction="row">
            <ArticleIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
            <StyledTextField
              onChange={(e) => { }}
              disabled
              id="titlt"
              label="должность"
              type="text"
              value={title}
              fullWidth
            />
          </Stack> */}
          {/* <ListItem disablePadding>
            <ListItemIcon sx={{ minWidth: 30 }}><AccessTimeIcon sx={{ width: 20 }} /> </ListItemIcon>
            <ListItemText
              secondary={"12/12/1222"}
              secondaryTypographyProps={{ sx: { color: blueGrey[400], fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }} />
          </ListItem> */}
          <Stack >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
              <Stack direction="row" justifyContent="space-between">
                <Box direction="row" sx={{ width: '400px' }}>
                  <AccessTimeIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
                  <DatePicker
                    label="дата начала"
                    value={start}
                    openTo="day"
                    onChange={(newValue) => setStart(newValue)}
                    renderInput={(params) => <StyledTextFieldCalendar sx={{ width: '120px', marginRight: '3px' }} {...params} />}
                  />
                  {!allDay && <TimePicker
                    label="время "
                    value={start}
                    onChange={(newValue) => setStart(newValue)}
                    renderInput={(params) => <StyledTextFieldCalendar sx={{ width: '80px' }}  {...params} />}
                  />}
                </Box>
                <Stack direction="row" alignItems="flex-start" justifyContent="flex-end" sx={{ width: '150px' }}>
                  <FormControlLabel sx={{
                    '& .MuiTypography-root': { fontSize: '.9rem' },
                    '& .MuiCheckbox-root': { paddingRight: '5px' },
                  }} label="Весь день" control={
                    <Checkbox
                      size="small"
                      checked={allDay}
                      onChange={handleChangeAllDay}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />} />
                </Stack>

              </Stack>
              <Stack direction="row" sx={{ paddingLeft: '26px', }}>
                <DatePicker
                  label="дата окончания"
                  value={end}
                  minDate={dayjs(start)}
                  openTo="day"
                  onChange={(newValue) => setEnd(newValue)}
                  renderInput={(params) => <StyledTextFieldCalendar sx={{ width: '120px', marginRight: '3px' }} {...params} />}
                />
                {!allDay && <TimePicker
                  label="время "
                  value={end}
                  minTime={dayjs(start)}
                  onChange={(newValue) => {
                    console.log('newValue', newValue)
                    setEnd(newValue)
                  }}
                  renderInput={(params) => <StyledTextFieldCalendar sx={{ width: '80px' }}  {...params} />}
                />}
              </Stack>
            </LocalizationProvider>
          </Stack>
          <Stack direction="row">
            <CommentIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
            <StyledTextFieldMultiline
              onChange={(e) => { setComment(e.target.value) }}
              multiline
              rows={3}
              id="fcomment"
              label="описание"
              type="text"
              value={comment}
              fullWidth
            />
          </Stack>

        </Stack>
        <Stack direction="row" sx={{ borderColor: blueGrey[100], borderTopWidth: '1px', borderTopStyle: 'solid', }}>
          <ButtonBox sx={{ borderColor: blueGrey[100], borderRightWidth: '1px', borderRightStyle: 'solid', }}>
            <StyledButton onClick={() => handleClose()}
              variant="text">Подтвердить</StyledButton>
          </ButtonBox>
          <ButtonBox>
            <StyledButton onClick={() => handleClose()}
              variant="text">Отменить</StyledButton>
          </ButtonBox>
        </Stack>

      </DialogContent>
    </Dialog>
  );
}
