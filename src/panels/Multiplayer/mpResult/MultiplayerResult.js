import React, { useEffect, useState } from 'react';


import {
	Panel,
	Avatar,
	Button,
	Title,
	Div,
	Cell,
	List,
	ButtonGroup
} from '@vkontakte/vkui';

import { Icon56CheckCircleOutline, Icon24StoryOutline, Icon16Done, Icon16Spinner } from '@vkontakte/icons';
import '../../Game/Game.css'
import { client } from '../../../sockets/receiver';
import { createRoom, joinRoom, leaveRoom } from '../../../sockets/game';
import { useUserId } from '../../../hooks/useUserId';


const MultiplayerResult = ({ id, go,
	mpGameResults, fetchedUser, 
	setActivePanel, joinCode, 
	playersList,themeColors,
	setAgain, connectType,
	setJoinCode,setActiveStory,
	setConnectType,setPlayersId,
	setHaveHash }) => {

	//let friendList = null
	const [friendList, setFriendList] = useState(null)




	console.log(mpGameResults)

	console.log(playersList)

	const [place, setPlace] = useState(5)

	useEffect(() => {
		if (mpGameResults) {
			const newArr = mpGameResults.players.sort((a, b) => a.rightResults > b.rightResults ? -1 : 1);
			console.log(newArr)
			setFriendList(newArr)
		}

		console.log(friendList)


		
	}, [mpGameResults])


	useEffect(()=>{

		console.log(friendList)
		if (friendList) {
			devideArray()
		}

	}, [friendList])




	function devideArray() {


		friendList.map((item, index) => {
			if (item.userId === fetchedUser.id) {
				if(index !== 0){
					friendList[index - 1].rightResults > item.rightResults?setPlace(index):setPlace(index - 1)
				}else{
					setPlace(index)
				}
				console.log(friendList)
				console.log(index)
				
			}

		})

	}
 




	client.roomCreated = ({roomId}) =>{

		console.log('cоздана комната' + roomId)

		async function onRoomCreate (){
			await setHaveHash(false)
			await setAgain(true)
			await joinRoom(roomId)
			await setJoinCode(roomId)
			await setActivePanel('menu')
		}
		onRoomCreate()
		
	  };

	return (


		<Panel id={id} className='resultPagePanel'>

		<div style={{background: themeColors === 'light'?"#F7F7FA":"#1D1D20", height: window.pageYOffset}}>



			<Div className='check-circle-outline'>
				<div style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 16 }}>

					<Title className='result-task-title'>
						Вы заняли<span style={{ color: '#1984FF', paddingRight: 5, paddingLeft: 5 }}>{mpGameResults && place + 1} -e место!</span>
					</Title>

				</div>

				<div style={{ marginLeft: 18, marginRight: 18, marginTop: 16 }}>

					{mpGameResults && fetchedUser &&
						<Title className='result-task-text'>Правильных ответов: {mpGameResults.players.map((value) => {
							if (value.userId === fetchedUser.id) {
								return value.rightResults
							}
						})}
						</Title>}

				</div>

				<List className='result-friendList' style={{ marginTop: 20 }}>

					{friendList && friendList.map((item, idx) => (



							<div style={{ height: 65, marginLeft: 16, marginTop:25 }}>
								{mpGameResults && playersList.map((inItem, index) => {
									if (item.userId === inItem.userId) {
										return (
											<Cell
												style={{ marginLeft: 5, marginRight: 5 }}
												key={idx}
												before={<div style={{ width: 100 }}>
											<Avatar size={56} className='friendsAvatar' src={inItem.avatar} />
											<Title style={{ verticalAlign: 'middle' }} className='result-friend-position'>
												#{idx + 1}
											</Title></div>}
											>
											<div key={inItem}>
												<Title level="3" style={{ paddingBottom: 8, marginLeft:10}}>{inItem.name}</Title>
												<Button className='friendsPoint'
													before={<Icon16Done />}
													hasActive={false}
													hasHover={false}
													style={{ 
														backgroundColor:themeColors==='dark'?'#293950':'#F4F9FF',
														color:'#1984FF',
														borderRadius:25,
														marginLeft:10
													}}><p style={{textAlign: 'center'}}>{item.rightResults}</p></Button>
											</div>
											
											</Cell>
										)
									}

								})}

							</div>


					))}
				</List>

				<div className='result-absolute-div'>

					<ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
						{true &&
						<div className="result-buttonRetry-div">
						<Button size="l"
							onClick={() => {
								setPlayersId([])
								createRoom(joinCode)

							}}
							before={connectType==='host'?false:<div  className='loaderIcon'>
							<Icon16Spinner/>
							</div>}
							disabled={connectType === 'join'?true:false}
							style={{
								backgroundColor: '#1A84FF',
								borderRadius: 100
							}} className="result-buttonGroup-retry" appearance="accent" stretched>
							{connectType==='host'?'Сыграть снова':'Ожидание'}
						</Button>
					</div>}
						<div className="result-buttonNotNow-div" style={{paddingBottom:21}}>
							<Button
								onClick={(e) => {
									leaveRoom(joinCode, fetchedUser.id)
									setAgain(false)
									setActiveStory('single')
									setConnectType('host')
									go(e)
								}}
								data-to='menu'
								size="l"
								style={{
									borderRadius: 25,
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



export default MultiplayerResult;
