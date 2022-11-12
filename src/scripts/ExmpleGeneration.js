import { getRandomInt } from '@vkontakte/vkjs';

function ExmpleGeneration(i, setCount, setAnswer, setEquation, equation, count){
		let a = getRandomInt(3, 14)
		let b = getRandomInt(3, 14)

		if(i === equation[3]){
			setCount(count+1)
		}

		

		let x = ['+', '-', '*']

		switch(x[getRandomInt(0, 2)]){
			case '+':
				setEquation([a, b, '+', a+b])
				setAnswer([a+b, getRandomInt(1, 20), getRandomInt(1, 20), getRandomInt(1, 20)].sort(()=>Math.random()-0.5))
				break;

			case '-':
				setEquation([a, b, '-', a-b])
				setAnswer([a-b, getRandomInt(1, 10), getRandomInt(1, 10), getRandomInt(1, 10)].sort(()=>Math.random()-0.5))
				break;
			
			case '*':
				setEquation([a, b, '*', a*b])
				setAnswer([a*b, getRandomInt(1, 100), getRandomInt(1, 100), getRandomInt(1, 100)].sort(()=>Math.random()-0.5))
				break;

		}

	}




export default ExmpleGeneration;
