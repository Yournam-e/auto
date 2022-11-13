import React, { useEffect, useState } from 'react'; 


import { Panel, Title, CardGrid, Button, Card, Cell, Div, Avatar } from '@vkontakte/vkui';
import { Icon24Play, Icon24ClockOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

import './Home.css';  
import LevelCard from './components/LevelCard';
import LongCard from './components/LongCard';
import { connectRoom } from '../../sockets/game';

const Home = ({ id, go, setPopout }) => {

	const [lvlInfo, setLvlInfo] = useState([])




	useEffect(() => {
		async function fetchData() {
			var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			await setLvlInfo(data)
			setPopout(null);
		}
		fetchData();
	}, []);
	

	return(
		<Panel id={id}> 
			<Title level="1" className='lvl-title'>Уровни</Title>
				<div className='long-card-div'>
					<CardGrid size="l" style={{marginBottom:56}}>
						
						<LongCard go={go}/>

						 
						{lvlInfo.map((number)=>{
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
