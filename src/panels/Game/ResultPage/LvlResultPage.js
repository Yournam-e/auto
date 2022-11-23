import React, { useEffect, useState } from 'react';


import { 
	Panel,
	Avatar, 
	Button,
	Title, 
	Div,
	Cell,
	List,
	ButtonGroup,
    ScreenSpinner
 } from '@vkontakte/vkui';
import { Icon56CheckCircleOutline, 
    Icon56CancelCircleOutline, 
    Icon20ArrowRightOutline, 
    Icon16ClockCircleFill, 
    Icon24RefreshOutline,
    Icon24DoneOutline,
    Icon24CancelOutline,
    Icon20Cancel } from '@vkontakte/icons';
import './LvlResultPage.css'
import { qsSign } from '../../../hooks/qs-sign';
import axios from 'axios';
import { ReactComponent as ClockIcon } from  '../../../img/Сlock.svg';

 
const LvlResultPage = ({ id, go,
    count, lvlResult, 
    setPopout, lvlNumber, 
    timeFinish,setLvlNumber, 
    setActivePanel,setReady, 
    themeColors, allTasks,
    setAllTasks }) => {

	const url ='https://showtime.app-dich.com/api/plus-plus/'
     

    const [complete, setComplete] = useState()

    const [finishedTime, setFinishedTime] = useState()


    let findArr = false

    	
	function devideType(i){
		switch (i) {
			case 1:
				return 'one'
			case 2:
				return 'two'
			case 3:
				return 'three'
			case 4:
				return 'four'
			case 5:
				return 'five'
			case 6:
				return 'six'
			case 7:
				return 'seven'
			case 8:
				return 'eight'
			case 9:
				return 'nine'
			case 10:
				return 'ten'
		  }

	} 

    function playNext(){
        const url ='https://showtime.app-dich.com/api/plus-plus/'
         
            axios.get(`${url}info${qsSign}`) //получил инфу о лвлах
            .then(async function (response) {
                const lvls = await response.data.data 
                await setPopout(null)


                const promise = new Promise((resolve, reject) => {

                
                    async function deleted(){
                        
                        for await (const item of lvls){
                            
                            if(item.lvlType === devideType(complete[0]?lvlNumber+1:lvlNumber)){ 
                                try{

                                axios.delete(`https://showtime.app-dich.com/api/plus-plus/lvl/${item.id}${qsSign}`)
                                    .then(async function (response) {
                                        await setReady(true)
                                        await resolve()
                                    
                                    
                                    })

                                .catch(function () { 

                                    });

                                }catch(e){


                                }
                                
                            }

                            complete[0]?setLvlNumber(lvlNumber +1):setLvlNumber(lvlNumber)

                            resolve()
                        } 

                    }

                    deleted()
                


                
        
                })
    
            promise.then(result =>setPopout(<ScreenSpinner size='large' />), setActivePanel('lvlGame') )
    
    
            })
            .catch(function (error) {
                console.warn(error);
            });
    
    
      
    
    }

    

    useEffect(()=>{
        setReady(false)

        console.log(allTasks)

        
        axios.put(`https://showtime.app-dich.com/api/plus-plus/lvl${qsSign}`,{
            "id": lvlResult.id,
            "lvlType": lvlResult.lvlType,
            "answers": lvlResult.answers,
          })
        .then(async function (response) {
            console.log(response)
            axios.get(`${url}info${qsSign}`) //получил инфу о лвлах
            .then(async function (response) { 
                await console.log(response.data.data)
                let items = response.data.data
                let searchTerm = lvlResult.lvlType;
                let rightResults = items.find(one => one.lvlType === searchTerm).rightResults
                let timeStarted = items.find(one => one.lvlType === searchTerm).started
                console.log(rightResults);
                
                console.log(timeStarted)  
                const timeMs = timeFinish - new Date(timeStarted).getTime()
                setFinishedTime(timeMs/1000)
                if(rightResults> lvlResult.answers.length-1){
                    if(timeFinish - new Date(timeStarted).getTime()< 30000){
                        await setComplete([true, 'right'])
                        await setPopout(null); 
                    }else{
                        await setComplete([false, 'beOnTime'])
                        await setPopout(null); 
                    }
                }else{
                    await setComplete([false, 'notright'])
                    await setPopout(null); 
                }
            })
            .catch(function (error) {
                console.warn(error);
            });
            
        })
        .catch(function (error) {
            console.warn(error);
        });
    
    }, [])

	
	return( 
		<Panel id={id}>

 

        <div style={{background: themeColors === 'light'?"#F7F7FA":"#1D1D20", height: window.pageYOffset}}>

            <div className='main-div-resilt-page'>
            <div className='lvl-res-headDiv'>
                {complete&& complete[0]?<Icon56CheckCircleOutline 
                fill="#1A84FF" 
                style={{
                    marginLeft: 'auto', 
                    marginRight: 'auto'
                }}/>
                :<Icon56CancelCircleOutline 
                        fill="#1A84FF" 
                        style={{
                            marginLeft: 'auto', 
                            marginRight: 'auto'
                            }}
                        />}

                <Title className='lvl-res-title-div' style={{color:themeColors === 'light'?'':'#fff'}}>Уровень {complete&& complete[0]?'пройден!':'провален'}</Title>
                
                {complete && complete[0] && <Title  className='lvl-res-sub-title-div' weight="1" >Неплохо!</Title>}
                {complete && complete[1] === "beOnTime" && <Title  className='lvl-res-sub-title-div' weight="1" >Вы не успели</Title>}
                <div className="not-right-button" >

                {complete&& !complete[0] &&  <Button 
                    before={<Icon20Cancel fill='#FF2525'/>} 
                    style={{
                    backgroundColor:themeColors === "light"? "#F7ECEF":"#3F1E21", 
                    color:"#FF2525",
                    padding:10,
                    borderRadius:50}}
                    hasActive={false}
                    hasHover={false}
                    >Вы ошиблись</Button>}
                
                </div>

                <div style={{height: 30, marginTop: 12}} className='lvl-res-clock-div'>
                    
					<ClockIcon 
                        className='multiplayer-title-return'
                        width={16} height={16}
						fill='#99A2AD'
						style={{
							display:'inline-block', 
							paddingLeft:5,
							marginTop: 5
						}}
					/>
					<Title
                        style={{
                            display:'inline-block', 
                            paddingLeft:5, 
                            color: '#99A2AD',
                            fontSize: 14
                            }}
                    >{finishedTime && Math.round(finishedTime)} сек</Title>
					
			    </div>	
                                
                <List className='all-task-list'>
                    {allTasks && allTasks.map((item, idx) =>{
                        if(item.id){
                            return(
                                <Cell
                                className='all-task-cell'
                                key={idx}
                                before={<div style={{width: 44, height: 44, paddingRight:20}}>
                                    {item.complete?
                                        <Icon24DoneOutline
                                        fill='#2BD328'
                                        className='lvl-res-list-icon'
                                        style={{backgroundColor:'#EDF5F0'}}/>
                                        :
                                        <Icon24CancelOutline
                                        fill='#FF2525'
                                        className='lvl-res-list-icon'
                                        style={{backgroundColor:'#F7ECEF'}}/>}
                                </div>}
                                subtitle={'Твой ответ: ' + item.answer}
                                
                                >
                                
                                <Title level='2'className='inCell'>{item.number1}{item.sign}{item.number3}={item.pcAnswer}</Title>
                                </Cell>
                            )
                        }
                        
                    })}
                </List>
            </div>

                            
            </div>





    




            <div className='lvl-res-absolute-div'>
                <ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
                    <div className="result-buttonRetry-div">
                        <Button size="l" 
                                onClick={()=>{
                                    async function deleteAndStart(){
                                        await setAllTasks([{}])
                                        playNext()
                                    }
                                    deleteAndStart()
                                }}
                                style={{
                                backgroundColor:'#1A84FF',
                                borderRadius:100
                                }} 
                                className="result-buttonGroup-retry" 
                                appearance="accent" 
                                stretched
                                before={complete && complete[0]?<Icon20ArrowRightOutline />:<Icon24RefreshOutline  width={20} height={20}/>}>
                            {complete && complete[0]?"Следующий уровень":"Попробовать снова"}
                        </Button>
                    </div>
                    <div className="result-buttonNotNow-div">
                        <Button 
                            onClick={(e)=>{
                                setAllTasks([{}])
                                go(e)
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
			

		</div>
			 

			

			
			
						
		</Panel>
	);
}



export default LvlResultPage;
