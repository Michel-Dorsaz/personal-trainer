import './App.css';
import { Routes,  Route } from"react-router-dom";
import Customers from './components/Customers';
import Trainings from './components/Trainings.js';
import PageNotFound from './components/PageNotFound';
import CustomerTrainings from './components/CustomerTrainings';
import TrainingsCalendar from './components/TrainingsCalendar';
import Statistics from './components/Statistics';

function App() {

  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Customers />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/trainings/*" element={<CustomerTrainings />} />   
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/calendar" element={<TrainingsCalendar />} />      
          <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
