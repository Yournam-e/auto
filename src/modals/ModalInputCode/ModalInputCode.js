import React, { useEffect, useState } from 'react';

<<<<<<< HEAD
import { 
	Input,
	ModalPage, 
	Button,
	PanelHeaderClose, 
	ModalPageHeader,
    Div
 } from '@vkontakte/vkui';


import bridge from '@vkontakte/vk-bridge';

import { Icon24DismissDark } from '@vkontakte/icons';
 

import './style.css'



import InputMinimalist from './InputMinimalist'
import { joinRoom } from '../../sockets/game';
 

const ModalInputCode = ({ id, setGameInfo, gameInfo,setJoinCode, setConnectType,setActiveModal, platform}) =>{
=======
import {
    Input,
    ModalPage,
    Button,
    Title,
    IconButton
} from '@vkontakte/vkui';

import { Icon16Clear } from '@vkontakte/icons';

import './InputCode.css'

import bridge from '@vkontakte/vk-bridge';

import { qsSign } from '../../hooks/qs-sign';

import { joinRoom } from '../../sockets/game';

const ModalInputCode = ({ id, setGameInfo, gameInfo, setJoinCode, setConnectType, setActiveModal }) => {
>>>>>>> ca7c792bbea3d6a8a045a11152e053bdcc669240

    const textInput = React.createRef();


<<<<<<< HEAD
    return(
        
        <ModalPage id={id}>

        <ModalPageHeader
            after={platform === 'ios'||
            platform === 'android'||
            platform === 'mobile-web'&&<Icon24DismissDark onClick={()=>{}} />}
            >
            Введите код
        </ModalPageHeader>
                <Div>
                    <Div  style={{padding: 10}}>
                    </Div>
                    
                    <div className='input-code-div'>
                    <InputMinimalist
                        
                        placeholder='XXXXX'
                        ref={textInput}
                        maxLength={5}
                        onChange={value => console.log(value)}

                        />
                    </div>

                    <div></div>

                    <Div style={{marginLeft: 20, marginTop: 30, marginRight: 20}}>
                        <Button
                        stretched 
                        onClick={()=>{
                            async function getId(){
                                const user = await bridge.send('VKWebAppGetUserInfo'); 
                                //await connectRoom(qsSign, textInput.current.value, user.id);
                                joinRoom(textInput.current.state.value, user.id)
                                setGameInfo({ ...gameInfo, roomId: textInput.current.state.value})
                                setConnectType('join')
                                setJoinCode(textInput.current.state.value)
                                setActiveModal(null)
                            }

                            getId()
                            console.log()
                        }}
                        style={{padding: 12, borderRadius: 25, background: '1A84FF'}}>
                            Присоединиться
                        </Button>
                    </Div>
                    
                    
                </Div> 
                <Div  style={{padding: 20}}>
                </Div>
=======

    return (

        <ModalPage id={id}
            settlingHeight={100}>

            <div >

                <div><Title level="1" >Используйте все функции!</Title></div>
                <div> <Title level="3" weight="3" >дай код</Title></div>

                <input type="text" name="name" maxlength="5" className='input-code' autocomplete="off" />

                <Input

                    getRef={textInput}
                    type="text"
                    placeholder="введи уже код"
                    defaultValue=""
                    after={
                        <IconButton
                            hoverMode="opacity"
                            aria-label="Очистить поле"
                            onClick={(e) => {

                                async function getId() {
                                    //await connectRoom(qsSign, textInput.current.value, user.id);
                                    joinRoom(textInput.current.value)
                                    setGameInfo({ ...gameInfo, roomId: textInput.current.value })
                                    setConnectType('join')
                                    setJoinCode(textInput.current.value)
                                    setActiveModal(null)
                                }

                                getId()


                            }}
                            data-to='lobbyForGuest'
                        >
                            <Icon16Clear />
                        </IconButton>
                    }
                />


            </div>




>>>>>>> ca7c792bbea3d6a8a045a11152e053bdcc669240
        </ModalPage>

    );
}


export default ModalInputCode;
