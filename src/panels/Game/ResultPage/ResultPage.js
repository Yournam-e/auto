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

 

import { createCanvas, loadImage } from 'canvas';
import { useUserId } from '../../../hooks/useUserId';

const ResultPage = ({ id, go, answer, setPopout, setSingleType, setActivePanel, fetchedUser,themeColors }) => {
	const url ='https://showtime.app-dich.com/api/plus-plus/'
	
	 

	const [lvlsInfo, setLvlsInfo] = useState(null)

	const [rightAns, setRightAns] = useState()


	const [right, setRight] = useState()
	

	const [friendsIds, setFriendsIds] = useState(null) //id друзей юзера
	const [friendsResult, setFriendsResult] = useState() //результаты друзей

	const [tokenAvailability, setTokenAvailability] = useState(false)

	
	const userID = useUserId()

	function decOfNum(number, titles, needNumber = true) {
		if (number !== undefined) {
			let decCache = [],
				decCases = [2, 0, 1, 1, 1, 2];
			if (!decCache[number]) decCache[number] = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)];
			return (needNumber ? number + ' ' : '') + titles[decCache[number]];
		}
	}



	function loadFonts(fonts = []) {
		for (const font of fonts) {
		const span = document.createElement('span');
		span.style.position = 'absolute';
		span.style.fontFamily = font;
		span.style.opacity = '0';
		span.innerText = '.';
		document.body.appendChild(span);
		span.onload = () => span.remove();
		}
	}


	async function showStoryBox(count){

		//await loadFonts()
		
		// параметры url
		function getUrlParams() {
			return window.location.search.length > 0 && JSON.parse('{"' + decodeURI(window.location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
		}
		
		const background = await loadImage(require(`../../../img/story/story.png`));
		const phrases = [
			decOfNum(count, ['Математическую задачу', 'Математические задачи', 'Математических задач']),
			' за ',
			'30 секунд!'
		];
		var canvas = createCanvas(background.width, background.height);
		const ctx = canvas.getContext('2d');
		
		ctx.drawImage(background, 0, 0);
		
		ctx.font = '700 189px Space Grotesk';
		ctx.fillStyle = '#1A84FF';
		ctx.textAlign = 'center';
		ctx.fillText(count, 540, 709 + 133);
		
		ctx.font = '500 63px Manrope';
		ctx.fillStyle = '#333333';
		ctx.textAlign = 'center';
		ctx.fillText(phrases[0], 540, 1032 + 52);
		
		const
			width1 = ctx.measureText(phrases[1] + phrases[2]).width,
			width2 = ctx.measureText(phrases[1]).width
		;
		ctx.textAlign = 'left';
		ctx.fillText(phrases[1], (background.width - width1) / 2, 1118 + 48);
		ctx.font = '800 63px Manrope';
		ctx.fillStyle = '#1A84FF';
		ctx.fillText(phrases[2], (background.width - width1) / 2 + width2, 1118 + 48);


		try{
			await bridge.send('VKWebAppShowStoryBox', {
				background_type: 'image',
				blob: canvas.toDataURL('image/png'),
				attachment: {
					url: `https://vk.com/app${getUrlParams().vk_app_id}`,
					text: 'go_to',
					type: 'url'
				}
			});
		}catch(e){
			setPopout(null)
		}

		setPopout(null)
	}


	 

	function checkToDelete(){
		lvlsInfo&&lvlsInfo.map((item, index)=>{

			console.log(item)
			console.log('Длина массива ' + lvlsInfo.length)
			
			console.log('Длина indexc ' + index)
			
			if(item.lvlType === 'single30'){
				axios.delete(`https://showtime.app-dich.com/api/plus-plus/lvl/${item.id}${qsSign}`)
				.then(async function (response) {
					console.log(response.data.data) 
					setPopout(null)
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
				scope: 'friends'
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
								setPopout(null)
							  }
							})
						.catch((error) => {
							  // Ошибка
							  setPopout(false)
						});
					  }
					})
					.catch((error) => {
					  // Ошибка
					 	 setPopout(false)
					});
			
		}

	} ///получи id друзей


	async function сheckFriends(){

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

			console.log( params.vk_access_token_settings.includes('friends'))

			if(params.vk_access_token_settings.includes('friends') === true){
				getIds(true)
			}
			 
		


		

		


	} //в useEffect


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

			params.vk_access_token_settings.includes('friends')?resolve(false): resolve(true);
				
		  });
		  promise.then(result => result === true? getIds(result):setPopout(null))


		

		


	} //// получи друзей и чекай token'ы (при нажатии)
	

	
	useEffect(()=>{
		if(friendsIds){
			axios.post(`https://showtime.app-dich.com/api/plus-plus/rating/friends${qsSign}`,{
			"ids": friendsIds.items
		  	})
			.then(async function (response) {
				console.log(response.data)
				setFriendsResult(response.data)
				for await (const item of response.data.data){
					if(item.user.userId === fetchedUser.id){
						setRightAns(item.rightResults)
						
					}
				}
				
			})
			.catch(function (error) {
				console.warn(error);
			});
			console.log(friendsIds)


		}

	}, [friendsIds])
	
	
	useEffect(()=>{ 
		сheckFriends()
		

		axios.put(`https://showtime.app-dich.com/api/plus-plus/lvl${qsSign}`,{
			"id": answer.id,
			"lvlType": answer.lvlType,
			"answers": answer.answers,
		  })
		.then(async function (response) {
			
			axios.get(`${url}info${qsSign}`) //получил инфу о лвлах
			.then(async function (res) {
				await setLvlsInfo(res.data.data)
				for await (const item of res.data.data){
					if(item.lvlType=== 'single30'){
						setRight(item.rightResults)
						
					}
				}
				await console.log(res.data.data)
				await setPopout(null)
			})
			.catch(function (error) {
				console.warn(error);
			});
			
		})
		.catch(function (error) {
			console.warn(error);
		});





	}, [])

	return(


		
 
		<Panel id={id} className='resultPagePanel'>
			<div style={{background: themeColors === 'light'?"#F7F7FA":"#1D1D20", height: window.pageYOffset}}>
			
			<Div className='check-circle-outline'>
				<div>
					<Icon56CheckCircleOutline fill="#1A84FF" style={{marginLeft: 'auto', marginRight: 'auto'}}/>
				</div>
				<div style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}>
					{<Title className='result-task-title'>{right?`${right} задач`:'0 задач'}</Title>}
					
				</div>

				<div style={{marginLeft: 18, marginRight: 18, marginTop: 16}}>
					<Title className='result-task-text'>Неплохо! Поделись результатами с друзьями:</Title>
				</div>

				<div className='result-task-button-div' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}>
					<Button 
					onClick={async function (){ 

						if(right){
							showStoryBox(right)
						}
						
						await setPopout(<ScreenSpinner size='large' />)
						
					}}
					className='result-task-button'
					style={{
						backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
						color:'#1984FF',
						borderRadius:25
						}}
					before={<Icon24StoryOutline height={16} width={16} />}
					mode='accent'
					size='l'
					>Поделиться в истории</Button>
				</div>
				<p className='hide'>content</p>
				{tokenAvailability === true && 
				<div>
					<div className='result-task-resTitle-div'>
						<Title className='result-task-resTitle'>Результаты друзей:</Title>
					</div>

					<List className='result-friendList' style={{marginTop:8}}>
						{friendsResult && friendsResult.data.map((item, idx) => (
							<Cell
								style={{marginLeft:5, marginRight:5}}
								key={idx}
								before={<div style={{width:100}}><Avatar size={56} className='friendsAvatar' src={item.user.avatar} /> <Title style={{ verticalAlign: 'middle'}} className='result-friend-position'>#{idx +1}</Title></div>} 
								>
								<div style={{height: 65,  marginLeft: 16}}>

									<Title level="3" style={{paddingBottom: 8,}}>{item.user.name}</Title>

									<Button className='friendsPoint'
										before={<Icon16Done />}
										hasActive={false}
										hasHover={false}
										style={{ 
										backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
										color:'#1984FF',
										borderRadius:25}}><p style={{textAlign: 'center'}}>{item.rightResults}</p>
									</Button>
								</div>
							</Cell>
						
						))}
					</List>
				</div>}
				
				{tokenAvailability === false  && 
				<div className='notFriend-div' style={{ marginRight: 'auto',  marginLeft: 'auto', marginTop: 24}} >
					<img className='eyes-photo' style={{marginTop: 16}} src={Eyes} width={44} height={44}></img>

					<Title level="3" style={{textAlign: 'center'}}>Тут никого нет</Title>

					<Text className='result-getFriend-text' style={{textAlign: 'center'}} >Разрешите доступ к списку друзей, чтобы видеть их результаты</Text>
					
					<div className='result-task-button-div'>
					<Button 
					className='result-getFriend-button'
					onClick={()=>{
						setPopout(<ScreenSpinner size='large' />)
						getFriendsAndCheck()
					}}
					style={{
						backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
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
								borderRadius:100
								}} 
								className="result-buttonGroup-retry"
								appearance="accent"
								onClick={async function(e){
									await setSingleType('single30')
									await setPopout(<ScreenSpinner size='large' />)
									await setActivePanel('temporaryGame')
									await checkToDelete()
								}}
								stretched>
							Попробовать снова
						</Button>
					</div>
					<div className="result-buttonNotNow-div" >
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


			</div>

			
			
						
		</Panel>
	);
}



export default ResultPage;
