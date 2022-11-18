import React, { useEffect, useState } from 'react';

import { 
	Input,
	ModalPage, 
	Button,
	ButtonGroup, 
	Div
 } from '@vkontakte/vkui';
 
 import { Icon24ShareOutline } from '@vkontakte/icons';

 import bridge from '@vkontakte/vk-bridge';
import './ModalQR.css'

 import qr from '@vkontakte/vk-qr';

const ModalQRCode = ({ id, joinCode, setActiveModal}) =>{

    let options = {};   

    options.foregroundColor = '#0077FF';
    options.logoData = "https://i.ibb.co/xLkkGgd/vk-logo-3674340.png"; 

    const qrSvg = qr.createQR(`vk.com/app51451320/${joinCode}`, 230, 'qr-code', options);

    function share(){
        bridge.send('VKWebAppShare', {
            link: `vk.com/app51451320/${joinCode}`
            })
            .then((data) => { 
              if (data.result) {
                setActiveModal(null)
              }
            })
            .catch((error) => {
              // Ошибка
              console.log(error);
            });
    }
    
    return(
        
        <ModalPage id={id}>
            <Div>

            <Div  >
                <div style={{margin:100}} className='qr-code'>
                    <img src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`} />
                </div>
            </Div>

            <ButtonGroup  style={{  marginBottom: 120}}  gap="space" className='qr-code-share-button-div'>
				<Button stretched size="s" before={<Icon24ShareOutline />}
                className='qr-code-share-button'
                appearance="accent"
                onClick={()=>{
                    share()
                }}>Поделиться</Button>
			</ButtonGroup>
            
            </Div>
           
              
        </ModalPage>
        
      );
}


export default ModalQRCode;
