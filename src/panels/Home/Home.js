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

const Home = ({ id, go, setPopout, setSingleType, setLocalTask, setActivePanel }) => {

	const [lvlsInfo, setLvlsInfo] = useState(null)

	const url ='https://showtime.app-dich.com/api/plus-plus/'
	
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
						setLocalTask={setLocalTask}/>

						 
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number)=>{
							return(
								<LevelCard key={number} go={go} number={number}/>
							)
						})} 
						
						
						
						
						
						 
					
        		</CardGrid>
				</div>
		</Panel>
	);

	}


export default Home;
