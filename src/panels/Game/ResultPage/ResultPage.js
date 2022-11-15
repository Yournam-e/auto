import React, { useEffect, useState } from 'react';


import { 
	Panel,
	Avatar, 
	Button,
	Title, 
	Div,
	Cell,
	List,
	ButtonGroup,
	Text,
	ScreenSpinner
 } from '@vkontakte/vkui';


 import bridge from '@vkontakte/vk-bridge';

import Eyes from '../../../img/Eyes.png'

import { Icon56CheckCircleOutline, Icon24StoryOutline, Icon16Done } from '@vkontakte/icons';
import '../Game.css'
import axios from 'axios';
import { qsSign } from '../../../hooks/qs-sign'; 


const ResultPage = ({ id, go, count, answer, setPopout, setSingleType, setActivePanel }) => {

	const [lvlsInfo, setLvlsInfo] = useState(null)
	

	const [friendsIds, setFriendsIds] = useState(null) //id друзей юзера
	const [friendsResult, setFriendsResult] = useState() //результаты друзей

	const [tokenAvailability, setTokenAvailability] = useState(false)


	 

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


	function getIds(result){
		if(result === true){
			bridge.send('VKWebAppGetAuthToken', { 
				app_id: 51451320, 
				scope: 'friends,status'
				})
				.then((data) => { 
				  if (data.access_token) {
					bridge.send('VKWebAppCallAPIMethod', {
						method: 'friends.get',
						params: {
							user_ids: '743784474,743784479',
							v: '5.131',
							access_token: data.access_token
						}})
						.then((friendsData) => { 
							  if (friendsData.response) {
								console.log(friendsData.response)
								setFriendsIds(friendsData.response)
								setTokenAvailability(true)
								setPopout(false)
							  }
							})
						.catch((error) => {
							  // Ошибка
							console.log(error)
						});
					  }
					})
					.catch((error) => {
					  // Ошибка
						console.log(error)
					});
			
		}

	} ///получи id


	async function getFriendsAndCheck(){

		const promise = new Promise((resolve, reject) => {

			var params = window
			.location
			.search
			.replace('?','')
			.split('&')
			.reduce(
				function(p,e){
					var a = e.split('=');
					p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]); 
					return p;
				},
				{}
			)

			params.vk_access_token_settings.includes('friends')?resolve(true): resolve(false);
				
		  });
		  promise.then(result => result === true? getIds(result):setPopout(null))


		

		


	} //// получи друзей и чекай token'ы
	

	
	useEffect(()=>{
		
		

		if(friendsIds){
			axios.post(`https://showtime.app-dich.com/api/plus-plus/rating/friends${qsSign}`,{
			"ids": friendsIds.items
		  	})
			.then(async function (response) {
				console.log(response.data)
				setFriendsResult(response.data)
				
			})
			.catch(function (error) {
				console.warn(error);
			});
			console.log(friendsIds)


		}

	}, [friendsIds])




	 
	
	useEffect(()=>{
		
		checkToDelete()
		getFriendsAndCheck()

		axios.put(`https://showtime.app-dich.com/api/plus-plus/lvl${qsSign}`,{
			"id": answer.id,
			"lvlType": answer.lvlType,
			"answers": answer.answers,
		  })
		.then(async function (response) {
			console.log(response)
			
		})
		.catch(function (error) {
			console.warn(error);
		});
	}, [])

	return(

 
		<Panel id={id} className='resultPagePanel'>
			

			
			<Div className='check-circle-outline'>
				<div>
					<Icon56CheckCircleOutline fill="#1A84FF" style={{marginLeft: 'auto', marginRight: 'auto'}}/>
				</div>
				<div style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}>
					<Title className='result-task-title'>{count *12} задач</Title>
				</div>

				<div style={{marginLeft: 18, marginRight: 18, marginTop: 16}}>
					<Title className='result-task-text'>Неплохо! Поделись результатами с друзьями:</Title>
				</div>

				<div className='result-task-button-div' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}>
					<Button 
					className='result-task-button'
					style={{
						backgroundColor:'#F4F9FF',
						color:'#1984FF',
						borderRadius:25
						}}
					before={<Icon24StoryOutline height={16} width={16} />}
					mode='accent'
					size='l'
					>Поделиться в истории</Button>
				</div>

				{tokenAvailability === true && 
				<div>
					<div className='result-task-resTitle-div'>
						<Title className='result-task-resTitle'>Результаты друзей:</Title>
					</div>

					<List className='result-friendList' style={{marginTop:8}}>
						{friendsResult && friendsResult.data.map((item, idx) => (
							<Cell
								style={{marginLeft:28, marginRight:28}}
								key={idx}
								before={<div style={{width:100}}><Avatar size={56} className='friendsAvatar' src={item.user.avatar} /> <Title style={{ verticalAlign: 'middle'}} className='result-friend-position'>#{idx +1}</Title></div>} 
								>
								<div style={{height: 65,  marginLeft: 16}}>

									<Title style={{paddingBottom: 8,}}>{item.user.name}</Title>

									
									<Button className='friendsPoint'
										before={<Icon16Done />}
										style={{ 
										backgroundColor:'#F4F9FF',
										color:'#1984FF',
										borderRadius:25}}>{item.rightResults}</Button>
								</div>
							</Cell>
						
						))}
					</List>
				</div>}
				
				{tokenAvailability === false && 
				<div className='notFriend-div' style={{width: 440, marginRight: 'auto',  marginLeft: 'auto', marginTop: 24}}>
					<img className='eyes-photo' style={{marginTop: 16}} src={Eyes} width={44} height={44}></img>

					<Title level="3" style={{textAlign: 'center'}}>Тут никого нет</Title>

					<Text className='result-getFriend-text' style={{textAlign: 'center'}} >Разрешите доступ к списку друзей чтобы видеть их результаты</Text>
					
					<div className='result-task-button-div'>
					<Button 
					className='result-getFriend-button'
					onClick={()=>{
						setPopout(<ScreenSpinner size='large' />)
						getFriendsAndCheck()
					}}
					style={{
						backgroundColor:'#F4F9FF',
						color:'#1984FF',
						borderRadius:25,
						marginBottom: 24
						}}
					mode='accent'
					size='l'>Разрешить доступ</Button>
					</div>

				</div>}

				
				
			<div className='result-absolute-div'>

				<ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
					<div className="result-buttonRetry-div">
						<Button size="l" style={{
								backgroundColor:'#1A84FF',
								borderRadius:25
								}} 
								className="result-buttonGroup-retry"
								appearance="accent" 
								onClick={async function(e){
									await setSingleType('single30')
									await setActivePanel('temporaryGame')
									await checkToDelete()
									await setPopout(<ScreenSpinner size='large' />)
								}}
								stretched>
							Попробовать снова
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
				
			</Div>


			

			
			
						
		</Panel>
	);
}



export default ResultPage;
