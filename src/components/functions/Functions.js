import { useEffect, useReducer, useState } from 'react'
import { Checkbox, Button, Form} from 'semantic-ui-react'
import MainMenu from '../mainMenu/MainMenu'
import './styles.css'

export default function Functions(){
    const [command, setCommand] = useState('')
    const handleChange = (event) =>{
        setCommand(event.target.value);
        console.log(command);
    }
    const executeCustomCommand = async()=>{
        window.api.executeCustomCommand({command : command})
    }

    const goRgbPicker = ()=>{
        dispatcher({type : 'go-rgb'});
        window.api.openPicker()
    }
    const reducer = (state, action) =>{
        switch(action.type){
            case 'go-suiveur':
                return {suiveur : true , eviteur : false, rc : false, rgb : false}
            case 'go-eviteur':
                return {suiveur : false , eviteur : true, rc : false, rgb : false}
            case 'go-rc':
                return {suiveur : false , eviteur : false, rc : true, rgb : false}
            case 'go-rgb':
                return {suiveur : false , eviteur : false, rc : false, rgb : true}
            case 'kill':
                return {suiveur : false , eviteur : false, rc : false, rgb : false}
            default:
                return {suiveur : false , eviteur : false, rc : false, rgb : false}
        }
    }
    
    const [state, dispatcher] = useReducer(reducer , {suiveur : false , eviteur : false, rc : false, rgb : false})
    const kill = ()=>{
        dispatcher({type : 'kill'})
        window.api.killScripts();
    }
    useEffect(()=>{
        if(state.eviteur) window.api.goEviteur()
    },[state.eviteur])
    useEffect(()=>{
        if(state.suiveur) window.api.goSuiveur()
    },[state.suiveur])
    useEffect(()=>{
        if(state.rc) window.api.goRemoteControl()
    },[state.rc])
    useEffect(()=>{
        if(state.rgb) window.api.goRGB()
    },[state.rgb])
    return(
        <div>
            <MainMenu/>
            <div className="menu-choices">
                <div className="menu-choice">
                    <Checkbox toggle label="Suiveur" onClick={()=>dispatcher({type : 'go-suiveur'})} checked={state.suiveur}/>
                </div>
                <div className="menu-choice">
                <Checkbox toggle label="Eviteur d'Obstacles" onClick={()=>dispatcher({type : 'go-eviteur'})} checked={state.eviteur}/>
                </div>
                <div className="menu-choice">
                    <Checkbox toggle label="Remote Control" onClick={()=>dispatcher({type : 'go-rc'})} checked={state.rc}/>
                    <Button circular icon='eye' size='medium' onClick={()=>dispatcher({type : 'go-rc'})}/>
                </div>
                <div className="menu-choice">
                    <Checkbox toggle label="RGB" onClick={()=>dispatcher({type : 'go-rgb'})} checked={state.rgb}/>
                    <Button circular icon='lightbulb' size='medium' onClick={()=>goRgbPicker()}  />
                </div>
                <div className="menu-choice">
                    <Button size='medium' onClick={()=>{kill()}} >Terminer les Scripts</Button>
                </div>
                <div className="custom-command">
                    <Form>
                        <Form.Field>
                        <label>Commande personnalisée</label>
                        <input name='command'onChange={(event)=> handleChange(event)} />
                        </Form.Field>
                        <Button 
                            primary 
                            size='medium' 
                            fluid
                            onClick={()=>{executeCustomCommand()}}
                        >Exécuter</Button>
                    </Form>
                </div>
            </div>
            
        </div>
    )
}