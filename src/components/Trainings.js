import React, { useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import NavigationBar from './NavigationBar';
import { useNavigate } from"react-router-dom";
import { format } from 'date-fns'

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function Trainings() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);


    //CUSTOMERS

    const insertCustomers = async (trainings) => {
        return Promise.all(
            trainings.map(async training => {
                return getCustomer(training.links[2].href)
                .then(customer => {
                    training.firstname = customer.firstname;
                    training.lastname = customer.lastname;
                    return training;
                });
            })
        )
    };

    const getCustomer = async (href) => {
        return fetch(href).then(result => result.json());
    };


    //TRAININGS

    const [trainings, setTrainings] = useState([]);

    const getAllTrainings = () => {
        fetch(process.env.REACT_APP_CUSTOMERS_API_URL + '/trainings')
        .then(result => result.json())
        .then(result => {
            insertCustomers(result.content)
            .then(trainings => {
                setTrainings(trainings);
                setLoading(false);
            })

        })
        .catch(err => console.log(err))
    };


    //AG-GRID

    const gridRef = useRef();

    const [columns] = useState([
        { field: 'firstname', sortable: true, filter: true },
        { field: 'lastname', sortable: true, filter: true },
        { field: 'date', sortable: true, filter: true, width: 150,
            valueFormatter: params => 
                format(new Date(params.value), 'MM.dd.yyyy hh:mm')},
        { field: 'duration', sortable: true, filter: true, width: 150,
            valueFormatter: params => 
                params.value + ' min' },
        { field: 'activity', sortable: true, filter: true}   
    ]);

    const gridOptions = {
        onRowDoubleClicked: (event) => {
            navigate(
                '/trainings/' + event.data.firstname + '_' + event.data.lastname, 
                { state : { href: event.data.links.find(link => link.rel === 'customer').href}})
        }

    };


    //HOOKS 
    
    useEffect(() => {
        getAllTrainings();
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
                        rowData={trainings}
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
            <NavigationBar/>
            <Content/>
        </>
    );
  }

export default Trainings;
