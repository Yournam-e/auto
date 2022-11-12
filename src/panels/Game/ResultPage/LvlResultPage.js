import React, { useEffect, useState } from 'react';


import { 
	Panel,
	Avatar, 
	Button,
	Title, 
	Div,
	Cell,
	List,
	ButtonGroup
 } from '@vkontakte/vkui';

 import { Icon56CheckCircleOutline, Icon56CancelCircleOutline, Icon20ArrowRightOutline, Icon16ClockCircleFill, Icon24RefreshOutline } from '@vkontakte/icons';
 import './LvlResultPage.css'

 
const LvlResultPage = ({ id, go, count }) => {

    let complete = true

	
	return( 
		<Panel id={id}>

            <div className='lvl-res-headDiv'>
                {complete?<Icon56CheckCircleOutline 
                fill="#1A84FF" 
                style={{
                    marginLeft: 'auto', 
                    marginRight: 'auto'
                }}/>
                :<Icon56CancelCircleOutline 
                        fill="#1A84FF" 
                        style={{
                            marginLeft: 'auto', 
                            marginRight: 'auto'
                            }}
                        />}

                <Title className='lvl-res-title-div'>Уровень {complete?'пройден!':'провален'}</Title>
                
                <Title  className='lvl-res-sub-title-div' weight="1" >{complete?'Неплохо!':'Вы не успели'}</Title>

                <div style={{height: 30, marginTop: 12}} className='lvl-res-clock-div'>
					<Icon16ClockCircleFill 
                        className='multiplayer-title-return'
                        width={16} height={16}
						fill='#99A2AD'
						style={{
							display:'inline-block', 
							paddingLeft:5,
							marginTop: 5
						}}
					/>
					<Title
                        style={{
                            display:'inline-block', 
                            paddingLeft:5, 
                            color: '#99A2AD',
                            fontSize: 14
                            }}
                    >1:12</Title>
					
			    </div>

            </div>



            <div className='lvl-res-absolute-div'>
                <ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
                    <div className="result-buttonRetry-div">
                        <Button size="l" style={{
                                backgroundColor:'#1A84FF',
                                borderRadius:25
                                }} 
                                className="result-buttonGroup-retry" 
                                appearance="accent" 
                                stretched
                                before={complete?<Icon20ArrowRightOutline />:<Icon24RefreshOutline  width={20} height={20}/>}>
                            {complete?"Следующий уровень":"Попробовать снова"}
                        </Button>
                    </div>
                    <div className="result-buttonNotNow-div">
                        <Button 
                            onClick={(e)=>{
                                go(e)
                                console.log('ask')
                            }}
                            data-to='menu'
                            size="l"
                            style={{
                                borderRadius:25,
                                color: '#1A84FF'
                            }} 
                            appearance="accent" 
                            mode="tertiary" 
                            stretched>
                            В меню
                        </Button>
                    </div>
                    
                </ButtonGroup>
            </div>
			

			
			 

			

			
			
						
		</Panel>
	);
}



export default LvlResultPage;
