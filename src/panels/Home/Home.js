import React, { useEffect, useState } from 'react'; 


import { Panel, Title, CardGrid, Button, Card, Cell, Div, Avatar } from '@vkontakte/vkui';
import { Icon24Play, Icon24ClockOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

import './Home.css';  
import LevelCard from './components/LevelCard';
import LongCard from './components/LongCard';
import { connectRoom } from '../../sockets/game';
import axios from 'axios';
import { qsSign } from '../../hooks/qs-sign';
import { useUserId } from '../../hooks/useUserId';

import '../../img/Fonts.css';

const Home = ({ 
	id,
	go,
	setPopout,
	setSingleType, 
	setLocalTask, 
	setActivePanel, 
	setLvlData, 
	lvlData, 
	setLvlNumber, 
	setReady,
	lvlNumber,
	themeColors}) => {

	const [lvlsInfo, setLvlsInfo] = useState(null)

	const url ='https://showtime.app-dich.com/api/plus-plus/'



		
	function devideLvl(){
		switch (lvlNumber) {
			case 1:
				return ['40 секунд', '10 задач']
			case 2:
				return ['40 секунд', '10 задач']
			case 3:
				return ['30 секунд', '10 задач']
			case 4:
				return ['30 секунд', '15 задач']
			case 5:
				return ['1 минута', '15 задач']
			case 6:
				return ['1 минута', '15 задач']
			case 7:
				return ['1 минута', '15 задач']
			case 8:
				return ['1 минута', '15 задач']
			case 9:
				return ['25 секунд', '15 задач']
			case 10:
				return ['20 секунд', '20 задач']
		  }

	}

	
	
	useEffect(()=>{
		axios.get(`${url}info${qsSign}`) //получил инфу о лвлах
		.then(async function (response) {
			await setLvlsInfo(response.data.data)
			await console.log(response.data.data)
			await setPopout(null)
		})
		.catch(function (error) {
			console.warn(error);
		});


		



		

		 
	}, [])

 
	

	return(
		<Panel id={id}> 
			<Title level="1" className='lvl-title'>Уровни</Title>
				<div className='long-card-div'>
					<CardGrid size="l" style={{marginBottom:56}}>
						
						<LongCard setActivePanel={setActivePanel} 
						setSingleType={setSingleType} 
						setPopout={setPopout} 
						lvlsInfo={lvlsInfo}
						setLocalTask={setLocalTask}
						themeColors={themeColors}/>

						 
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number)=>{
							return(
								<LevelCard
									key={number} 
									go={go}
									number={number} 
									lvlsInfo={lvlsInfo}
									setPopout={setPopout}
									setActivePanel={setActivePanel}
									setLvlData={setLvlData}
									lvlData={lvlData}
									setLvlNumber={setLvlNumber}
									setReady={setReady}
									themeColors={themeColors} />
							)
						})} 
						
						
						
						
						
						 
					
        		</CardGrid>
				</div>
		</Panel>
	);

	}


export default Home;
