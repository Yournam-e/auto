import React, { useEffect, useState } from 'react';

import {Title, Button, Card, Div, ScreenSpinner} from '@vkontakte/vkui';
import { Icon24Play, Icon24ClockOutline } from '@vkontakte/icons';

import axios from 'axios';

import '../Home.css';
import { qsSign } from '../../../hooks/qs-sign';


const LongCard = ({setActivePanel, setSingleType, setPopout, lvlsInfo, themeColors}) => {
	
 


	function checkToDelete(){
		lvlsInfo&&lvlsInfo.map((item, index)=>{

			console.log(item)
			console.log('Длина массива ' + lvlsInfo.length)
			
			console.log('Длина indexc ' + index)
			
			if(item.lvlType === 'single30'){
				axios.delete(`https://showtime.app-dich.com/api/plus-plus/lvl/${item.id}${qsSign}`)
				.then(async function (response) {
					console.log(response.data.data)
				})
				.catch(function (error) {
					console.warn(error);
				});
			}

			 
			
		})
	}
 

 

	
	
	return(

		<div className='long-card-div-div'>

		
		<Card
			style={{
				backgroundColor:themeColors==='dark'?'#2C2C31':'#FFFFFF',
				borderRadius: 24}}
			className='long-card'>
				<div style={{minHeight: 141}}>
									
					<Icon24ClockOutline width={24} height={24} className='long-card-icon' style={{
							backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF'
						}}/>
						<Div>
							<div>
								<Title className='long-card-title' style={{color: themeColors==='dark'?'#C4C8CC':'#2C2D2E'}}>
									Попробуй 30-секундный режим
								</Title>
							</div>
							<div>
								<Title level="3" className='long-card-text'>
									Реши как можно больше задач за 30 секунд
								</Title>
							</div>
										
						</Div>

						<Button
							className='button-long'
							onClick={async function(e){
								await setSingleType('single30')
								await setActivePanel('temporaryGame')
								await checkToDelete()
								await setPopout(<ScreenSpinner size='large' />)
							}}
							data-to='temporaryGame'
							style={{
							backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
							color:'#1984FF',
							borderRadius:25
							}}
							before={<Icon24Play height={16} width={16} />}
							mode='accent'
							size='s'
							>Попробовать</Button>
										
								
				</div>
									
		</Card>
		</div>
	);

	}


export default LongCard;
