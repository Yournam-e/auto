import React, { useEffect, useState } from 'react';

import { Panel, Div, Avatar, Title, Button, Separator, List, Cell, ButtonGroup, PanelHeader, PanelHeaderButton, ScreenSpinner } from '@vkontakte/vkui';

import './Multiplayer.css';
import { Icon20Sync, Icon20QrCodeOutline, Icon24Cancel, Icon20DoorArrowRightOutline } from '@vkontakte/icons';

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
	setActivePanel,
	setAnswersInfo,
	setTaskInfo,
<<<<<<< HEAD
	connectType,setConnectType,
	setPopout,
	haveHash,
	themeColors
	
 }) => {
=======
	connectType, setConnectType,
	setPopout

}) => {
>>>>>>> ca7c792bbea3d6a8a045a11152e053bdcc669240

	const userId = useUserId()
	const [complexity, setComplexity] = useState("easy")


	client.gameStarted = ({ answers, task, id }) => {
		console.debug("gameStarted", answers, task, id);
		setTaskInfo(task)
		setAnswersInfo(answers)
		async function lol() {
			setGameInfo({ ...gameInfo, taskId: id })
		}
		lol()
		setActivePanel('multiplayerGame')
	};

	client.roomCreated = ({ roomId }) => {
		console.debug('room create' + roomId)
		joinRoom(roomId, userId)
		setJoinCode(roomId)
	};

	function joinToYourRoom(i) {


		axios.post(`https://showtime.app-dich.com/api/plus-plus/room${qsSign}`)
			.then(async function (response) {
				console.log(response.data.data)
				await setJoinCode(response.data.data)

				await setGameInfo({ ...gameInfo, roomId: response.data.data })
				if (firstStart) {
					connectRoom(qsSign, response.data.data);
				} else {
					joinRoom(response.data.data);

				}

				setFirstStart(false)

			})
			.catch(function (error) {
				console.warn(error);
			});






	}


	useEffect(() => {

		if(haveHash){
			setJoinCode(window.location.hash.slice(1))
			connectRoom(qsSign, window.location.hash.slice(1), userId);

		}else{
			joinToYourRoom()
		}
		

	}, []); 

	client.gameStarted = ({ answers, task, id }) => {
		console.debug("gameStarted", answers, task, id);
		setTaskInfo(task)
		setAnswersInfo(answers)
		async function lol() {
			setGameInfo({ ...gameInfo, taskId: id })
		}
		lol()
		setActivePanel('multiplayerGame')
	};







	return (
		<Panel id={id}>



			{connectType === 'join' &&
<<<<<<< HEAD
			<PanelHeader
			style={{backgroundColor: 'transparent' }}
				before={
					<PanelHeaderButton onClick={()=>{
						setConnectType('host')
						joinToYourRoom()
					}} >
					<Icon20DoorArrowRightOutline fill='#1A84FF' style={{marginLeft:25}}/>
					</PanelHeaderButton>
				}
				transparent={true}
				shadow={false}
				separator={false}
				  
=======
				<PanelHeader
					style={{ backgroundColor: 'transparent' }}
					before={
						<PanelHeaderButton onClick={() => {
							leaveRoom(joinCode)
							setConnectType('host')
							joinToYourRoom()
						}} >
							<Icon20DoorArrowRightOutline fill='#1A84FF' style={{ marginLeft: 25 }} />
						</PanelHeaderButton>
					}
					transparent={true}
					shadow={false}
					separator={false}

>>>>>>> ca7c792bbea3d6a8a045a11152e053bdcc669240
				>
				</PanelHeader>
			}



<<<<<<< HEAD
			<PanelHeader
			style={{backgroundColor: 'transparent' }} >
			
			</PanelHeader>


	
			<Div className='multiplayer-div' >
=======
			<Div className='multiplayer-div'>
>>>>>>> ca7c792bbea3d6a8a045a11152e053bdcc669240



				<div style={{ paddingLeft: 'auto', paddingRight: 'auto' }}>
					<Title
						className='multiplayer-title'
						style={{ textAlign: 'center' }}>
						{connectType === 'host' ? 'Пригласите друзей в лобби' : 'Лобби друга'}
					</Title>


					<div style={{ height: 30 }} className='multiplayer-title-div'>


						<Title
							className='multiplayer-title-code'
							style={{
								display: 'inline-block',
								paddingLeft: 5
							}} >
							{joinCode}
						</Title>


						<Icon20Sync className='multiplayer-title-return'
							fill='#1A84FF'
							onClick={async function () {
								await setPopout(<ScreenSpinner size='large' />)
<<<<<<< HEAD
								const promise = new Promise((resolve, reject) => {
									createRoom(userId, joinCode)
									
									resolve()
						
								})
					
								promise.then(result =>setPopout(null) )
=======
								leaveRoom(joinCode)
								const promise = new Promise((resolve, reject) => {
									const oldCode = joinCode
									createRoom(joinCode)

									resolve()

								})

								promise.then(result => setPopout(null))



>>>>>>> ca7c792bbea3d6a8a045a11152e053bdcc669240

							}}
							style={{
								display: 'inline-block',
								paddingLeft: 5,
								verticalAlign: 'middle'
							}} />


					</div>
					<div className='multiplayer-qr-button-div'>
						<Button
							className='multiplayer-qr-button'
<<<<<<< HEAD
							style={{backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
							color:'#1984FF'}}
							onClick={()=>{
=======
							style={{ backgroundColor: '#ECF1FA' }}
							onClick={() => {
>>>>>>> ca7c792bbea3d6a8a045a11152e053bdcc669240
								setActiveModal('inputCodeQR')
							}}
							before={<Icon20QrCodeOutline />}
							mode='secondary'>Поделиться QR</Button>
					</div>

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
								style={{ backgroundColor: '#ECF1FA' }}
								onClick={() => {
									setActiveModal('inputCode')
								}}

								mode='secondary'>Присоединиться по коду</Button>
						</div>
<<<<<<< HEAD

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
=======
					</div>}
>>>>>>> ca7c792bbea3d6a8a045a11152e053bdcc669240

				</div>




				<List style={{ marginTop: 16, marginBottom: 16 }}>
					{fetchedUser && [0, 1, 2, 3].map((item, index) => (
						<Cell
							key={index}
							mode={index === 0 ? false : 'removable' || playersList[index] ? false : 'removable'}
							before={playersList[index] ? <Avatar src={playersList[index].avatar} /> : <div className='noneUser' />}
							disabled={index === 0 ? true : false || playersList[index] ? false : true}
							after={index === 0 ? false : playersList[index] ? <Icon24Cancel fill='#99A2AD' /> : false}
						>
							{playersList[index] ? <Title level="3" weight="2" className='player-name-on'>{playersList[index].name}</Title> : <Title level="3" weight="3" className='player-name-off'>Пусто</Title>}
						</Cell>
					))}
				</List>

				<div className='multiplayer-play-group'>

					{connectType === 'host' && <Div>
						<ButtonGroup className='multiplayer-complexity-div' align='center' mode="horizontal" gap="space">
							<Button
								size="s"
								appearance="accent"
								mode="tertiary"
								gap='m'
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
								style={{color:complexity === 'hard' ?'#1984FF':'#99A2AD'}}
								className={complexity === 'hard' ? themeColors === 'light'? 'complexity-button-on-light':'complexity-button-on-dark' : 'complexity-button-off'}
								onClick={() => {
									setComplexity("hard")
								}}
							>
								Сложно
							</Button>
						</ButtonGroup>
					</Div>}

					<ButtonGroup gap="space" style={{ marginTop: 10 }} className='multiplayer-play-div'>
<<<<<<< HEAD
						<Button size="l" 
						className='multiplayer-play-button' appearance="accent"
						loading={connectType==='host'?false:true}
						disabled={connectType==='host'?false:true}
						style={{background:'#1A84FF'}}
						stretched
						onClick={()=>{
							startGame(joinCode, userId, complexity, playersId)
						}}>Играть</Button>
=======
						<Button size="s" className='multiplayer-play-button' appearance="accent"
							loading={connectType === 'host' ? false : true}
							disabled={connectType === 'host' ? false : true}
							onClick={() => {
								startGame(joinCode, complexity, playersId)
							}}>Играть</Button>
>>>>>>> ca7c792bbea3d6a8a045a11152e053bdcc669240
					</ButtonGroup>
				</div>




			</Div>


		</Panel>
	)


}



export default Multiplayer;
