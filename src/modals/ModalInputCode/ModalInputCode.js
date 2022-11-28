import React, { useEffect, useState } from 'react';

import { 
	Input,
	ModalPage, 
	Button,
	PanelHeaderClose, 
	ModalPageHeader,
    Div,
    Alert
 } from '@vkontakte/vkui';


import bridge from '@vkontakte/vk-bridge';

import { Icon24DismissDark } from '@vkontakte/icons';
 

import './style.css'

import axios from 'axios';


import InputMinimalist from './InputMinimalist'
import { joinRoom } from '../../sockets/game';
import { qsSign } from '../../hooks/qs-sign';
 

const ModalInputCode = ({ id, setGameInfo, gameInfo,
    setJoinCode, setConnectType,
    setActiveModal, platform,
    joinCode, setPopout}) =>{

    const textInput = React.createRef();


    const [disabledButton, setDisabledButton] = useState(true)

    

    
    async function getId(){
        
        axios.get(`https://showtime.app-dich.com/api/plus-plus/room/exists/${textInput.current.state.value}${qsSign}`) //получил инфу о лвлах
			.then(async function (res) {
				await console.log(res.data.data) 
                if(res.data.data === true){
                    const user = await bridge.send('VKWebAppGetUserInfo'); 
                    //await connectRoom(qsSign, textInput.current.value, user.id);
                    joinRoom(textInput.current.state.value, user.id)
                    setGameInfo({ ...gameInfo, roomId: textInput.current.state.value})
                    setConnectType('join')
                    setJoinCode(textInput.current.state.value)
                    setActiveModal(null)
                }else{
                    setPopout(
                        <Alert
                          actions={[
                            {
                              title: "Ок",
                              mode: "destructive",
                              autoclose: true,
                              action: () => {
                              },
                            },
                          ]}
                          actionsLayout="vertical"
                          onClose={()=>{
                            setPopout(null)
                          }}
                          header="Внимание"
                          text="Лобби не существует или было удалено"
                        />
                      );
                }
			})
			.catch(function (error) {
				console.warn(error);
			});



       
    }
 

    return(
        
        <ModalPage id={id}>

        <ModalPageHeader
            after={platform === 'ios'||
            platform === 'android'||
            platform === 'mobile-web'&&<Icon24DismissDark onClick={()=>{
                setActiveModal(null)}} />}
            >
            Введите код
        </ModalPageHeader>
                <Div>
                    <Div  style={{padding: 10}}>
                    </Div>
                    
                    <div className='input-code-div'>
                    <InputMinimalist
                        
                        placeholder='XXXXXX'
                        ref={textInput}
                        maxLength={6}
                        onChange={value => {
                            if(value === joinCode || value.length <6){
                                setDisabledButton(true)
                            }else{
                                setDisabledButton(false)
                            }
                        }}
                        onKeyUp={e => {
                            if (e.key === 'Enter' || e.keyCode === 13) {
                                getId()
                            }
                        }}

                        />
                    </div>

                    <div></div>

                    <Div style={{marginLeft: 20, marginTop: 30, marginRight: 20}}>
                        <Button
                        stretched
                        disabled={disabledButton} 
                        onClick={()=>{
                            getId()
                            console.log()
                        }}
                        style={{padding: 12, borderRadius: 100, background: '1A84FF'}}>
                            Присоединиться
                        </Button>
                    </Div>
                    
                    
                </Div> 
                <Div  style={{padding: 20}}>
                </Div>
        </ModalPage>
        
      );
}


export default ModalInputCode;
