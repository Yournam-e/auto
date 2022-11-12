import React, { useEffect, useState } from 'react';


import { 
	Panel,
	ScreenSpinner, 
	Button,
	Title, 
	Div
 } from '@vkontakte/vkui';

import '../Game/Game.css';  



import ExmpleGeneration from '../../scripts/ExmpleGeneration';
import { getPadTime } from '../../scripts/getPadTime';
import { Icon16ClockCircleFill } from '@vkontakte/icons';
import { answerTask } from '../../sockets/game';
import { client } from '../../sockets/receiver';

const MultiplayerGame = ({ id, go, count, setCount, setActivePanel, setPopout, gameInfo, setGameInfo, taskInfo, setTaskInfo, setAnswersInfo, answersInfo, setMpGameResults}) => {
	

	

	//const [equation, setEquation] = useState([2, 2, '+', 4]); //задача

	const [selectedAnswer, setSelectedAnswer] = useState();// выбранный ответ

	 
 
	const [timeLeft, setTimeLeft] = useState(30); //время
	const [isCounting, setIsCounting] = useState(true); //время
	

	const minutes = getPadTime(Math.floor(timeLeft/60)); //минуты

	const seconds = getPadTime(timeLeft - minutes * 60); //секунды


	client.gameFinished = ({ game }) => {
		console.debug("gameFinished", game);
		setGameInfo(null)
		setMpGameResults(game)

	  };

	useEffect(()=>{
		timeLeft === 0?setActivePanel('multiplayerResult'):console.log()
	}, [timeLeft])

	useEffect(()=>{
		async function lol(){
			await setPopout(<ScreenSpinner size='large' />)
			await setTimeout(() =>setPopout(null), 1000);
		}

		lol()
	}, [])

	useEffect(()=>{

		

		const interval = setInterval(()=>{
			isCounting && setTimeLeft((timeLeft)=> timeLeft >= 1 ? timeLeft - 1 :0)
		}, 1000)
		
	},[isCounting])

	//код времени не мой кст :)


	client.nextTask = ({ answers, task, id }) => {
		console.debug("nextTask", answers, task, id);
		setGameInfo({ ...gameInfo, taskId: id})
		setAnswersInfo(answers);
		setTaskInfo(task);
	  };
 
	return(

 
		<Panel id={id}>

			<div>
			
			<Title level="2"  style={{ textAlign: 'right' }}>твои баллы: {count}</Title>
			<Title level="2" className='selectAnswer' style={{ textAlign: 'center' }}>Выбери правильный ответ:</Title>
			<div className='equationDiv'>
			{taskInfo&& <Title level="1" className='equation'>{taskInfo[0]}{taskInfo[2]}{taskInfo[1]}=<span className='equationMark'>?</span></Title>}
			</div>

	 
			<div style={{height: 30, marginTop: 12}} className='single-clock-div'>
					<Icon16ClockCircleFill width={16} height={16} className='multiplayer-title-return'
							fill='#99A2AD'
							style={{
								display:'inline-block', 
								paddingLeft:5,
								marginTop: 3
							}}
					/>
					<Title
					className='multiplayer-title-code'
					style={{
						display:'inline-block', 
						paddingLeft:5, 
						color: '#99A2AD',
						fontSize: 14}} ><span>{minutes}</span><span>:</span><span>{seconds}</span></Title>
					
			</div>
			
			
				<Div className='container'>

					{answersInfo&& answersInfo.map((value, index)=>{
						return(
						
						<Button 
						stretched 
						size="l" 
						sizeY='regular' 
						mode="neutral" 
						className='item'
						id={'button' + index} 
						key={index}
						onPointerDown={(e)=>{
							
							
						}} 
						onClick={()=>{
							//ExmpleGeneration(value, setCount, setAnswer, setEquation, equation, count)
							console.log(gameInfo)
							console.log('aaaaa')
							console.log(answersInfo)
							answerTask(gameInfo.roomId, gameInfo.userId, value, gameInfo.taskId)
							//setIsCounting(true)
						}} >
							{answersInfo[index]}
						</Button>
						

						
						)
						
						
					})}

				</Div>
				</div>
						
		</Panel>
	);
}



export default MultiplayerGame;
