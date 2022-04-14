import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import NavigationBar from './NavigationBar';
import { useNavigate } from"react-router-dom";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditCustomer from './EditCustomer';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function Customers() {

    const navigate = useNavigate();

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


    //CUSTOMERS

    const emptyCustomer = {
        firstname: '',
        lastname: '',
        streetaddress: '',
        postcode: '',
        city: '',
        email: '',
        phone: ''
    };

    const [customers, setCustomers] = useState([]);

    const getAllCustomers = () => {
        fetch(process.env.REACT_APP_CUSTOMERS_API_URL + '/customers')
        .then(result => result.json())
        .then(result => {
            setCustomers(result.content);     
            setLoading(false);          
        })
        .catch(err => console.log(err))
    };

    const updateCustomer = (customer) => {
        fetch(customer.links.find(link => link.rel === 'customer').href, 
            {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(customer)
            })
            .then(response => {
                if(response.ok){
                    showSnackBar('success', 'Customer was successfully updated !');
                    getAllCustomers();
                }
                else{
                    showSnackBar('error', 'Something went wrong during customer update !')
                }                                  
            })
            .catch(err => console.log(err))
    };

    const addCustomer = (customer) => {
        fetch(process.env.REACT_APP_CUSTOMERS_API_URL + '/customers', 
        {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(customer)
        })
        .then(response => {
            if(response.ok){
                showSnackBar('success', 'Customer was successfully added !');
                getAllCustomers();
            }
            else{
                showSnackBar('error', 'Something went wrong during customer creation !')
            }            
        })
        .catch(err => console.log(err))
    };

    const deleteCustomer = (customer) => {
        if(window.confirm('Delete customer ' + customer.firstname + ' ' + customer.lastname + '?')) {
            fetch(customer.links.find(link => link.rel === 'customer').href, 
                { method: 'DELETE'})
            .then(response => {
                if(response.ok){
                    showSnackBar('success', 'Customer was successfully deleted !');
                    getAllCustomers();
                }
                else{
                    showSnackBar('error', 'Something went wrong during customer deletion !')
                }                
            })
            .catch(err => console.log(err))
        }       
    };


    //AG-GRID

    const gridRef = useRef();

    const [columns] = useState([
        { field: 'firstname', sortable: true, filter: true },
        { field: 'lastname', sortable: true, filter: true },
        { field: 'streetaddress', sortable: true, filter: true},
        { field: 'postcode', sortable: true, filter: true, width: 150 },
        { field: 'city', sortable: true, filter: true },
        { field: 'email', sortable: true, filter: true },       
        { field: 'phone', sortable: true, filter: true, width: 200 },
        { 
            field: 'links[0].href',
            headerName: '',
            width: 100,
            cellRenderer: params => 
                <EditCustomer 
                    onSave={(customer) => updateCustomer(customer)} 
                    editedCustomer={params.data} 
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
                    onClick={() => deleteCustomer(params.data)}>
                    <DeleteIcon />
                </IconButton>
        } 
    ]);

    const gridOptions = {
        onRowDoubleClicked: (event) => {
            navigate(
                '/trainings/' + event.data.firstname + '_' + event.data.lastname, 
                { state : { href: event.data.links.find(link => link.rel === 'customer').href}})
        }

    };

    const onExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);


    //HOOKS 
    
    useEffect(() => {
        getAllCustomers();
    }, []);


    //MAIN CONTENT

    const Content = () => {

        if(loading)
            return <h4>Loading...</h4>
        else
            return(
                <div className="ag-theme-material" style={{height: '90vh', width: '100%'}}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={customers}
                        columnDefs={columns}
                        pagination={true}
                        paginationPageSize={10}
                        gridOptions={gridOptions}
                        suppressCellFocus={true}
                    />
                </div>
            )
    }

    return (
        <>
            <NavigationBar 
                AddComponent={() =>
                    <EditCustomer 
                        onSave={(customer) => addCustomer(customer)} 
                        editedCustomer={emptyCustomer}  
                        ButtonComponent={ ({onClick}) =>
                            <IconButton  variant='button' color='inherit' 
                                sx={{ my: 2,  mr: 10}}
                                onClick={onClick}>
                                <AddIcon />
                            Add new customer
                            </IconButton> 
                    }/>
                } 
                ExportComponent={() =>
                    <Button
                        sx={{ ml: 10, my: 2, color:'black', backgroundColor:'white'}}
                        variant='button'
                        onClick={onExport}                      
                    >
                    Export customers (.CSV)
                    </Button>
                }
                />
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

export default Customers;
