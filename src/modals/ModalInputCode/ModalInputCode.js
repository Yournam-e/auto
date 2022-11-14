import React, { useEffect, useState } from 'react';

import { 
	Input,
	ModalPage, 
	Button,
	Title, 
	IconButton
 } from '@vkontakte/vkui';

 import { Icon16Clear } from '@vkontakte/icons';
 


 import bridge from '@vkontakte/vk-bridge';

 import { qsSign } from '../../hooks/qs-sign';

 import { joinRoom } from '../../sockets/game';

const ModalInputCode = ({ id, setGameInfo, gameInfo,setJoinCode, setConnectType,setActiveModal}) =>{

    const textInput = React.createRef();

 

    return(
        
        <ModalPage id={id} 
        settlingHeight={100}>
                
                <div >
                
                <div><Title level="1" >Используйте все функции!</Title></div>
                <div> <Title level="3" weight="3" >дай код</Title></div>
                
                <Input
                    getRef={textInput}
                    type="text"
                    placeholder="введи уже код"
                    defaultValue=""
                    after={
                        <IconButton
                        hoverMode="opacity"
                        aria-label="Очистить поле"
                        onClick={(e)=>{
                            
                            async function getId(){
                                const user = await bridge.send('VKWebAppGetUserInfo'); 
                                //await connectRoom(qsSign, textInput.current.value, user.id);
                                joinRoom(textInput.current.value, user.id)
                                setGameInfo({ ...gameInfo, roomId: textInput.current.value})
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
     
            
            
              
        </ModalPage>
        
      );
}


export default ModalInputCode;
