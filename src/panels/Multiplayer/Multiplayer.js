import React, { useEffect, useState } from 'react';

import { Panel, Div, Avatar, Title, Button, Separator, List, Cell, ButtonGroup } from '@vkontakte/vkui';

import './Multiplayer.css';
import { Icon20Sync, Icon20QrCodeOutline, Icon24CancelOutline } from '@vkontakte/icons';

import bridge from '@vkontakte/vk-bridge';

import { connectRoom, createRoom, startGame } from '../../sockets/game';
import { client } from '../../sockets/receiver';
import axios from 'axios';
import { useUserId } from '../../hooks/useUserId';
import { qsSign } from '../../hooks/qs-sign';


const Multiplayer = ({ id, go, fetchedUser, setActiveModal, setGameInfo, gameInfo}) => {

	const [joinCode, setJoinCode] = useState(null)

	const userId = useUserId()
	const [complexity, setComplexity] = useState(0)

	const [playersList, updatePlayersList] = React.useState([
	]);


	


	client.joinedRoom = ({ users }) => {
		console.debug("joinedRoom", users);
		users!==0? updatePlayersList(users): console.log('ok')
	  };


	useEffect(() => {
		

		axios.post(`https://showtime.app-dich.com/api/plus-plus/room${qsSign}`)
			.then(async function (response) {
				console.log(response.data.data)
				await setJoinCode(response.data.data)
				await connectRoom(qsSign, response.data.data, userId);
				await setGameInfo({ ...gameInfo, roomId: response.data.data})
				
				
			})
			.catch(function (error) {
				console.warn(error);
			});
	}, []);





	return (
		<Panel id={id}>

			<Div className='multiplayer-div'>
				<div style={{ paddingLeft: 'auto', paddingRight: 'auto' }}>
					<Title
						className='multiplayer-title'
						style={{ textAlign: 'center' }}>Пригласите друзей в лобби</Title>
					<div style={{ height: 30 }} className='multiplayer-title-div'>
						<Title
							className='multiplayer-title-code'
							style={{
								display: 'inline-block',
								paddingLeft: 5
							}} >{joinCode}</Title>
						<Icon20Sync className='multiplayer-title-return'
							fill='#1A84FF'
							style={{
								display: 'inline-block',
								paddingLeft: 5,
								verticalAlign: 'middle'
							}} />
					</div>
					<div className='multiplayer-qr-button-div'>
						<Button
							className='multiplayer-qr-button'
							style={{ backgroundColor: '#ECF1FA' }}
							onClick={()=>{
								setActiveModal('inputCodeQR')
							}}
							before={<Icon20QrCodeOutline />}
							mode='secondary'>Поделиться 1QR</Button>
					</div>

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
							onClick={()=>{
								setActiveModal('inputCode')
							}}

							mode='secondary'>Присоединиться по коду</Button>
					</div>

				</div>



				<List style={{ marginTop: 16, marginBottom: 16 }}>
					{fetchedUser && playersList.map((item, index) => (
						<Cell
							key={index}
							mode={index === 0 ? false : 'removable'}
							before={fetchedUser && index === 0 ? <Avatar src={fetchedUser.photo_200} /> : <Avatar src={item.avatar} />}
							disabled={index === 0 ? true : false}
						>
							{index === 0 ? `${fetchedUser.first_name} ${fetchedUser.last_name}` : playersList[index].name}
						</Cell>
					))}
				</List>

				<div className='multiplayer-play-group'>

					<Div >
						<ButtonGroup className='multiplayer-complexity-div' align='center' mode="horizontal" gap="space">
							<Button
								size="s"
								appearance="accent"
								mode="tertiary"
								gap='m'
								className={complexity === 0 ? 'complexity-button-on' : 'complexity-button-off'}
								onClick={() => {
									setComplexity(0)
								}}
							>
								Легко
							</Button>
							<Button
								size="s"
								appearance="accent"
								mode="tertiary"
								gap='m'
								className={complexity === 1 ? 'complexity-button-on' : 'complexity-button-off'}
								onClick={() => {
									setComplexity(1)
								}}
							>
								Средне
							</Button>
							<Button
								appearance="accent"
								mode="tertiary"
								gap='m'
								className={complexity === 2 ? 'complexity-button-on' : 'complexity-button-off'}
								onClick={() => {
									setComplexity(2)
								}}
							>
								Сложно
							</Button>
						</ButtonGroup>
					</Div>

					<ButtonGroup gap="space" style={{ marginTop: 10 }} className='multiplayer-play-div'>
						<Button size="s" className='multiplayer-play-button' appearance="accent"
						onClick={(e)=>{
							go(e)
							startGame(joinCode, 332056392, "easy", [332056392])
						}}
						data-to="multiplayerGame">Играть</Button>
					</ButtonGroup>
				</div>




			</Div>


		</Panel>
	)

	
}



export default Multiplayer;
