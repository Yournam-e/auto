import React from 'react'; 


import { Card, Title, Text, Button } from '@vkontakte/vkui';
import { Icon16Done, Icon24CheckCircleOutline, Icon28RecentOutline, Icon24Play } from '@vkontakte/icons';
import '../Home.css';

const LevelCard = ({number}) => {



	return(
        <div className='lvl-card-div'>
			<Card key ={number} mode="shadow" style={{borderRadius: 24}}>
				<div className='lvl-card'>
					
					<div style={{width: 60, height: 60}}>
						<Title level='1' className='lvl-card-title' style={{paddingLeft:16, paddingTop: 16}}>#{number}</Title>
					</div>

					<div className='lvl-card-icon-div' style={{marginTop: -48}}>
						<Icon16Done className='lvl-card-icon'/>
					</div>

					<div style={{paddingTop: 1}}>
						<div className='lvl-card-parametr-div' style={{width: 141, height: 30, paddingLeft: 16 }}>
							<Icon24CheckCircleOutline className='lvl-card-parametr-icon' style={{display:'inline-block'}} width={20} height={20} />
							<Text className='lvl-card-parametr-text' style={{display:'inline-block', verticalAlign: 'middle', paddingLeft:5}}>10 задач</Text>
						</div>
						<div className='lvl-card-parametr-div' style={{width: 141, height: 30, paddingLeft: 16}}>
							<Icon28RecentOutline className='lvl-card-parametr-icon' style={{display:'inline-block'}} width={20} height={20} />
							<Text className='lvl-card-parametr-text' style={{display:'inline-block', verticalAlign: 'middle', paddingLeft:5}}>30 секунд</Text>
						</div>
					</div>

					<Button
						className='button-lvl'
						style={{
						backgroundColor:'#F4F9FF',
						color:'#1984FF',
						borderRadius:25
						}}
						before={<Icon24Play height={16} width={16} />}
						mode='accent'
						size='s'
						>Играть</Button>
					
					
				</div>
			</Card>
		</div>
	);

	}


export default LevelCard;
