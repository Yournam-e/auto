import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol, TabbarItem, Tabbar, Epic, Panel, ModalRoot  } from '@vkontakte/vkui';

import { Icon28Users3Outline, Icon28FavoriteOutline } from '@vkontakte/icons';

import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home/Home';
import Multiplayer from './panels/Multiplayer/Multiplayer';
import Game from './panels/Game/Game';
import ResultPage from './panels/Game/ResultPage/ResultPage';

import ModalInputCode from './modals/ModalInputCode/ModalInputCode'
import ModalQRCode from './modals/ModalQR/ModalQR';
import LvlResultPage from './panels/Game/ResultPage/LvlResultPage';
import MultiplayerGame from './panels/Multiplayer/MultiplayerGame';
import { client } from './sockets/receiver';
import MultiplayerResult from './panels/Multiplayer/mpResult/MultiplayerResult';

const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [activePanel, setActivePanel] = useState('resultLvl');
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [activeStory, setActiveStory] = useState("single");
	const [fetchedUser, setUser] = useState();
	const [activeModal, setActiveModal] = useState(false);


	const [count, setCount] = useState(0); //баллы


	//muliplayer
	const [gameInfo, setGameInfo] = useState({
		userId: null,
		roomId: null,
		taskId: null
	});

	const [taskInfo, setTaskInfo] = useState(); //данные о примере

	const [answersInfo, setAnswersInfo] = useState(); // ответы

	const [joinCode, setJoinCode] = useState(null) //код для подкл

	const [mpGameResults, setMpGameResults] = useState(); //массив для резуьтатов
	
	const [playersId, setPlayersId] = useState([]) //список id участников



	client.gameStarted = ({ answers, task, id }) => {
		console.debug("gameStarted", answers, task, id);
		setTaskInfo(task)
		setAnswersInfo(answers)
		async function lol(){
			setGameInfo({ ...gameInfo, taskId: id})
		}
		lol()
		setActivePanel('multiplayerGame')
	};

	

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme)
			}
		});

		 

		
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			await setUser(user)
			await setGameInfo({ ...gameInfo, userId: user.id})
			await console.log(user)
			await setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const onStoryChange = (e) => setActiveStory(e.currentTarget.dataset.story);

	const modal = (
		<ModalRoot activeModal={activeModal} onClose={()=>{
			setActiveModal(null);
		}}>
		  <ModalInputCode id= 'inputCode' setActiveModal={setActiveModal}/>
		  <ModalQRCode id='inputCodeQR' setActiveModal={setActiveModal}/>
		</ModalRoot>
	  );



	return (
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout} modal={modal}>
						<SplitCol>
							<View activePanel={activePanel}>
								<Panel id='menu'>

									<Epic
										activeStory={activeStory}
										tabbar={
											<Tabbar>
												<TabbarItem
													onClick={onStoryChange}
													selected={activeStory === "single"}
													data-story="single"
													text="Уровни">
														<Icon28FavoriteOutline />
												</TabbarItem>
												<TabbarItem
													onClick={onStoryChange}
													selected={activeStory === "multiplayer"}
													data-story="multiplayer"
													text="Онлайн">
														<Icon28Users3Outline />
												</TabbarItem>
											</Tabbar>
										
									}>

										<View id="single" activePanel="single">
											<Home id='single' go={go} setPopout={setPopout} />
										</View>
										
										<View id="multiplayer" activePanel="multiplayer">
											<Multiplayer 
											id='multiplayer'
											go={go} 
											setPopout={setPopout} 
											fetchedUser={fetchedUser}
											gameInfo={gameInfo} 
											setGameInfo={setGameInfo}
											setActiveModal={setActiveModal}
											playersId={playersId}
											setPlayersId={setPlayersId}
											joinCode={joinCode}
											setJoinCode={setJoinCode} />
										</View>
									
									</Epic>
								</Panel>
								<Panel id='game'>
									<Game 
									setCount={setCount} 
									count={count} 
									setActivePanel={setActivePanel} 
									setPopout={setPopout} />
									
								</Panel>
								<ResultPage id='result' count={count} go={go}/>
								
								<MultiplayerGame  
								id='multiplayerGame' 
								go={go} 
								gameInfo={gameInfo} 
								setGameInfo={setGameInfo}
								taskInfo={taskInfo}
								setTaskInfo={setTaskInfo}
								answersInfo={answersInfo}
								setAnswersInfo={setAnswersInfo}
								setActivePanel={setActivePanel}
								setMpGameResults={setMpGameResults}/>

								
								<LvlResultPage id='resultLvl' go={go}/>

								<MultiplayerResult 
								id='multiplayerResult' 
								go={go} 
								mpGameResults={mpGameResults} 
								fetchedUser={fetchedUser}
								joinCode={joinCode} 
								setActiveStory={setActiveStory}/>
								

								
								
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);


	
}


export default App;
