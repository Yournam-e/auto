import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol, TabbarItem, Tabbar, Epic, Panel, ModalRoot  } from '@vkontakte/vkui';

import { Icon28Users3Outline, Icon28FavoriteOutline } from '@vkontakte/icons';

import '@vkontakte/vkui/dist/vkui.css';
import './img/Fonts.css';

import Home from './panels/Home/Home';
import Multiplayer from './panels/Multiplayer/Multiplayer';
import LvlGame from './panels/Game/LvlGame';
import ResultPage from './panels/Game/ResultPage/ResultPage';

import ModalInputCode from './modals/ModalInputCode/ModalInputCode'
import ModalQRCode from './modals/ModalQR/ModalQR';
import LvlResultPage from './panels/Game/ResultPage/LvlResultPage';
import MultiplayerGame from './panels/Multiplayer/MultiplayerGame';
import { client } from './sockets/receiver';
import MultiplayerResult from './panels/Multiplayer/mpResult/MultiplayerResult';
import LobbyForGuest from './panels/Multiplayer/LobbyForGuest/LobbyForGuest';
import TemporaryGame from './panels/Game/TemporaryGame';
import { qsSign } from './hooks/qs-sign';

const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [activePanel, setActivePanel] = useState('menu');
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [activeStory, setActiveStory] = useState("single");
	const [fetchedUser, setUser] = useState();
	const [activeModal, setActiveModal] = useState(false);

	const [themeColors, setThemeColors] = useState('light')


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
	const [firstStart, setFirstStart] = useState(true) //первый старт
	const [playersList, updatePlayersList] = useState([]); //информация о юзерах в лобби
	const [connectType, setConnectType] = useState('host')



	//single 
	const [singleType, setSingleType] = useState()
	const [localTask, setLocalTask] = useState([]) 

	const [timeFinish, setTimeFinish] = useState(0)

	const [ready, setReady] = useState(false)

	const [lvlNumber, setLvlNumber] = useState()

	const [completeLvl, setCompleteLvl] = useState()

	const [lvlResult, setLvlResult] = useState({
		"id": null,
		"lvlType": null,
		"answers": []
	  })

	const [answer, setAnswer]=useState({
		"id": null,
		"lvlType": null,
		"answers": []
	  }) //body содержащий ответы

	  const [lvlData, setLvlData] = useState()



	

	client.joinedRoom = ({ users }) => {
		console.debug("joinedRoom", users);
	
		users!==0? updatePlayersList(users): console.log('ok')

		users && users.map((item, index)=>{
			setPlayersId([])
			setPlayersId([...playersId, item.userId]);
		})

	  };

	  client.roomCreated = (roomId) =>{

		console.debug('room create' + roomId)
	  };
	  
	client.roomCreated = ({ roomId }) => {
		console.debug('room create' + roomId)
		setJoinCode(roomId)
	};


	  




	

	useEffect(() => {
 

		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme)

				if(data.scheme ==='vkcom_dark' || data.scheme === 'space_gray'){
					setThemeColors('dark')
				}
			}
		});

		 

		
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			await setUser(user)
			await setGameInfo({ ...gameInfo, userId: user.id})

			await console.log(user) 
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const onStoryChange = (e) => setActiveStory(e.currentTarget.dataset.story);


	const inputRef = useRef(null);

	const handleOpen = React.useCallback((id) => {
	  if (id === "inputCodeQR" && inputRef.current) {
		inputRef.current.focus();
	  }
	}, []);

	const modal = (
		<ModalRoot 
		onOpened={handleOpen}
		activeModal={activeModal} onClose={()=>{
			setActiveModal(null);
		}}>
		  <ModalInputCode 
		  id='inputCode' 
		  setActiveModal={setActiveModal} 
		  gameInfo={gameInfo} 
		  setGameInfo={setGameInfo}  
		  playersList={playersList}
		  setConnectType={setConnectType}
		  setJoinCode={setJoinCode} />
		  <ModalQRCode id='inputCodeQR' setActiveModal={setActiveModal} joinCode={joinCode}/>
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
											<Home 
											id='single' 
											go={go} 
											setActivePanel={setActivePanel}
											setPopout={setPopout}
											setSingleType={setSingleType}
											setLocalTask={setLocalTask} 
											setLvlData={setLvlData}
											lvlData={lvlData} 
											setLvlNumber={setLvlNumber}
											setReady={setReady}
											themeColors={themeColors} />
										</View>
										
										<View id="multiplayer" activePanel="multiplayer">
											<Multiplayer 
											setActivePanel={setActivePanel}
											id='multiplayer'
											go={go} 
											connectType={connectType}
											setPopout={setPopout} 
											fetchedUser={fetchedUser}
											gameInfo={gameInfo} setGameInfo={setGameInfo}
											setActiveModal={setActiveModal}
											playersId={playersId} setPlayersId={setPlayersId}
											joinCode={joinCode} setJoinCode={setJoinCode}
											firstStart={firstStart} setFirstStart={setFirstStart}
											playersList={playersList}
											setTaskInfo={setTaskInfo}
											setAnswersInfo={setAnswersInfo}
											setConnectType={setConnectType}/>
										</View>
									
									</Epic>
								</Panel>
								<Panel id='lvlGame'>
									<LvlGame 
									setCount={setCount} 
									count={count} 
									setActivePanel={setActivePanel} 
									setPopout={setPopout}
									singleType={singleType}
									setLvlData={setLvlData}
									lvlData={lvlData} 
									lvlNumber={lvlNumber}
									setLvlResult={setLvlResult}
									lvlResult={lvlResult}
									setCompleteLvl={setCompleteLvl}
									setTimeFinish={setTimeFinish}
									timeFinish={timeFinish} />
									
								</Panel>


								<TemporaryGame id='temporaryGame'
									setCount={setCount} 
									count={count} 
									setActivePanel={setActivePanel} 
									setPopout={setPopout}
									singleType={singleType} 
									setLocalTask={setLocalTask}
									localTask={localTask}
									answer={answer}
									setAnswer={setAnswer}/> 

								
								<ResultPage
								id='result'
								count={count}
								go={go}
								answer={answer} 
								setAnswer={setAnswer} 
								setPopout={setPopout}
								setSingleType={setSingleType}
								setActivePanel={setActivePanel}
								fetchedUser={fetchedUser}/>
								
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
								setMpGameResults={setMpGameResults}
								fetchedUser={fetchedUser}
								connectType={connectType}/>

								
								<LvlResultPage id='resultLvl'
								go={go}
								lvlResult={lvlResult}
								setPopout={setPopout}
								setTimeFinish={setTimeFinish}
								timeFinish={timeFinish} 
								setLvlNumber={setLvlNumber}
								lvlNumber={lvlNumber}
								setReady={setReady}
								setActivePanel={setActivePanel}/>
								

								<MultiplayerResult 
								id='multiplayerResult' 
								go={go} 
								mpGameResults={mpGameResults} 
								fetchedUser={fetchedUser}
								setActivePanel={setActivePanel}
								joinCode={joinCode} 
								setActiveStory={setActiveStory}
								setPlayersId={setPlayersId} 
								playersList={playersList} />

								<LobbyForGuest 
								id='lobbyForGuest'
								fetchedUser={fetchedUser}
								gameInfo={gameInfo} 
								setGameInfo={setGameInfo}
								setActiveModal={setActiveModal}
								joinCode={joinCode}
								setJoinCode={setJoinCode}
								firstStart={firstStart}
								setFirstStart={setFirstStart} 
								playersList={playersList}
								setTaskInfo={setTaskInfo}
								setAnswersInfo={setAnswersInfo}
								setActivePanel={setActivePanel}
								/>
								

								
								
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);


	
}


export default App;
