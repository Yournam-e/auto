import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, Alert, ConfigProvider, SplitLayout, SplitCol, TabbarItem, Tabbar, Epic, Panel, ModalRoot  } from '@vkontakte/vkui';

import { Icon28Users3Outline, Icon28FavoriteOutline } from '@vkontakte/icons';

import '@vkontakte/vkui/dist/vkui.css';
import './img/Fonts.css';
import Eyes from './img/Eyes.png'

import Home from './panels/Home/Home';
import Multiplayer from './panels/Multiplayer/Multiplayer';
import LvlGame from './panels/Game/LvlGame';
import ResultPage from './panels/Game/ResultPage/ResultPage';
import MessengerLobby from './panels/Messenger/MessengerLobby'

import ModalInputCode from './modals/ModalInputCode/ModalInputCode'
import ModalQRCode from './modals/ModalQR/ModalQR';
import LvlResultPage from './panels/Game/ResultPage/LvlResultPage';
import MultiplayerGame from './panels/Multiplayer/MultiplayerGame';
import { client } from './sockets/receiver';
import MultiplayerResult from './panels/Multiplayer/mpResult/MultiplayerResult';
import LobbyForGuest from './panels/Multiplayer/LobbyForGuest/LobbyForGuest';
import TemporaryGame from './panels/Game/TemporaryGame';
import NotConnection from './panels/NotConnection/NotConnection';
import searchToObject from './scripts/searchToObject'

import { useEventListener } from './scripts/useEventListener';
import eruda from '../node_modules/eruda/eruda.js';
import { useUserId } from './hooks/useUserId';

import axios from 'axios';
import { qsSign } from './hooks/qs-sign';
import { leaveRoom } from './sockets/game';

const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [activePanel, setActivePanel] = useState('menu');
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [activeStory, setActiveStory] = useState("single");
	const [fetchedUser, setUser] = useState();
	const [activeModal, setActiveModal] = useState(false);
	const [themeColors, setThemeColors] = useState('light')
	const [platform, setPlatform] = useState(null)


	const [count, setCount] = useState(0); //баллы
	
	//muliplayer
	const [gameInfo, setGameInfo] = useState({
		roomId: null,
		taskId: null
	});
	const [taskInfo, setTaskInfo] = useState(null); //данные о примере
	const [answersInfo, setAnswersInfo] = useState(); // ответы


	const [joinCode, setJoinCode] = useState(null) //код для подкл
	const [mpGameResults, setMpGameResults] = useState(); //массив для резуьтатов


	const [playersId, setPlayersId] = useState([]) //список id участников
	const [firstStart, setFirstStart] = useState(true) //первый старт
	const [playersList, updatePlayersList] = useState([]); //информация о юзерах в лобби
	const [connectType, setConnectType] = useState('host') //тип подключения, host или join
	const [itAgain, setAgain] = useState(false) //перезапуск игры или нет
	const [notAdd, setNotAdd] = useState(false)


	const [haveHash, setHaveHash] = useState(false)


	const [panelsHistory, setPanelsHistory] = useState([])



	//single 
	const [singleType, setSingleType] = useState()
	const [localTask, setLocalTask] = useState([]) 
	

	const [lvlsInfo, setLvlsInfo] = useState(null)

	const [timeFinish, setTimeFinish] = useState(0)

	const [ready, setReady] = useState(false)

	const [lvlNumber, setLvlNumber] = useState()

	const [completeLvl, setCompleteLvl] = useState()

	const [allTasks, setAllTasks] = useState([{}])

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
	  


	//переменные для мессенджера

	const [gameExists, setGameExists] = useState(false)



	useEventListener("offline", () => {
		setActivePanel('notConnection')
	})



	client.joinedRoom = ({ users }) => {
		async function joinFunction(){
			//await setPopout(<ScreenSpinner size='large' />)

			
			await users!==0? updatePlayersList(users): console.log('')

			await setPlayersId(null)



			const newArr = []
			for await (const item of users){
				//setPlayersId([...playersId, item.userId]);
				newArr.push(item.userId)
			}
			await setPlayersId(newArr)
			//setPopout(null)
		}

		joinFunction()

	};

 

	  

	  
	client.gameStarted = ({task, answers, id }) => {
		setTaskInfo(task)
		setAnswersInfo(answers)
		async function lol(){
			setGameInfo({ ...gameInfo, taskId: id})
		}
		lol()
		setActivePanel('multiplayerGame')
	};
	  
	useEffect(()=>{



	}, [themeColors])


	useEffect(()=>{
		setPanelsHistory([...panelsHistory, activePanel])
	}, [activePanel])


	useEffect(()=>{
	}, [timeFinish])

	

	useEffect(() => {

		

		const img = new Image();
		img.src = Eyes;

		
		window.addEventListener('popstate', (e) => {
			if(activeModal){
				setActiveModal(null)
			}
			
			if(e.state){
				
				if(e.state.activePanel === 'home'){
					setActivePanel('menu')
					setActiveStory('single')
				}
				if(e.state.activePanel === 'mp'){
					setActivePanel('menu')
					setActiveStory('multiplayer')
				}
				if(e.state.activePanel === 'mpGame'){
					async function notSave(){
						await setNotAdd(true)
						await setActivePanel('menu')
						setActiveStory('multiplayer')
					}
					notSave()
				}
				if(e.state.activePanel === 'r'){
					 
				}
			}
		
	});
		
		

		bridge.subscribe(({ detail: { type, data }}) => {
			 
			if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme)
				
				if(data.scheme ==='vkcom_dark' || data.scheme === 'space_gray'){
					setThemeColors('dark')
					bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#1D1D20"});
				}else{
					bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "#fff"});
					setThemeColors('light')
				}
			}
		});  


		

		

		 

		
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			await setUser(user)
			await setGameInfo({ ...gameInfo, userId: user.id})

			bridge.send('VKWebAppGetClientVersion')
			.then((data) => { 
				if (data.platform) {
					setPlatform(data.platform)
				}
			})
			.catch((error) => {
				// Ошибка
			});


		}
		fetchData();
		
		console.log()

		 

		if(searchToObject().vk_ref === 'im_attach_picker'){
			setActivePanel('menu')
			setActiveStory('multiplayer')
			console.log('1')
		}
		else if(searchToObject().vk_ref === 'im_app_action' && window.location.hash){
			async function startToHash(){ 
				await setGameInfo({ ...gameInfo, roomId: window.location.hash.slice(1)})
				await setHaveHash(true)
				await setConnectType('join')
				await setActivePanel('menu')
				await setActiveStory('multiplayer')
				console.log('12')
				
			}
			startToHash()
		}
		else if(!window.location.hash ||window.location.hash === '#'){
			setHaveHash(false)
		}else{
			async function startToHash(){ 
				await setGameInfo({ ...gameInfo, roomId: window.location.hash.slice(1)})
				await setHaveHash(true)
				await setConnectType('join')
				await setActiveStory('multiplayer')
				
			}
			startToHash()
		}


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
		  setJoinCode={setJoinCode}
		  platform={platform}
		  onOpened={handleOpen}
		  joinCode={joinCode}
		  setPopout={setPopout}/>
		  <ModalQRCode id='inputCodeQR' setActiveModal={setActiveModal} joinCode={joinCode} onOpened={handleOpen}/>
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
									<div style={{background: themeColors === 'light'?"#F7F7FA":"#1D1D20", height: window.pageYOffset}}>
										<Epic
											activeStory={activeStory}
											tabbar={
												<Tabbar>
													<TabbarItem 
														onClick={onStoryChange}
														selected={activeStory === "single"}
														data-story="single"
														text={<span style={{color: themeColors === 'light'?
														activeStory === "single"?'#2C2D2E':'#99A2AD':activeStory === "single"?'#C4C8CC':'#76787A'}}>Уровни</span>}>
															<Icon28FavoriteOutline style={{color: themeColors === 'light'?
														activeStory === "single"?'#2C2D2E':'#99A2AD':activeStory === "single"?'#C4C8CC':'#76787A'}} />
													</TabbarItem>
													<TabbarItem
														onClick={onStoryChange}
														selected={activeStory === "multiplayer"}
														data-story="multiplayer"
														text={<span style={{color: themeColors === 'light'?
														activeStory === "multiplayer"?'#2C2D2E':'#99A2AD':activeStory === "multiplayer"?'#C4C8CC':'#76787A'}}>Онлайн</span>}>
															<Icon28Users3Outline style={{color: themeColors === 'light'?
														activeStory === "multiplayer"?'#2C2D2E':'#99A2AD':activeStory === "multiplayer"?'#C4C8CC':'#76787A'}}/>
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
												themeColors={themeColors}
												setPanelsHistory={setPanelsHistory}
												activePanel={activePanel}
												panelsHistory={panelsHistory}
												lvlsInfo={lvlsInfo}
												setLvlsInfo={setLvlsInfo}
												gameExists={gameExists}
												setConnectType={setConnectType}
												setGameExists={setGameExists} />
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
												setConnectType={setConnectType}
												themeColors={themeColors}
												haveHash={haveHash}
												setPanelsHistory={setPanelsHistory}
												activePanel={activePanel}
												panelsHistory={panelsHistory}
												itAgain={itAgain}
												notAdd={notAdd}
												setGameExists={setGameExists}
												setActiveStory={setActiveStory}
												gameExists={gameExists}
												updatePlayersList={updatePlayersList}/>
											</View>
										
										</Epic>
									</div>
								</Panel>
								 
								<LvlGame 
								id='lvlGame'
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
									timeFinish={timeFinish}
									themeColors={themeColors}
									allTasks={allTasks}
									setAllTasks={setAllTasks}
									lvlsInfo={lvlsInfo}
									setReady={setReady}
									platform={platform} />


								<MessengerLobby
								setActivePanel={setActivePanel}
								id='messengerLobby'
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
								setConnectType={setConnectType}
								themeColors={themeColors}
								haveHash={haveHash}
								setPanelsHistory={setPanelsHistory}
								activePanel={activePanel}
								panelsHistory={panelsHistory}
								itAgain={itAgain}
								notAdd={notAdd}
								setActiveStory={setActiveStory}
								setGameExists={setGameExists}
								updatePlayersList={updatePlayersList}
								 />
									
								


								<TemporaryGame 
								id='temporaryGame'
								setCount={setCount} 
								count={count} 
								setActivePanel={setActivePanel} 
								setPopout={setPopout}
								singleType={singleType} 
								setLocalTask={setLocalTask}
								localTask={localTask}
								answer={answer}
								setAnswer={setAnswer}
								themeColors={themeColors}
								setActiveStory={setActiveStory}
								activeStory={activeStory}
								platform={platform}/> 

								
								<ResultPage
								id='result'
								count={count}
								go={go}
								answer={answer} 
								setAnswer={setAnswer} 
								setPopout={setPopout}
								setSingleType={setSingleType}
								setActivePanel={setActivePanel}
								fetchedUser={fetchedUser}
								themeColors={themeColors}/>
								
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
								connectType={connectType}
								themeColors={themeColors}
								setPopout={setPopout}
								joinCode={joinCode}
								setActiveStory={setActiveStory}
								platform={platform}/>

								
								<LvlResultPage id='resultLvl'
								go={go}
								lvlResult={lvlResult}
								setPopout={setPopout}
								setTimeFinish={setTimeFinish}
								timeFinish={timeFinish} 
								setLvlNumber={setLvlNumber}
								lvlNumber={lvlNumber}
								setReady={setReady}
								setActivePanel={setActivePanel}
								themeColors={themeColors}
								setAllTasks={setAllTasks}
								allTasks={allTasks}/>
								

								<MultiplayerResult 
								id='multiplayerResult' 
								go={go} 
								mpGameResults={mpGameResults} 
								fetchedUser={fetchedUser}
								setActivePanel={setActivePanel}
								joinCode={joinCode} 
								setActiveStory={setActiveStory}
								setPlayersId={setPlayersId} 
								playersList={playersList}
								themeColors={themeColors}
								setAgain={setAgain}
								connectType={connectType}
								setJoinCode={setJoinCode}
								setConnectType={setConnectType}
								setHaveHash={setHaveHash}/>

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
								themeColors={themeColors}
								platform={platform}/>

								<NotConnection 
								id='notConnection'
								go={go}
								themeColors={themeColors}
								setPopout={setPopout}
								setActivePanel={setActivePanel}
								setActiveStory={setActiveStory}
								Eyes={Eyes}/>
								

								
								
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);


	
}


export default App;
