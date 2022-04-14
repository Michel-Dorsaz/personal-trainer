import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import NavigationBar from './NavigationBar';
import { useNavigate, useLocation } from"react-router-dom";
import { format } from 'date-fns';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditTraining from './EditTraining';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function CustomerTrainings() {

    const navigate = useNavigate();
    const { state } = useLocation();       
    const href = state == null ? null : state.href;    

    const [loading, setLoading] = useState(true);


    //SNACKBAR

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [snackBarSeverity, setSnackBarSeverity] = useState('success');

    function showSnackBar(severity, message) {
        setSnackBarSeverity(severity);
        setSnackBarMessage(message);
        setSnackBarOpen(true);
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    //CUSTOMER

    const emptyTraining = {
        date: new Date(Date.now()),
        duration: '',
        activity: ''
    }
    const [customer, setCustomer] = useState({});

    const getCustomer = () => {

        if(customer.links !== undefined)
            getCustomerTrainings(customer.links.find(link => link.rel === 'trainings').href); 
        else{
            fetch(href)
                .then(result => result.json())
                .then(result => {
                    setCustomer(result); 
                    getCustomerTrainings(result.links.find(link => link.rel === 'trainings').href);  
                })
                .catch(err => console.log(err))
        }      
    };


    //TRAININGS

    const [trainings, setTrainings] = useState([]);

    const getCustomerTrainings = (href) => {    
        fetch(href)
        .then(result => result.json())
        .then(result => {
            setTrainings(
                result.content.filter(training => training.date !== undefined)); 
            setLoading(false);              
        })
        .catch(err => console.log(err))       
    };

    const updateTraining = (training) => {
        fetch(training.links.find(link => link.rel === 'training').href, 
            {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(training)
            })
            .then(response => {
                if(response.ok){
                    showSnackBar('success', 'Training was successfully updated !');
                    getCustomer();
                }
                else{
                    showSnackBar('error', 'Something went wrong during training update !')
                }                                  
            })
            .catch(err => console.log(err))
    };

    const addTraining = (training) => {
        fetch(process.env.REACT_APP_CUSTOMERS_API_URL + '/trainings', 
        {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({...training, customer: customer.links.find(link => link.rel === 'customer').href})
        })
        .then(response => {
            if(response.ok){
                showSnackBar('success', 'Training was successfully added !');
                getCustomer();
            }
            else{
                showSnackBar('error', 'Something went wrong during training creation !')
            }            
        })
        .catch(err => console.log(err))
    };

    const deleteTraining = (training) => {
        if(window.confirm('Delete training ' + training.activity + ' : ' + training.date + ' ?')) {
            fetch(training.links.find(link => link.rel === 'training').href, 
                { method: 'DELETE'})
            .then(response => {
                if(response.ok){
                    showSnackBar('success', 'Training was successfully deleted !');
                    getCustomer();
                }
                else{
                    showSnackBar('error', 'Something went wrong during training deletion !')
                }                
            })
            .catch(err => console.log(err))
        }       
    };


    //AG-GRID

    const gridRef = useRef();

    const [columns] = useState([
        { field: 'date', sortable: true, filter: true, width: 150,
            valueFormatter: params => 
                format(new Date(params.value), 'MM.dd.yyyy hh:mm')},
        { field: 'duration', sortable: true, filter: true, width: 150,
            valueFormatter: params => 
                params.value + ' min' },
        { field: 'activity', sortable: true, filter: true},
        { 
            field: 'links[0].href',
            headerName: '',
            width: 100,
            cellRenderer: params => 
                <EditTraining 
                    onSave={(training) => updateTraining(training)} 
                    editedTraining={params.data} 
                    ButtonComponent={({onClick}) =>
                        <IconButton onClick={onClick} aria-label="delete">
                            <EditIcon />
                        </IconButton> 
                    }
                />
        },  
        { 
            field: 'links[1].href',
            headerName: '',
            width: 100,
            cellRenderer: params => 
                <IconButton aria-label="delete" color="error"
                    onClick={() => deleteTraining(params.data)}>
                    <DeleteIcon />
                </IconButton>
        } 
    ]);


    //HOOKS 

    useEffect(() => {
        if(href == null)
            navigate('/page_not_found');
        else
            getCustomer();          
    }, []);

    //MAIN CONTENT

    const Content = () => {

        if(loading)
            return <h4>Loading...</h4>
        else
            return(
                <div className="ag-theme-material" style={{height: '80vh', width: '100%'}}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={trainings}
                        columnDefs={columns}
                        pagination={true}
                        paginationPageSize={10}
                        suppressCellFocus={true}
                    />
                </div>
            )
    }

    return (
        <>
            <NavigationBar 
                AddComponent={() =>
                    <EditTraining
                        onSave={(training) => addTraining(training)} 
                        editedTraining={emptyTraining}  
                        ButtonComponent={ ({onClick}) =>
                            <IconButton  variant='button' color='inherit' 
                                sx={{ my: 2,  mr: 10}}
                                onClick={onClick}>
                                <AddIcon />
                            Add new training
                            </IconButton> 
                    }
                />
            } />
            <h1 style={{backgroundColor: 'lightgrey'}}>{customer.firstname} {customer.lastname}</h1>
            <Snackbar 
                open={snackBarOpen} 
                autoHideDuration={5000}
                onClose={() => setSnackBarOpen(false)}>
                <Alert 
                    onClose={() => setSnackBarOpen(false)}
                    severity={snackBarSeverity} 
                    sx={{ width: '100%' }}>
                {snackBarMessage}
                </Alert>
            </Snackbar>
            <Content/>
        </>
    );
  }

export default CustomerTrainings;
