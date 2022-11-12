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

 import { connectRoom, createRoom, joinRoom } from '../../sockets/game';

const ModalInputCode = ({ id}) =>{

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
                        onClick={()=>{
                            async function getId(){
                                const user = await bridge.send('VKWebAppGetUserInfo');
                                console.log(user.id)
                                console.log(textInput.current.value)
                                //await connectRoom(qsSign, textInput.current.value, user.id);
                                joinRoom(textInput.current.value, user.id)
                            }

                            getId()
                            

                        }}
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
