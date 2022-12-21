import { useEffect, useState } from 'react'
import { Form, Segment, Button} from 'semantic-ui-react'
import MainMenu from '../mainMenu/MainMenu';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import './styles.css'
export default function Settings(){
    const [scriptData , setScriptData] = useState({script1 : '', script2 : '' , script4 : '', script3 : ''})
    const [openResult, setOpenResult] = useState(false);
    const [testResult, setTestResult] = useState({msg : '', severity : 'warning'})
    const [currentConfig, setCurrentConfig] = useState({script1 : '', script2 : '' , script4 : '', script3 : ''})
    const handleChange = (event) =>{
        let temp = scriptData;
        temp[event.target.name] = event.target.value;
        setScriptData(temp);
        console.log(scriptData);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        setOpenResult(false);
    }
    const handleApplyScripts = async(config) =>{
        let {msg, severity} = await window.api.updateScriptsSettings(config)
        setTestResult({msg: msg, severity : severity})
        setOpenResult(true)
    }
    useEffect(()=>{
        const fetchConfig = async () =>{
            const config = await window.api.fetchCurrentScriptConfig();
            setCurrentConfig(config)
            setScriptData(config)
        }
        fetchConfig()
    },[])
    return(
        <div>
            <MainMenu/>
            <div className='settings-body'>
                <Segment>
                    <Form>
                        <Form.Field>
                        <label>Script1 (Suiveur)</label>
                        <input name='script1' onChange={(event)=> handleChange(event)} defaultValue={currentConfig.script1}/>
                        </Form.Field>
                        <Form.Field>
                        <label>Script2 (Eviteur)</label>
                        <input name='script2' onChange={(event)=> handleChange(event)} defaultValue={currentConfig.script2}/>
                        </Form.Field>
                        <Form.Field>
                        <label>Script3 (RC)</label>
                        <input name='script3' onChange={(event)=> handleChange(event)} defaultValue={currentConfig.script3}/>
                        </Form.Field>
                        <Form.Field>
                        <label>Script4 (RGB)</label>
                        <input name='script4' onChange={(event)=> handleChange(event)} defaultValue={currentConfig.script4}/>
                        </Form.Field>
                        <Button primary onClick={()=> handleApplyScripts(scriptData)}>Appliquer </Button>
                    </Form>
                    
                </Segment>
                <Snackbar open={openResult} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={testResult.severity} sx={{ width: '100%' }}>
                    {testResult.msg}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    )
}