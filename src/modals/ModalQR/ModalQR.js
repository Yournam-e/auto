import React, { useEffect, useState } from 'react';

import { 
	Input,
	ModalPage, 
	Button,
	ButtonGroup, 
	IconButton
 } from '@vkontakte/vkui';
 
 import { Icon24ShareOutline } from '@vkontakte/icons';


import './ModalQR.css'

 import qr from '@vkontakte/vk-qr';

const ModalQRCode = ({ id, joinCode}) =>{

    let options = {};   

    options.foregroundColor = '#0077FF';
    options.logoData = "https://i.ibb.co/xLkkGgd/vk-logo-3674340.png"; 

    const qrSvg = qr.createQR(`vk.com/app51451320/${joinCode}`, 230, 'qr-code', options);

    
    
    return(
        
        <ModalPage id={id}>
            <div  >
                <div  className='qr-code'>
                    <img src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`} />
                </div>
            </div>

            <ButtonGroup gap="space" style={{ marginBottom: 101}} className='multiplayer-play-div'>
				<Button size="s" before={<Icon24ShareOutline />} className='multiplayer-play-button' appearance="accent">Поделиться</Button>
			</ButtonGroup>
            
           
              
        </ModalPage>
        
      );
}


export default ModalQRCode;
