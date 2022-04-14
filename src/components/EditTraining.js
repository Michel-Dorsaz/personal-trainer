import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

/**
 * A dialog form to edit a training
 * @param {*} onSave Callback function containing the result training. Fired by the Save button.
 * @param {*} editedTraining The training to edit
 * @param {*} ButtonComponent The higher order component with the onClick props bind to onClick()
 * @returns A dialog form
 */
function EditTraining({ editedTraining, onSave, ButtonComponent }) {

  const [training, setTraining] = useState(editedTraining);

  //DIALOG
  
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => { 
    onSave(training);
    setOpen(false);
  };

  const inputChanged = (event) => {
    setTraining({...training, [event.target.name]: event.target.value});
  };

  const dateChanged = (date) => {
    setTraining({...training, date: date});
  };

  return (
    <div>
      <ButtonComponent onClick={handleClickOpen}/>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit training</DialogTitle>
        <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                label="Date&Time picker"
                name="date"
                value={training.date}
                onChange={dateChanged}
                renderInput={(params) => 
                    <TextField 
                        margin="dense"
                        fullWidth
                        variant="standard"
                        {...params} />
                    }
            />
            </LocalizationProvider>
            <TextField
                margin="dense"
                name="duration"
                value={training.duration}
                onChange={inputChanged}
                label="Duration"
                fullWidth
                variant="standard"
            />
           <TextField
                margin="dense"
                name="activity"
                value={training.activity}
                onChange={inputChanged}
                label="Activity"
                fullWidth
                variant="standard"
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditTraining;
