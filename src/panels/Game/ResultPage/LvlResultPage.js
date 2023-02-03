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
    ScreenSpinner,
    Separator
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
    setAllTasks,setTimeFinish }) => {

	const url ='https://showtime.app-dich.com/api/plus-plus/'
     

    const [complete, setComplete] = useState()

    const [finishedTime, setFinishedTime] = useState()


    let findArr = false


    
	function devideLvl(numberId){
		switch (numberId) {
			case 1:
				return ['30 секунд', '10 задач', 10]
			case 2:
				return ['30 секунд', '10 задач', 10]
			case 3:
				return ['30 секунд', '10 задач', 10]
			case 4:
				return ['30 секунд', '15 задач', 15]
			case 5:
				return ['30 секунд', '15 задач', 15]
			case 6:
				return ['30 секунд', '15 задач', 15]
			case 7:
				return ['30 секунд', '15 задач', 15]
			case 8:
				return ['30 секунд', '15 задач', 15]
			case 9:
				return ['30 секунд', '15 задач', 15]
			case 10:
				return ['30 секунд', '20 задач', 20]
		  }

	}



    	
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

        var lastTime = Date.now()

        
        setReady(false)

        

        
        axios.put(`https://showtime.app-dich.com/api/plus-plus/lvl${qsSign}`,{
            "id": lvlResult.id,
            "lvlType": lvlResult.lvlType,
            "answers": lvlResult.answers,
          })
        .then(async function (response) {
            axios.get(`${url}info${qsSign}`) //получил инфу о лвлах
            .then(async function (response) { 
                await console.log(response.data.data)
                let items = response.data.data
                let searchTerm = lvlResult.lvlType;
                let rightResults = items.find(one => one.lvlType === searchTerm).rightResults
                let timeStarted = items.find(one => one.lvlType === searchTerm).started

                 
                await timeFinish
                if(timeFinish === 0){
                    
                }
                const timeMs = timeFinish - new Date(timeStarted).getTime()
                setFinishedTime(timeMs/1000)
                if(rightResults> devideLvl(lvlNumber)[2]-1){
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
		<Panel id={id} style={{height: window.pageYOffset}}>

 

        <div style={{background: themeColors === 'light'?"#F7F7FA":"#1D1D20", height: document.pageYOffset}}>

            <div className='main-div-resilt-page'>
            <div className='lvl-res-headDiv'>
                {complete && allTasks.length>devideLvl(lvlNumber)[2]&& complete[0]?<Icon56CheckCircleOutline 
                fill="#1A84FF" 
                style={{
                    marginLeft: 'auto', 
                    marginRight: 'auto'
                }}/>
                :<Icon56CancelCircleOutline 
                        fill="#FF2525" 
                        style={{
                            marginLeft: 'auto', 
                            marginRight: 'auto'
                            }}
                        />}

                <Title className='lvl-res-title-div' style={{color:themeColors === 'light'?'':'#fff'}}>{complete && allTasks.length>devideLvl(lvlNumber)[2]&& complete[0]?'Уровень пройден!':'Попробуйте снова'}</Title>
                
                {complete && complete[0] && allTasks.length>devideLvl(lvlNumber)[2] && <Title  className='lvl-res-sub-title-div' weight="1">Неплохо!</Title>}
                {complete && complete[1] === "beOnTime" && <Title  className='lvl-res-sub-title-div' weight="1" >Вы не успели</Title>}
                <div className="not-right-button" >

                {complete&& !complete[0] && allTasks.length>10 &&  <Title style={{}} className='lvl-res-sub-title-div' weight="1" >Вы не успели</Title>}
                
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
                                disabled={true}
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
                                
                                <Title level='2'className='inCell' style={{color: themeColors === 'light'?'#000':'#fff'}}>{item.number1}{item.sign}{item.number3}={item.pcAnswer}</Title>
                                </Cell>
                            )
                        }
                        
                    })}
                </List>
            </div>

                            
            </div>





    



            
            <div className='lvl-res-absolute-div' style={{background: themeColors === 'light'?"#F7F7FA":"#1D1D20" }}>
                
                <ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
                    <div className="result-buttonRetry-div">
                        {
                        <Button size="l" 
                            onClick={()=>{
                                async function deleteAndStart(){
                                    
                                    await setFinishedTime(0)
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
                            before={complete && lvlNumber!==10&& complete[0]?<Icon20ArrowRightOutline />:<Icon24RefreshOutline  width={20} height={20}/>}>
                        {complete && lvlNumber!==10&& complete[0]?"Следующий уровень":"Попробовать снова"}
                        </Button>}
                    </div>
                    <div className="result-buttonNotNow-div">
                        <Button 
                            className="result-buttonGroup-notNow"
                            onClick={(e)=>{
                                setFinishedTime(0)
                                
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
