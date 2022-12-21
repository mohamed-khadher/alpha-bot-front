import { Link } from 'react-router-dom';
import { Header, Menu } from 'semantic-ui-react'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './menu.css';

export default function MainMenu(){
    const close = ()=>{
        window.api.close({window : 'mainWindow'})
    }
    return(
        <Menu pointing secondary borderless stackable className='titlebar'>
            <IconButton 
            onClick={()=>close()} 
            color='error' 
            aria-label="close" 
            style={{position : 'absolute' , top : '6px', right : '6px', zIndex : 900}}
            className='titlebar-close'>
            <CloseIcon />
            </IconButton>
            <Menu.Item>
            <Header as='h4' icon='angle double right' content='AlphaBot2' />
            </Menu.Item>
            <Link to="/functions" style={{paddingTop :'6px'}}>
            <Menu.Item 
            name="Fonctionnement"
            link
            />
            </Link>
            <Link to="/settings" style={{paddingTop :'6px'}}  >
            <Menu.Item 
                name='Paramétres'
            />
            </Link>
            <Link to="/scripts" style={{paddingTop :'6px'}}  >
            <Menu.Item 
                name='Scripts'
            />
            </Link>
        </Menu>
    );
}