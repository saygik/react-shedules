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
import FormControl from '@mui/material/FormControl';

import InputLabel from '@mui/material/InputLabel';
//**********

import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

import 'dayjs/locale/ru';
import dayjs from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//* internal
import { useData } from '../../context/data'
import { StyledButton, ButtonBox } from './controls/StyledElements';
import CheckBox from './controls/checkbox';
import Select from './controls/select';
import FormInput from './controls/input/form-input';
import FormInputMultiline from './controls/input/form-input-multiline';
import FormDatePicker from './controls/datetime/date';
import FormTimePicker from './controls/datetime/time';
import { createEndDateForm } from '../../context/data/utils'



//**yup validation Schema*******************************************************

const validationSchema = yup.object().shape({
  name: yup.string().required("поле 'Наименование' обязательно к заполнению"),
  start: yup
    .date()
    //    .min(new Date(), 'Дата начала не может быть в прошлом')
    .required('Дата начала обязательно'),
  end: yup
    .date()
    .when('start', (start, schema) => {
      if (start) {
        const currentDay = new Date(start.getTime());
        //        const nextDay = new Date(start.getTime() + 86400000);
        return schema
          .min(currentDay, 'Дата окончания должно быть больше даты начала')
        //          .max(nextDay, 'End time cannot be more than 24 hours after start time');
      } else {
        return schema;
      }
    })
    .required('Дата окончания обязательно'),
});


export default function FormDialog({ open, handleClose }) {
  const { selectedEvent, updateTask, addTask } = useData()
  const newEvent = useMemo(() => (!selectedEvent || selectedEvent?.id === 0), [selectedEvent])
  const { handleSubmit, watch, reset, control, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const isNew = useMemo(() => (!selectedEvent || selectedEvent?.id === 0), [selectedEvent])
  const id = useMemo(() => (selectedEvent?.id || 0), [selectedEvent])
  const allDay = useWatch({ control, name: "allDay", defaultValue: selectedEvent?.allDay });
  const tip = useWatch({ control, name: "tip", defaultValue: 0 });
  const isGrafik = useMemo(() => (tip.toString()==="1") , [tip])  
  const nameFieldCaption = useMemo(() => isGrafik ? "ФИО" : "Наименование", [tip])
  

  const onSubmit = data => isNew
    ? addTask({...data, status: 1, sendToMattermost: false })
    : updateTask({ ...data, status: 1, sendToMattermost: false, id: id })


  useEffect(() => {
    if (!selectedEvent) return
    if (isNew) {
      reset({
        tip: selectedEvent?.tip || 3,
        name: selectedEvent?.name || "",
        allDay: selectedEvent.allDay,
        start: selectedEvent.start || dayjs(),
        end: selectedEvent.end || dayjs(),
        comment: ""
      })
      return
    }

    reset({
      tip: selectedEvent?.event?.tip || 3,
      name: selectedEvent?.name,
      allDay: selectedEvent.allDay,
      start: selectedEvent.start,
      end: createEndDateForm(selectedEvent.start, selectedEvent.end, selectedEvent?.allDay),
      comment: selectedEvent?.event?.comment || ""
    })

  }, [selectedEvent])


  useEffect(() => {
    if (allDay) {
      setValue("start", dayjs(watch('start')).startOf('day'))
      setValue("end", dayjs(watch('end')).startOf('day'))
    }
  }, [allDay])

  const handleChangeAllDay = (event) => {
    if (event.target.checked) {
      reset({
        start: dayjs(watch('start')).startOf('day'),
        end: dayjs(watch('end')).startOf('day'),
      })
    }
  };

  // console.log('errors', errors)
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
            <Select name="tip" label="тип" control={control} disabled={isGrafik} disabledFirstItem={newEvent} />
          </Stack>
          <Stack direction="row">
            <AccountCircleIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
            <FormInput name="name" label={nameFieldCaption} control={control} disabled={isGrafik} autoFocus />
          </Stack>
          <Stack >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
              <Stack direction="row" justifyContent="space-between" sx={{ marginBottom: '15px', }}>
                <Box direction="row" sx={{ width: '400px' }}>
                  <AccessTimeIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
                  <FormDatePicker label="дата начала" name="start" control={control} />
                  {!allDay && <FormTimePicker label="время" name="start" control={control} />}
                </Box>
                <Stack direction="row" alignItems="flex-start" justifyContent="flex-end" sx={{ width: '160px' }}>
                  <CheckBox name={"allDay"} label={"Весь день"} control={control} handleChange={handleChangeAllDay} />
                </Stack>
              </Stack>
              <Stack direction="row" sx={{ paddingLeft: '26px', }}>
                <FormDatePicker label="дата окончания" name="end" control={control} />
                {!allDay && <FormTimePicker label="время" name="end" control={control} />}
              </Stack>
            </LocalizationProvider>
            <Box sx={{ marginLeft: '30px', fontSize: '0.8rem', color: 'red' }}>{(errors?.start?.message || "")}</Box>
            <Box sx={{ marginLeft: '30px', fontSize: '0.8rem', color: 'red' }}>{(errors?.end?.message || "")}</Box>
          </Stack >
          <Stack direction="row" sx={{ marginTop: '15px' }}>
            <CommentIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
            <FormInputMultiline label="описание" name={"comment"} control={control} />
          </Stack>
        </Stack>
        <Stack direction="row" sx={{ borderColor: blueGrey[100], borderTopWidth: '1px', borderTopStyle: 'solid', }}>
          <ButtonBox sx={{ borderColor: blueGrey[100], borderRightWidth: '1px', borderRightStyle: 'solid', }}>
            <StyledButton onClick={handleSubmit(onSubmit)}
              variant="text">Сохранить</StyledButton>
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
