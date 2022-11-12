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
 import '../Game.css'


const ResultPage = ({ id, go, count }) => {

	var friendList = ['Адам', 'kek', 'cheb', 'lol', 'kek', 'cheb','lol', 'kek', 'cheb','lol', 'kek', 'cheb','lol', 'kek', 'cheb','lol', 'kek', 'cheb',]
	

	return(

 
		<Panel id={id} className='resultPagePanel'>
			

			
			<Div  className='check-circle-outline'>
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

				<div className='result-task-resTitle-div'>
					<Title className='result-task-resTitle'>Результаты друзей:</Title>
				</div>

				<List className='result-friendList' style={{marginTop:8}}>
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
