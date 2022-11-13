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
import { leaveRoom } from '../../../sockets/game';


const MultiplayerResult = ({ id, go, mpGameResults, fetchedUser, setActivePanel, joinCode }) => {

	var friendList = ['Адам', 'kek', 'cheb', 'lol', 'kek', 'cheb','lol', 'kek', 'cheb','lol', 'kek', 'cheb','lol', 'kek', 'cheb','lol', 'kek', 'cheb',]
	console.log(mpGameResults)

	return(

 
		<Panel id={id} className='resultPagePanel'>
			

			
			<Div  className='check-circle-outline'>
				<div style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}>

					<Title className='result-task-title'>Вы заняли <span style={{color: '#1984FF', paddingRight:5, paddingLeft:5}}>2-е</span>  место</Title>

				</div>

				<div style={{marginLeft: 18, marginRight: 18, marginTop: 16}}>

					{mpGameResults && fetchedUser && 
					<Title className='result-task-text'>Правильных ответов: {mpGameResults.players.map((value)=>{
                         if(value.userId === fetchedUser.id){
                            return value.rightResults
							}
						})}
					</Title>}

				</div> 

				<List className='result-friendList' style={{marginTop:20}}>

				{friendList.map((item, idx) => (
				
					<Cell
						style={{marginLeft:28, marginRight:28}}
						key={idx}
						before={<div style={{width:100}}><Avatar size={56} className='friendsAvatar' /> <Title style={{ verticalAlign: 'middle'}} className='result-friend-position'>#{idx +1}</Title></div>} 
						>

						<div style={{height: 65,  marginLeft: 16}}>
							<Title style={{paddingBottom: 8,}}>{item}</Title>
							<Button className='friendsPoint'
								before={<Icon16Done />}
								style={{ 
								backgroundColor:'#F4F9FF',
								color:'#1984FF',
								borderRadius:25}}>1</Button>
						</div>

					</Cell>
				
			))}
			</List>
				
			<div className='result-absolute-div'>

				<ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
					<div className="result-buttonRetry-div">
						<Button size="l" style={{
								backgroundColor:'#1A84FF',
								borderRadius:25
								}} className="result-buttonGroup-retry" appearance="accent" stretched>
							Сыграть снова
						</Button>
					</div>
					<div className="result-buttonNotNow-div">
						<Button 
							onClick={(e)=>{
								go(e)
								leaveRoom(joinCode, fetchedUser.id)
								setActivePanel('multiplayer')
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



export default MultiplayerResult;
