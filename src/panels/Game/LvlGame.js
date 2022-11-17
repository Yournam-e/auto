import React, { useEffect, useState } from 'react';


import { 
	Panel,
	ScreenSpinner, 
	Button,
	Title, 
	Div
 } from '@vkontakte/vkui';

import './Game.css';  



import ExmpleGeneration from '../../scripts/ExmpleGeneration';
import { getPadTime } from '../../scripts/getPadTime';
import { Icon16ClockCircleFill } from '@vkontakte/icons';
import { qsSign } from '../../hooks/qs-sign';
import axios from 'axios';

const LvlGame = ({ id, go, count, setCount, setActivePanel, setPopout, lvlNumber, ready, setLvlResult, lvlResult, setTimeFinish }) => {
	
	 
	
	const [lvlData, setLvlData] = useState(false)

	const [equation, setEquation] = useState([2, 2, '+', 4]); //задача

	const [answer, setAnswer] = useState([3, 1, 2, 4]);//варианты ответов

	const [taskNumber, setTaskNumber] = useState(0)
	 
 

	const [first, setFirst] = useState(true)
	 
 
	const [timeLeft, setTimeLeft] = useState(60); //время
	const [isCounting, setIsCounting] = useState(false); //время
	

	const minutes = getPadTime(Math.floor(timeLeft/60)); //минуты

	const seconds = getPadTime(timeLeft - minutes * 60); //секунды


	useEffect(()=>{

		if(lvlData){
			console.log(lvlData.tasks[1])
		}

	}, [lvlData])






	
	function devideType(){
		switch (lvlNumber) {
			case 1:
				return 'one'
			case 2:
				return 'two'
			case 3:
				return 'three'
			case 4:
				return 'four'
			case 5:
				return 'five'
			case 6:
				return 'six'
			case 7:
				return 'seven'
			case 8:
				return 'eight'
			case 9:
				return 'nine'
			case 10:
				return 'ten'
		  }

	}


	function createLvl(){
        axios.post(`https://showtime.app-dich.com/api/plus-plus/lvl${qsSign}`, {
            "lvlType": devideType()
          })
        .then(async function (response) {
            console.log(response.data.data)
			setLvlData(response.data.data)
			setLvlResult({
                "id": response.data.data.id,
                "lvlType": devideType(),
                "answers": [],
              })
			setPopout(null)
        })
        .catch(function (error) {
            console.warn(error);
        });
    }





	useEffect(()=>{
		timeLeft === 0?setActivePanel('resultLvl'):console.log()
	}, [timeLeft])

	useEffect(()=>{
		if(ready === true){
			createLvl()
			
		}
		
	}, [ready])


	useEffect(()=>{



		if(lvlData){
			console.log(lvlData) 

		}

	}, [lvlData])

	useEffect(()=>{
		//createLvl()
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
	
 
	return(

 
		<Panel id={id}>

			<div>
				
			<Title level="2" className='selectAnswer' style={{ textAlign: 'center' }}>Выбери правильный ответ:</Title>
			<div className='equationDiv'>
			<Title level="1" className='equation'>
				{lvlData && lvlData.tasks[taskNumber].task[0]}
				{lvlData && lvlData.tasks[taskNumber].task[2]}
				{lvlData && lvlData.tasks[taskNumber].task[1]}
				{!lvlData && '1+2'}=<span className='equationMark'>?</span>
				
			</Title>
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

					{ [0,1,2,3].map((value, index)=>{
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
							if(first === true){
								setFirst(false)
								createLvl()
							}else{
								if(lvlData.tasks.length-1 === taskNumber ){
									setPopout(<ScreenSpinner size='large' />)
									setTimeFinish(Date.now() )
									console.log(Date.now() )
									setActivePanel('resultLvl') 
									console.log( 'emd' + taskNumber)
									console.log( 'emd' + lvlData.tasks.length)
								}else{ 
									setTaskNumber(taskNumber+1)
									console.log(taskNumber)
									console.log(lvlData.tasks.length)

									const newItem = {
										"id": lvlData.tasks[taskNumber].id,
										"answer": lvlData.tasks[taskNumber].answers[index]
									}

									const copy  = Object.assign({}, lvlResult);
									copy.answers = [...lvlResult.answers, newItem]
									setLvlResult(copy);
									console.log(lvlResult)

								}
							}
							
							setIsCounting(true)
						}} >
							{lvlData && lvlData.tasks[taskNumber].answers[index]}
							{!lvlData && value }
						</Button>
						

						
						)
						
						
					})}

				</Div>
				</div>
						
		</Panel>
	);
}



export default LvlGame;
