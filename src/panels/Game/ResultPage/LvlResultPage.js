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

 import { Icon56CheckCircleOutline, Icon56CancelCircleOutline, Icon20ArrowRightOutline, Icon16ClockCircleFill, Icon24RefreshOutline } from '@vkontakte/icons';
 import './LvlResultPage.css'
import { qsSign } from '../../../hooks/qs-sign';
import axios from 'axios';



 
const LvlResultPage = ({ id, go, count, lvlResult, setPopout, lvlNumber ,timeFinish,setLvlNumber,setActivePanel,setReady, themeColors }) => {

	const url ='https://showtime.app-dich.com/api/plus-plus/'
     

    const [complete, setComplete] = useState([false, 'notRight'])

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
                await setPopout(null); 
                console.log(timeStarted)  
                const timeMs = timeFinish - new Date(timeStarted).getTime()
                setFinishedTime(timeMs/1000)
                if(rightResults> lvlResult.answers.length-1){
                    if(timeFinish - new Date(timeStarted).getTime()< 30000){
                        setComplete([true, 'right'])
                    }else{
                        setComplete([false, 'beOnTime'])
                    }
                }else{
                    setComplete([false, 'notright'])
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

            <div className='lvl-res-headDiv'>
                {complete[0]?<Icon56CheckCircleOutline 
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

                <Title className='lvl-res-title-div' style={{color:themeColors === 'light'?'':'#fff'}}>Уровень {complete[0]?'пройден!':'провален'}</Title>
                
                <Title  className='lvl-res-sub-title-div' weight="1" >{complete[0]?'Неплохо!':complete[1] === "beOnTime"?'Вы не успели':'Вы ошиблись'}</Title>

                <div style={{height: 30, marginTop: 12}} className='lvl-res-clock-div'>
					<Icon16ClockCircleFill 
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

            </div>



            <div className='lvl-res-absolute-div'>
                <ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
                    <div className="result-buttonRetry-div">
                        <Button size="l" 
                                onClick={()=>{
                                    playNext()
                                }}
                                style={{
                                backgroundColor:'#1A84FF',
                                borderRadius:25
                                }} 
                                className="result-buttonGroup-retry" 
                                appearance="accent" 
                                stretched
                                before={complete[0]?<Icon20ArrowRightOutline />:<Icon24RefreshOutline  width={20} height={20}/>}>
                            {complete[0]?"Следующий уровень":"Попробовать снова"}
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
			

		</div>
			 

			

			
			
						
		</Panel>
	);
}



export default LvlResultPage;
