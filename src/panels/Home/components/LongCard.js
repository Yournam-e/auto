import React from 'react'; 


import {Title, Button, Card, Div} from '@vkontakte/vkui';
import { Icon24Play, Icon24ClockOutline } from '@vkontakte/icons';

import '../Home.css';


const LongCard = ({go}) => {

	return(

		<div className='long-card-div-div'>

		
		<Card mode="shadow" className='long-card'>
				<div style={{minHeight: 141}}>
									
					<Icon24ClockOutline width={24} height={24} className='long-card-icon'/>
						<Div>
							<div>
								<Title className='long-card-title'>
									Попробуй 30-секундный режим
								</Title>
							</div>
							<div>
								<Title level="3" className='long-card-text'>
									Реши как можно больше задач за 30 секунд
								</Title>
							</div>
										
						</Div>

						<Button
							className='button-long'
							onClick={go}
							data-to='game'
							style={{
							backgroundColor:'#F4F9FF',
							color:'#1984FF',
							borderRadius:25
							}}
							before={<Icon24Play height={16} width={16} />}
							mode='accent'
							size='s'
							>Попробовать</Button>
										
								
				</div>
									
		</Card>
		</div>
	);

	}


export default LongCard;
