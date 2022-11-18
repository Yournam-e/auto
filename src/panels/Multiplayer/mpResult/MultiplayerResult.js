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

import { Icon56CheckCircleOutline, Icon24StoryOutline, Icon16Done } from '@vkontakte/icons';
import '../../Game/Game.css'
import { client } from '../../../sockets/receiver';
import { createRoom, leaveRoom } from '../../../sockets/game';
import { useUserId } from '../../../hooks/useUserId';


const MultiplayerResult = ({ id, go, mpGameResults, fetchedUser, setActivePanel, joinCode, playersList }) => {

	let friendList = null
	console.log(mpGameResults)

	console.log(playersList)

	const [place, setPlace] = useState(5)

	useEffect(() => {
		if (mpGameResults) {
			devideArray()
		}
	}, [mpGameResults])




	function devideArray() {

		const newArr = mpGameResults.players.sort((a, b) => a.rightResults > b.rightResults ? 1 : -1);
		console.log("ниже")
		console.log(newArr)

		newArr.map((item, index) => {
			console.log(item)
			console.log(fetchedUser.id)
			console.log(item.userId)
			console.log(index)
			if (item.userId === fetchedUser.id) {
				const f = index + 1
				console.log(f)
				setPlace(index)
			}

		})

	}


	const [timeLeft, setTimeLeft] = useState(10); //время

	useEffect(() => {
		timeLeft === 0 ? console.log('') : console.log()
	}, [timeLeft])


	if (mpGameResults) {
		friendList = mpGameResults.players.sort((a, b) => a.rightResults > b.rightResults ? 1 : -1);
	}



	useEffect(() => {


	}, [])

	return (


		<Panel id={id} className='resultPagePanel'>



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

						<Cell
							style={{ marginLeft: 28, marginRight: 28 }}
							key={idx}
							before={<div style={{ width: 100 }}><Avatar size={56} className='friendsAvatar' /> <Title style={{ verticalAlign: 'middle' }} className='result-friend-position'>#{idx + 1}</Title></div>}
						>

							<div style={{ height: 65, marginLeft: 16 }}>
								{mpGameResults && playersList.map((inItem, index) => {
									if (item.userId === inItem.userId) {
										return (
											<div key={inItem}>
												<Title style={{ paddingBottom: 8, }}>{inItem.name}</Title>
												<Button className='friendsPoint'
													before={<Icon16Done />}
													style={{
														backgroundColor: '#F4F9FF',
														color: '#1984FF',
														borderRadius: 25
													}}>{item.rightResults}</Button>
											</div>
										)
									}

								})}

							</div>

						</Cell>

					))}
				</List>

				<div className='result-absolute-div'>

					<ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
						<div className="result-buttonRetry-div">
							<Button size="l"
								onClick={() => {
									createRoom('wrl8Uw')

								}}
								style={{
									backgroundColor: '#1A84FF',
									borderRadius: 25
								}} className="result-buttonGroup-retry" appearance="accent" stretched>
								Сыграть снова
							</Button>
						</div>
						<div className="result-buttonNotNow-div">
							<Button
								onClick={(e) => {
									go(e)
									leaveRoom(joinCode, fetchedUser.id)
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







		</Panel>
	);
}



export default MultiplayerResult;
