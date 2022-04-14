import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * A dialog form to edit a customer
 * @param {*} onSave Callback function containing the result customer. Fired by the Save button.
 * @param {*} editedCustomer The customer to edit
 * @param {*} ButtonComponent The higher order component with the onClick props bind to onClick()
 * @returns A dialog form
 */
function EditCustomer({ editedCustomer, onSave, ButtonComponent }) {

  const [customer, setCustomer] = useState(editedCustomer);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => { 
    onSave(customer);
    setOpen(false);
  };

  const inputChanged = (event) => {
    setCustomer({...customer, [event.target.name]: event.target.value});
  };

  return (
    <div>
      <ButtonComponent onClick={handleClickOpen}/>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit customer</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                name="firstname"
                value={customer.firstname}
                onChange={inputChanged}
                label="Firstname"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="lastname"
                value={customer.lastname}
                onChange={inputChanged}
                label="Lastname"
                fullWidth
                variant="standard"
            />
           <TextField
                margin="dense"
                name="streetaddress"
                value={customer.streetaddress}
                onChange={inputChanged}
                label="Street address"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="postcode"
                value={customer.postcode}
                onChange={inputChanged}
                label="Post code"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="city"
                value={customer.city}
                onChange={inputChanged}
                label="City"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="email"
                value={customer.email}
                onChange={inputChanged}
                label="Email"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="phone"
                value={customer.phone}
                onChange={inputChanged}
                label="Phone"
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

export default EditCustomer;