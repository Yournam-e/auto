import { getRandomInt } from '@vkontakte/vkjs';

function decideTask(id, oneNumber, twoNumberm, sign, userAnswer){
		let pcAnswer = oneNumber + twoNumberm

		console.log(sign)

		switch(sign){
			case '+':
				pcAnswer = oneNumber + twoNumberm
				if(pcAnswer === userAnswer){
					console.log('все правильно')
					return [true, pcAnswer]
				}else{
					console.log('не правильно')
					return [false, pcAnswer]
				}
				break;

			case '-':
				pcAnswer = oneNumber - twoNumberm
				if(pcAnswer === userAnswer){
					console.log('все правильно')
					return [true, pcAnswer]
				}else{
					console.log('не правильно')
					return [false, pcAnswer]
				}
				break;
			case '*':
				pcAnswer = oneNumber * twoNumberm
				if(pcAnswer === userAnswer){
					console.log('все правильно')
					return [true, pcAnswer]
				}else{
					console.log('не правильно')
					return [false, pcAnswer]
				}
				break;

		}

	}




export default decideTask;
