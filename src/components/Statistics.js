import React, { useState, useEffect } from 'react';
import { Chart, Bars, Ticks, Layer } from 'rumble-charts';
import NavigationBar from './NavigationBar';
import Button from '@mui/material/Button';


function Statistics() {

    var groupBy = require('lodash.groupby');

    const [loading, setLoading] = useState(true); 


    //ACTIVITIES

    /**
     * activities is not using React.useEffect because it will only be set once.
     */
    let activities = [];

    const getAllTrainings = () => {
        fetch(process.env.REACT_APP_CUSTOMERS_API_URL + '/trainings')
        .then(result => result.json())
        .then(result => {

            activities = groupBy(result.content, training => training.activity);
            /*
            RESULT :
            {
                "Jogging": [
                    {
                        date,
                        duration,
                        activity
                    },
                    {
                        date,
                        duration,
                        activity
                    }
                ],
                "Spinning":[...]
            }
            */

            generateStatistics(activities);
            setSeriesData("nInstances");
            setLoading(false);
        })
        .catch(err => console.log(err))
    };


    //STATISTICS

    const [statisticsData, setStatisticsData] = useState({
        nInstances:{
            data:[],
            title:"Number of instances per activity"
        },
        total:{
            data:[],
            title:"Total duration per activity"
        },
        average:{
            data:[],
            title:"Average duration per activity"
        }
    });

    const generateStatistics = (activities) => {
        
        for (const [activity, trainings] of Object.entries(activities)) {
        
            // Statistics values (sum, average, ...)

            const nInstances = trainings.length;
            const total = trainings.reduce((training_A, training_B) => 
            {
                return { duration: training_A.duration + training_B.duration};
            }
            ).duration;

            const average = total/nInstances;

            // Setting a random bar color for each activity
            const color = '#' + Math.floor(Math.random()*16777215).toString(16);

            // Storing the statistics data state into array to push new value into it.
            // This is done that way because we dont want to push directly into a state.
            const dataInstances = statisticsData.nInstances;
            const dataTotal = statisticsData.total;
            const dataAverage = statisticsData.average;

            dataInstances.data.push({y:nInstances, label:activity, color:color});
            dataTotal.data.push({y:total, label:activity, color:color});
            dataAverage.data.push({y:average, label:activity, color:color});


            //Updating the state with the arrays
            setStatisticsData({
                nInstances:dataInstances,
                total:dataTotal,
                average:dataAverage
            });
        };
    };


    // CHART

    /**
     * Modify the data displayed to the graph according to the data type parameter.
     * @param {*} dataType The statistic data type to display
     */
    const setSeriesData = (dataType) => {
        setSeries([{data: statisticsData[dataType].data}]); 
        setTitle(statisticsData[dataType].title); 
    };

    const [series, setSeries] = useState([]);

    // Chart's dimensions
    const width = window.screen.width;
    const height = window.screen.height*0.7;

      
    //HOOKS 
    
    useEffect(() => {
        getAllTrainings();
    }, []);


    //MAIN CONTENT

    const [title, setTitle] = useState('Statistics');

    const Content = () => {

        if(loading)
            return <h4>Loading...</h4>
        else
            return(
                <>
                    <Button
                        name='nInstances'
                        variant='button'
                        sx={{backgroundColor:'greenyellow', mx: 2}}
                        onClick={(event) => setSeriesData(event.target.name)}
                    >
                    Number of instances per activity
                    </Button>
                    <Button
                        name='total'
                        variant='button'
                        sx={{backgroundColor:'greenyellow', mx: 2}}
                        onClick={(event) => setSeriesData(event.target.name)}
                    >
                    Total duration per activity
                    </Button>
                    <Button
                        name='average'
                        variant='button'
                        sx={{backgroundColor:'greenyellow', mx: 2}}
                        onClick={(event) => setSeriesData(event.target.name)}
                    >
                    Average duration per activity
                    </Button>
                                  
                    <h1>{title}</h1>
                    <Chart
                    width={width}
                    height={height}
                    series={series}
                    minY={0}
                    style={{
                        fontFamily: 'sans-serif',
                        fontSize: '0.75em'
                    }}
                    >
                    <Layer width="80%" height="90%" position="top center">
                        <Ticks
                        axis="y"
                        lineLength="100%"
                        lineVisible
                        lineStyle={{
                            stroke: 'lightgray'
                        }}
                        labelStyle={{
                            dominantBaseline: 'middle',
                            fill: 'black',
                            textAnchor: 'end'
                        }}
                        labelAttributes={{
                            x: -5
                        }}
                        />
                        <Ticks
                        axis="x"
                        label={({index, props}) => props.series[0].data[index].label}
                        labelStyle={{
                            dominantBaseline: 'text-before-edge',
                            fill: 'black',
                            textAnchor: 'middle'
                        }}
                        labelAttributes={{
                            y: 3
                        }}
                        />
                        <Bars groupPadding="10%" innerPadding="1%" />                   
                        </Layer>
                    </Chart>
                   
                </>
            )
    }

    return(
        <>
            <NavigationBar />
            <Content />
        </>
        
      );
}

export default Statistics;