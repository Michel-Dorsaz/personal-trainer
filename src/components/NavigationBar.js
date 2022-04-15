import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from"react-router-dom";


/**
 * A navigation bar
 * @param {*} AddComponent The component to add an element to the list 
 */
function NavigationBar({ AddComponent, ExportComponent }) {

    const links = [
        { title: "Customers", path: "/customers" },
        { title: "Trainings", path: "/trainings" },
        { title: "Calendar", path: "/calendar" },
        { title: "Statistics", path: "/statistics" }
      ];
  
    const navigate = useNavigate();

    const OptionalComponent = ({ Component }) => {
        if(Component !== undefined)
            return(<Component/>)
        else
            return(<></>);
    };

    return(
        <AppBar position='static'>
            <Toolbar sx={{ display: 'flex', alignItems: 'flex-start'}}>          
                <Typography variant='h4' sx={{ my: 2, mr:10}}>
                    My personal trainer
                </Typography>                        
                {
                links.map((link, index) => 
                    <Button
                        sx={{ my: 2}}
                        key={index}
                        variant='button'
                        onClick={() => navigate(link.path)}                  
                    >
                    {link.title}
                    </Button>
                )
                }    
                <OptionalComponent Component={ExportComponent}/>
                <Button sx={{ my: 2,  mr: 10, ml: 'auto'}}>
                </Button>
                <OptionalComponent Component={AddComponent}/>       
            </Toolbar>
        </AppBar>
    )
}

export default NavigationBar;