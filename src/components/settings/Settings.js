import { useEffect, useState } from 'react'
import { Form, Segment, Button, Loader, Dropdown} from 'semantic-ui-react'
import MainMenu from '../mainMenu/MainMenu';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './styles.css'

export default function Settings(){
    const [connectionData , setConnectionData] = useState({ip : '192.168.137.182', user : 'pi' , pwd : 'raspberry', port : '22'});
    const [openResult, setOpenResult] = useState(false);
    const [testResult, setTestResult] = useState({msg : '', severity : 'warning'});
    const [loaderEnable, setLoaderEnable] = useState(false);
    const [availableDevices, setAvailableDevices] = useState([]);
    const [ipOptions, setIpOptions] = useState([]);
    const [isScanning, setIsScanning] = useState(false);

    const handleChange = (event) =>{
        let temp = connectionData;
        temp[event.target.name] = event.target.value;
        setConnectionData(temp);
        console.log(connectionData);
    }

    const handleIpChange = (event) =>{
        let temp = connectionData;
        temp['ip'] = event.target.textContent;
        setConnectionData(temp);
        console.log(connectionData);
    }

    useEffect(()=>{
        const scanDevices = async ()=>{
            const devices = await window.api.getLocalMachines();
            setAvailableDevices(devices);
        }
        scanDevices();
        let temp = [];
        availableDevices.forEach(e => {
            temp.push({value : e.ip, text : e.ip})
        });
        setIpOptions(temp);
    },[]);

    const handleScan = async()=>{
        setIsScanning(true);
        const devices = await window.api.getLocalMachines();
        setAvailableDevices(devices)
        let temp = [];
        devices.forEach(e => {
            temp.push({value : e.ip, text : e.ip})
        });
        setIpOptions(temp);
        setIsScanning(false);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setLoaderEnable(false)
        setOpenResult(false);
    }
    const handleTestConnection = async(config) =>{
        setLoaderEnable(true)
        let msg = await window.api.testConnection(config)
        setTestResult({msg: msg, severity : msg.includes('not') ? 'error' : 'success'})
        setOpenResult(true)
    }
    return(
        <div>
            <MainMenu/>
            <div className='settings-body'>
                <Segment>
                    <Form>
                        <Form.Field>
                            <label>IP</label>
                            <Dropdown
                            name='ip' 
                            loading={isScanning}
                            clearable
                            placeholder='Appareils découverts'
                            options={ipOptions}
                            selection onChange={(event)=> handleIpChange(event)}
                            onOpen={()=>handleScan()}
                            allowAdditions
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Port</label>
                            <input name='port'onChange={(event)=> handleChange(event)} defaultValue='22'/>
                        </Form.Field>
                        <Form.Field>
                            <label>Nom d'utilisateur</label>
                            <input name='user'onChange={(event)=> handleChange(event)} defaultValue='pi'/>
                        </Form.Field>
                        <Form.Field>
                            <label>Mot de Passe</label>
                            <input type='password' name='pwd' onChange={(event)=> handleChange(event)} defaultValue='raspberry'/>
                        </Form.Field>
                        <Button primary onClick={()=> handleTestConnection(connectionData)}>Appliquer et Tester la connection </Button>
                    </Form>
                    
                </Segment>
                <Loader active={!openResult && loaderEnable} inline='centered'>Tentative de connexion..</Loader>
                <Snackbar open={openResult} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={testResult.severity} sx={{ width: '100%' }}>
                    {testResult.msg}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    )
}