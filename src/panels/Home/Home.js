import React, { useEffect, useState } from 'react'; 


import { Panel, Title, CardGrid, Button, Card, Cell, Div, PanelHeader } from '@vkontakte/vkui';
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
	setActivePanel, activePanel,
	setLvlData, 
	lvlData, 
	setLvlNumber, 
	setReady,
	lvlNumber,
	themeColors,
	setPanelsHistory,
	panelsHistory}) => {

	const [lvlsInfo, setLvlsInfo] = useState(null)

	const url ='https://showtime.app-dich.com/api/plus-plus/'

	const [completeArray, setCompleteArray] = useState([false,false,false,false,false,false,false,false,false,false])


	const [completeLvls, setCompleteLvls] = useState([
		{id: 'one',
		complete: false,
		needComplete: 8},
		{id: 'two',
		complete: false,
		needComplete: 8},
		{id: 'three',
		complete: false,
		needComplete: 8},
		{id: 'four',
		complete: false,
		needComplete: 8},
		{id: 'five',
		complete: false,
		needComplete: 8},
		{id: 'six',
		complete: false,
		needComplete: 8},
		{id: 'seven',
		complete: false,
		needComplete: 8},
		{id: 'eight',
		complete: false,
		needComplete: 8},
		{id: 'nine',
		complete: false,
		needComplete: 8},
		{id: 'ten',
		complete: false,
		needComplete: 8},
	])

	useEffect(()=>{

	}, [completeLvls])

	
		
	function devideType(i){
		switch (i) {
			case 'one':
				return 1
			case 'two':
				return 2
			case  'three':
				return 3
			case 'four':
				return 4
			case 'five':
				return 5
			case 'six':
				return 6
			case 'seven':
				return 7
			case 'eight':
				return 8
			case 'nine':
				return 9
			case  'ten':
				return 10
		  }

	}
	

	function devideLvl(numberId){
		switch (numberId) {
			case 1:
				return ['30 секунд', '10 задач', 10]
			case 2:
				return ['30 секунд', '10 задач', 10]
			case 3:
				return ['30 секунд', '10 задач', 10]
			case 4:
				return ['30 секунд', '15 задач', 15]
			case 5:
				return ['30 секунд', '15 задач', 15]
			case 6:
				return ['30 секунд', '15 задач', 15]
			case 7:
				return ['30 секунд', '15 задач', 15]
			case 8:
				return ['30 секунд', '15 задач', 15]
			case 9:
				return ['30 секунд', '15 задач', 15]
			case 10:
				return ['30 секунд', '20 задач', 20]
		  }

	}


	
	
	useEffect(()=>{

		setPanelsHistory([...panelsHistory, activePanel])

		window.history.pushState({activePanel: 'panel'}, 'Title');

		document.body.classList.add("body-dark")
		axios.get(`${url}info${qsSign}`) //получил инфу о лвлах
		.then(async function (response) {
			await setLvlsInfo(response.data.data)
			await console.log(response.data.data)
			response.data.data.map((item, index)=>{
				console.log(item)
				console.log(completeLvls[index])
				setCompleteLvls([
					...completeLvls.map((todo) =>
						item.lvlType === todo.id &&item.rightResults>todo.needComplete ? { ...todo, complete: true} : {...todo}
					)
				])


  
				
 

			})
			await setPopout(null)
		})
		.catch(function (error) {
			console.warn(error);
		});


		



		

		 
	}, [])

 
	

	return(
		<Panel id={id}> 
			<PanelHeader
				style={{backgroundColor: 'transparent' }} >Уровни </PanelHeader>
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
									themeColors={themeColors}
									devideLvl={devideLvl}
									completeArray={completeArray}
									completeLvls={completeLvls} />
									
							)
						})} 
						
						
						
						
						
						 
					
        		</CardGrid>
				</div>
		</Panel>
	);

	}


export default Home;
