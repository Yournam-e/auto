import React, { useEffect, useState } from 'react';


import { Card, Title, Text, Button, ScreenSpinner } from '@vkontakte/vkui';
import { Icon16Done, Icon24CheckCircleOutline, Icon28RecentOutline, Icon24Play } from '@vkontakte/icons';
import '../Home.css';
import { qsSign } from '../../../hooks/qs-sign';
import axios from 'axios';

import '../../../img/Fonts.css'

const LevelCard = ({number, lvlsInfo, setPopout, setActivePanel, setLvlNumber, setReady, themeColors}) => {

	 
	const [complete, setComplete] = useState(false)
		

	useEffect(()=>{

		console.log(lvlsInfo)
		
	}, [lvlsInfo])

	
	
	function devideType(){
		switch (number) {
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
	



	async function mapingLvls(){
		await setPopout(<ScreenSpinner size='large' />)

		
		const promise = new Promise((resolve, reject) => {

		 
				
				

				lvlsInfo&&lvlsInfo.map((item, index)=>{
					console.log('oook' + index)
					if(item.lvlType === devideType(number)){
						console.log("нашел")
						try{
							axios.delete(`https://showtime.app-dich.com/api/plus-plus/lvl/${item.id}${qsSign}`)
							.then(async function (response) {
								await setReady(true)
								console.log(response.data.data)
								console.log('удалил')
							})
							.catch(function () { 
							});
						}catch(e){
						}
						
					}
	
					
		
				})  
				resolve()
	
			})

		promise.then(result =>setPopout(<ScreenSpinner size='large' />), setActivePanel('lvlGame') )


		  };


	return(
        <div className='lvl-card-div'>
			<Card key ={number} mode="shadow" style={{borderRadius: 24}}>
				<div className='lvl-card'>
					
					<div style={{width: 60, height: 60}}>
						<Title level='1' className='lvl-card-title' style={{paddingLeft:16, paddingTop: 16,
						color:themeColors==='dark'?'#E1E3E6':'#000000',}}>#{number}</Title>
					</div>

					<div className='lvl-card-icon-div' style={{marginTop: -48}}>
						{complete &&<Icon16Done className='lvl-card-icon' style={{
							backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF'
						}}/>}
					</div>

					<div style={{paddingTop: 1}}>
						<div className='lvl-card-parametr-div' style={{width: 141, height: 30, paddingLeft: 16 }}>
							<Icon24CheckCircleOutline className='lvl-card-parametr-icon' style={{display:'inline-block'}} width={20} height={20} />
							<Text className='lvl-card-parametr-text' style={{display:'inline-block',
							verticalAlign: 'middle',
							paddingLeft:5}}>
								{lvlsInfo && devideLvl(number)[0]}
							</Text>
						</div>
						<div className='lvl-card-parametr-div' style={{width: 141, height: 30, paddingLeft: 16}}>
							<Icon28RecentOutline className='lvl-card-parametr-icon' style={{display:'inline-block'}} width={20} height={20} />
							<Text className='lvl-card-parametr-text' style={{display:'inline-block', verticalAlign: 'middle', paddingLeft:5}}>{lvlsInfo && devideLvl(number)[1]}</Text>
						</div>
					</div>

					<Button
						className='button-lvl'
						style={{
						backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
						color:'#1984FF',
						borderRadius:25
						}}
						onClick={async function(){
							await setLvlNumber(number)
							await mapingLvls()
						}}
						before={<Icon24Play height={16} width={16} />}
						mode='accent'
						size='s'
						>Играть</Button>
					
					
				</div>
			</Card>
		</div>
	);

	}


export default LevelCard;
