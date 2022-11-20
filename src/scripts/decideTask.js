import { getRandomInt } from '@vkontakte/vkjs';

function decideTask(id, oneNumber, twoNumberm, sign, userAnswer){
		let pcAnswer = oneNumber + twoNumberm

		console.log(sign)

		switch(sign){
			case '+':
				pcAnswer = oneNumber + twoNumberm
				if(pcAnswer === userAnswer){
					console.log('все правильно')
					return 'true'
				}else{
					console.log('не правильно')
					return 'false'
				}
				break;

			case '-':
				pcAnswer = oneNumber - twoNumberm
				if(pcAnswer === userAnswer){
					console.log('все правильно')
					return true
				}else{
					console.log('не правильно')
					return 'false'
				}
				break;
			case '*':
				pcAnswer = oneNumber * twoNumberm
				if(pcAnswer === userAnswer){
					console.log('все правильно')
					return 'true'
				}else{
					console.log('не правильно')
					return 'false'
				}
				break;

		}

	}




export default decideTask;
