import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import NavigationBar from './NavigationBar';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment)

function TrainingsCalendar() {

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


  //EVENTS

  const [events, setEvents] = useState([]);

  const getAllTrainingEvents = () => {
      fetch(process.env.REACT_APP_CUSTOMERS_API_URL + '/trainings')
      .then(result => result.json())
      .then(result => {
          insertCustomers(result.content)
          .then(trainings => {
            setEvents(
              trainings.map((training, index) => {
  
                const start = new Date(training.date);
                const minutes = training.duration;
  
                return {
                  id: index,
                  title: training.activity + ' with ' + training.firstname + ' ' + training.lastname,
                  start: start,
                  end: new Date(start.getTime() + minutes*60000)
                }
              })
            );
            setLoading(false);
          })
          
      })
      .catch(err => console.log(err))
  };


  //HOOKS

  const {defaultDate} = useMemo(() => ({
    defaultDate: new Date(Date.now())
  }), [])

  useEffect(() => {
    getAllTrainingEvents();
  }, []);


  //MAIN CONTENT

  const Content = () => {

    if(loading)
        return <h4>Loading...</h4>
    else
        return(
          <Calendar
            localizer={localizer}
            defaultDate={defaultDate}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
        />
        )
}


  return(
      <div>
        <NavigationBar/>
        <Content/>
      </div>
    )
}

export default TrainingsCalendar;