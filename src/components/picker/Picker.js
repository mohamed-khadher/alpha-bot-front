import CircularColor from 'react-circular-color';
import { Header, Menu, Container } from 'semantic-ui-react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import hexRgb from 'hex-rgb';

export default function Picker(){
    async function handleColorChange(color) {
        let hexColors = hexRgb(color)
        let RGB = {red : hexColors.red, green : hexColors.green, blue : hexColors.blue}
        let data = new FormData()
        for(let key in RGB){
            data.append(key , RGB[key])
        }
        await axios({
            method: "post",
            url: "http://192.168.137.182:8080/rgb",
            data: data,
            headers: { "Content-Type": "multipart/form-data" },
        })
    }
    const close = ()=>{
        window.api.close({window : 'picker'})
    }
    return(
        <Container>
            <Menu pointing secondary borderless stackable className='titlebar'>
                <IconButton 
                onClick={()=>close()} 
                color='error' 
                aria-label="close" 
                style={{position : 'absolute' , top : '2px', right : '6px', zIndex : 900}}
                className='titlebar-close'>
                <CloseIcon />
                </IconButton>
                <Menu.Item>
                    <Header as='h4' content='Color Picker' />
                </Menu.Item>
            </Menu>
            <CircularColor size={200} onChange={handleColorChange} />
        </Container>
    );
}