import React, { useEffect, useState } from 'react';


import { Card, Title, Text, Button, ScreenSpinner } from '@vkontakte/vkui';
import { Icon16Done, Icon24CheckCircleOutline, Icon28RecentOutline, Icon24Play } from '@vkontakte/icons';
import '../Home.css';
import { qsSign } from '../../../hooks/qs-sign';
import axios from 'axios';

import '../../../img/Fonts.css'

const LevelCard = ({number, lvlsInfo, setPopout, setActivePanel, setLvlNumber, setReady, themeColors, devideLvl, completeLvls}) => {

	 
	const [cardsStyle, setCardsStyle] = useState(null)

	const [thisLvl, setThisLvl] = useState(null)

	function devideTypes(i){
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

	useEffect(()=>{
		try{
			let inf = lvlsInfo
			let searchTerm = devideType(number);
			let findedLevel = inf.find(lvl => lvl.lvlType === searchTerm)
			setThisLvl(findedLevel)
		}catch(e){
		}
	}, [lvlsInfo])



	

	useEffect(()=>{
		const pageWidth = document.documentElement.scrollWidth
		if(pageWidth>350){
			setCardsStyle('max')
		}else{
			setCardsStyle('min')
		}
		console.log(pageWidth)
	}, [])



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
        <div  className={cardsStyle&& cardsStyle === 'max'? 'lvl-card-div':'lvl-card-div-mini'}>
			<Card 
				className='home--level_card' 
				style={{
					backgroundColor:themeColors==='dark'?'#2C2C31':'#FFFFFF',
					borderRadius: 24}}
				key={number}>
				<div className='lvl-card'>
					
					<div style={{width: 60, height: 60}}>
						<Title level='1' className='lvl-card-title' style={{paddingLeft:16, paddingTop: 16,
						color:themeColors==='dark'?'#E1E3E6':'#000000',}}>#{number}</Title>
					</div>

					<div className='lvl-card-icon-div' style={{marginTop: -48}}>
						{thisLvl && thisLvl.rightResults === thisLvl.totalResults &&<Icon16Done className='lvl-card-icon' style={{
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
						className={thisLvl && thisLvl.rightResults === thisLvl.totalResults?'button-lvl-complete':'button-lvl'}
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
						>{thisLvl && thisLvl.rightResults === thisLvl.totalResults?'Перепройти':"Играть"}</Button>
					
					
				</div>
			</Card>
		</div>
	);

	}


export default LevelCard;
