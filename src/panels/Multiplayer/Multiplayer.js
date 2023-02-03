import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom"

import { Panel, Div,
	Avatar, Title,
	Button, Separator,
	List, Cell,
	ButtonGroup,PanelHeader,
	PanelHeaderButton,ScreenSpinner,
	Alert } from '@vkontakte/vkui';

import './../Multiplayer/Multiplayer.css'; 
import { Icon20Sync, Icon20QrCodeOutline, Icon20MessageOutline,Icon20DoorArrowRightOutline, Icon28ArrowUturnLeftOutline, Icon24Play } from '@vkontakte/icons';

import bridge from '@vkontakte/vk-bridge';

import { connectRoom, createRoom, joinRoom, leaveRoom, startGame } from '../../sockets/game';
import { client } from '../../sockets/receiver';
import axios from 'axios';
import { useUserId } from '../../hooks/useUserId';
import { qsSign } from '../../hooks/qs-sign'; 


const Multiplayer = ({ 
	id,
	go,
	fetchedUser, 
	setActiveModal, 
	setGameInfo, gameInfo, 
	playersId,
	joinCode, setJoinCode,
	firstStart, setFirstStart,
	playersList,
	setActivePanel, activePanel,
	setAnswersInfo,
	setTaskInfo,
	connectType,setConnectType,
	setPopout,
	haveHash,
	themeColors,
	setPanelsHistory,
	setActiveStory,
	itAgain,
	notAdd,
	setGameExists,
	updatePlayersList,
	setPlayersId,
	platform
	
 }) => {

	const thisUserId = useUserId()
	const [complexity, setComplexity] = useState("easy")


	const [notUserRoom, setNotUserRoom] = useState(false)


	var clickTime = 0


	client.leftRoom = ({userId}) =>{
		if(userId && activePanel==='menu'){
			console.log('выходит ' + activePanel)
			console.log(playersList)
			updatePlayersList(playersList.splice(playersList.indexOf(userId), 1))
			updatePlayersList(playersList.filter(function(number) {
				return number !==userId;
			}))
			setPlayersId(playersId.filter(function(number) {
				return number !==userId;
			}))
			console.log(userId)
		}
	}


	client.gameStarted = ({ answers, task, id }) => {
		setTaskInfo(task)
		setAnswersInfo(answers)
		async function lol(){
			setGameInfo({ ...gameInfo, taskId: id})
		}
		lol()
		setNotUserRoom(false)
		setActivePanel('multiplayerGame')
	};

	client.roomCreated = ({ roomId }) => {
		joinRoom(roomId, thisUserId)
		setJoinCode(roomId)
		setNotUserRoom(false)
	};

	bridge.subscribe((e) => {
		if (e.detail.type === 'VKWebAppViewHide') {
		console.log('fgsajm')
		leaveRoom(fetchedUser.id)
		}
	});

	

	function joinToYourRoom(i){
		
			
		axios.post(`https://showtime.app-dich.com/api/plus-plus/room${qsSign}`)
		.then(async function (response) {
			await setJoinCode(response.data.data)
			
			await setGameInfo({ ...gameInfo, roomId: response.data.data})
			if(firstStart){
				await connectRoom(qsSign, response.data.data, thisUserId);
			}else{
				await joinRoom(response.data.data, thisUserId);
				setNotUserRoom(false)

			}
			
			setFirstStart(false)
			
		})
		.catch(function (error) {
		});

		

		


	}


	useEffect(() => {
		console.log(window.location.href)
		
		axios.get(`https://showtime.app-dich.com/api/plus-plus/user-games${qsSign}`)
		.then(async function (response) {
			await response
			console.log(response.data.data[0])
			console.log(response.data.data[0].roomId ) 
			console.log( window.location.hash.slice(1))
			if(response.data.data[0].ownerId === useUserId ){
				if(response.data.data[0].started){
					setActivePanel('menu')
					setActiveStory('single')
					setGameExists(true)
					
				}
			}
			if(response.data.data[0].roomId  === window.location.hash.slice(1)){
				console.log('asf')
				if(response.data.data[0].started){
					setActivePanel('menu')
					setActiveStory('single')
					setGameExists(true)
					
				}
			} 
			
		})
		.catch(function (error) {
			console.log(error)
		});
		if(notAdd === false){
			window.history.pushState({activePanel: 'mp'}, 'mp');  
		}

		
		if(haveHash){
			axios.post(`https://showtime.app-dich.com/api/plus-plus/room${qsSign}`)
			.then(async function (response) {
				await setJoinCode(response.data.data)
				
				await setGameInfo({ ...gameInfo, roomId: response.data.data})
					if(window.location.hash.slice(1) === response.data.data){
						await setConnectType('host')
						await setJoinCode(window.location.hash.slice(1))
						await connectRoom(qsSign, window.location.hash.slice(1), thisUserId);
					}else{
						setJoinCode(window.location.hash.slice(1))
						connectRoom(qsSign, window.location.hash.slice(1), thisUserId);
						setNotUserRoom(true)
					}
				
				setFirstStart(false)
				
			})
			.catch(function (error) {
		});
			

		}else if(itAgain){
			
			setGameInfo({ ...gameInfo, roomId: joinCode})
		}
		else{
			joinToYourRoom()
		}
		

	}, []); 

	client.gameStarted = ({ answers, task, id }) => {
		setTaskInfo(task)
		setAnswersInfo(answers)
		async function lol(){
			await setGameInfo({taskId: id, roomId: joinCode})
		}
		lol()
		setActivePanel('multiplayerGame')
	};





	useEffect(()=>{
		if(connectType === 'join' &&playersList.length===1 && notUserRoom){
			setPopout(
				<Alert
				  actions={[
					{
					  title: "Создать",
					  mode: "destructive",
					  autoclose: true,
					  action: () => {
						setConnectType('host')
						joinToYourRoom()
						leaveRoom(fetchedUser.id)
						setPopout(null) 
						useHistory().pushState("", document.title, window.location.pathname);

					  },
					},
				  ]}
				  actionsLayout="vertical"
				  onClose={()=>{
					setConnectType('host')
					joinToYourRoom()
					leaveRoom(fetchedUser.id)
					setPopout(null)
				  }}
				  header="Лобби не существует"
				  text="Создать свою комнату?"
				/>
			  );
		}
	}, [playersList])
	


	return (
		<Panel id={id}>

		

			{connectType === 'join' &&
			<PanelHeader
			style={{backgroundColor: 'transparent' }}
				transparent={true}
				shadow={false}
				separator={false}
				>
			</PanelHeader>
			}


			{connectType === 'host' &&
			<PanelHeader
			style={{backgroundColor: 'transparent' }}
				transparent={true}
				shadow={false}
				separator={false} 
				>
			</PanelHeader>
			}

	
			<Div className='multiplayer-div' >

				
			
				<div style={{ paddingLeft: 'auto', paddingRight: 'auto' }}>
					<Title
						className='multiplayer-title'
						style={{ textAlign: 'center' }}>
							{connectType === 'host'?'Пригласите друга в лобби':'Лобби друга'}
					</Title>

					
					<div style={{ height: 30 }} className='multiplayer-title-div'>


						<Title
							className='multiplayer-title-code'
							style={{
								display: 'inline-block',
								paddingLeft: 5
							}}
							onMouseDown={()=>{
								clickTime = Date.now()
							}}
							onMouseUp={()=>{
								if(Date.now() - clickTime >499){
									navigator.clipboard.writeText(joinCode)
									.then(() => { alert(`Copied!`) })
									.catch((error) => {  })
								}
							}} >
								{joinCode}
						</Title>

						{connectType === 'host' &&<Icon20Sync className='multiplayer-title-return'
							fill='#1A84FF'
							onClick={async function(){
								//await setPopout(<ScreenSpinner size='large' />)
								await createRoom(joinCode)
								
								
							}}
							style={{
								display: 'inline-block',
								paddingLeft: 5,
								verticalAlign: 'middle'
						}} />
}
						

					</div>
					{platform === 'mobile-web'?
					<div className='multiplayer-qr-button-div'>
						<Button
							className='multiplayer-qr-button'
							style={{backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
							color:'#1984FF'}}
							onClick={()=>{
								setActiveModal('inputCodeQR')
							}}
							before={<Icon20QrCodeOutline />}
							mode='secondary'>Поделиться QR</Button>
					</div>
					:
					<div className='multiplayer-qr-button-div'>
						<Button
							className='multiplayer-qr-button'
							style={{backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
							color:'#1984FF'}}
							onClick={()=>{ 
								bridge.send("VKWebAppAddToChat", {
                                    action_title: 'Присоединиться к лобби',
									hash: joinCode
                                }).then((data) => { 
                                    console.log(data)
                                })
                                .catch((error) => { 
										if(error.type === 'access_denied '){
											setPopout(
												<Alert
												  actions={[
													{
													  title: "Поделиться",
													  mode: "destructive",
													  autoclose: true,
													  action: () => {
														setPopout(null)
														bridge.send('VKWebAppShare', {
														  link: `https://vk.com/app51451320#${joinCode}`
														  })
														  .then((data) => { 
															if (data.result) {
															  setActiveModal(null)
															}
														  })
														  .catch((error) => {
															// Ошибка
															console.log(error);
														  }); 
													  },
													},
													{
														title: "Потом",
														mode: "cancel",
														autoclose: true,
														action: () => {
														  setPopout(null)
														  bridge.send('VKWebAppShare', {
															link: `https://vk.com/app51451320#${joinCode}`
															})
															.then((data) => { 
															  if (data.result) {
																setActiveModal(null)
															  }
															})
															.catch((error) => {
															  // Ошибка
															  console.log(error);
															}); 
														},
													  },
												  ]}
												  actionsLayout="vertical"
												  header="Временно недоступно"
												  text="Попробуйте поделиться ссылкой"
												/>
											  );
										}
                                });
							}}
							before={<Icon20MessageOutline width={22} height={22}/>}
							mode='secondary'>Пригласить чат</Button>
                            <Button
							className='multiplayer-qr-button-messenger'
							style={{backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
							color:'#1984FF',
                            marginLeft:8 }}
							onClick={()=>{
								setActiveModal('inputCodeQR')
							}}
							before={<Icon20QrCodeOutline />}
							mode='secondary'>QR</Button>
					</div>}

					{connectType === 'host' && <div>
					<div className='multiplayer-separator-div'>
						<div className='separator-left'>
							<Separator />
						</div>

						<div style={{ marginTop: -8 }}>
							<Title className='title-or'>или</Title>
						</div>

						<div className='separator-right'>
							<Separator />
						</div>
					</div>

					<div className='multiplayer-qr-button-div'>
						<Button
							className='multiplayer-code-button'
							style={{backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
							color:'#1984FF'}}
							onClick={()=>{
								setActiveModal('inputCode')
							}} 
							mode='secondary'>Присоединиться по коду</Button>
					</div>
						</div>}

				</div>

				


				<List style={{ marginTop: 16, marginBottom: 16 }}>
					{fetchedUser && [0,1,2,3].map((item, index) => (
						<Cell
							key={index} 
							before={playersList[index]?<Avatar src={playersList[index].avatar} />:<div style={{borderColor:themeColors === 'light'?'#E3E3E6':'#38383B'}} className='noneUser' />  }
							disabled={index === 0 ? true : false || playersList[index]?false:true}
						>
							{playersList[index]? <Title level="3" weight="2" className='player-name-on'>{playersList[index].name}</Title> : <Title level="3" weight="3" className='player-name-off'>Пусто</Title>}
						</Cell>
					))}
				</List>

				<div className='multiplayer-play-group'>

					{connectType === 'host' &&<Div>
						<ButtonGroup stretched className='multiplayer-complexity-div' align='center' mode="horizontal" gap="space">
							<Button
								size="s"
								appearance="accent"
								mode="tertiary"
								gap='m'
								stretched
								style={{color:complexity === 'easy' ?'#1984FF':'#99A2AD'}}
								className={complexity === 'easy' ? themeColors === 'light'? 'complexity-button-on-light':'complexity-button-on-dark' : 'complexity-button-off'}
								onClick={() => {
									setComplexity("easy")
								}}
							>
								Легко
							</Button>
							<Button
								size="s"
								appearance="accent"
								mode="tertiary"
								gap='m'
								stretched
								style={{color:complexity === 'mid' ?'#1984FF':'#99A2AD'}}
								className={complexity === 'mid' ? themeColors === 'light'? 'complexity-button-on-light':'complexity-button-on-dark' : 'complexity-button-off'}
								onClick={() => {
									setComplexity("mid")
								}}
							>
								Средне
							</Button>
							<Button
								appearance="accent"
								mode="tertiary"
								gap='m'
								stretched
								style={{color:complexity === 'hard' ?'#1984FF':'#99A2AD'}}
								className={complexity === 'hard' ? themeColors === 'light'? 'complexity-button-on-light':'complexity-button-on-dark' : 'complexity-button-off'}
								onClick={() => {
									setComplexity("hard")
								}}
							>Сложно
							</Button>
						</ButtonGroup>
					</Div>}
					<ButtonGroup gap="space" style={{ marginTop: 10 }} className='multiplayer-play-div'>
						<Button size="l" 
						className='multiplayer-play-button' appearance="accent" 
						style={{
							background:connectType==='host'?'#1A84FF':'#EBF1FA',
							color: connectType==='host'?'#fff':'#1A84FF'}}
						before={connectType==='host'?<Icon24Play />:<div>
							<Icon28ArrowUturnLeftOutline/>
						</div>}
						stretched
						onClick={()=>{
							if(connectType === 'join'){
								setConnectType('host')
								joinToYourRoom()
								leaveRoom(fetchedUser.id)
							}else{
								startGame(joinCode, complexity, playersId)
							}

						}}>{connectType==='host'?'Играть':'Выйти'}</Button>
					</ButtonGroup>
				</div>




			</Div>


		</Panel>
	)

	
}



export default Multiplayer;
