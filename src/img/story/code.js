// FIRST - load fonts in componentDidMount 
//(отобразить <p>content</p> с opacity = 0 и position: fixed и font-family, и через p.onload убрать его из документа)
// это нужно для того, чтобы этот шрифт отрисовался в канвасе

// склонение
function decOfNum(number, titles, needNumber = true) {
    if (number !== undefined) {
        let decCache = [],
            decCases = [2, 0, 1, 1, 1, 2];
        if (!decCache[number]) decCache[number] = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)];
        return (needNumber ? number + ' ' : '') + titles[decCache[number]];
    }
}

// параметры url
function getUrlParams() {
    return window.location.search.length > 0 && JSON.parse('{"' + decodeURI(window.location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
}

import { createCanvas, loadImage } from 'canvas';
const background = await loadImage(require(`./story.png`));
const phrases = [
    decOfNum(count, ['Математическую', 'Математические', 'Математических']),
    decOfNum(count, ['задачу', 'задачи', 'задач']) + ' за ',
    '30 секунд!'
];
const canvas = createCanvas(background.width, background.height);
const ctx = canvas.getContext('2d');

ctx.drawImage(background, 0, 0);

ctx.font = '700 189px Space Grotesk';
ctx.fillStyle = '#1A84FF';
ctx.textAlign = 'center';
ctx.fillText(count, 540, 709 + 133);

ctx.font = '500 63px Manrope';
ctx.fillStyle = '#333333';
ctx.textAlign = 'center';
ctx.fillText(phrases[0], 540, 1032 + 52);

const
    width1 = ctx.measureText(phrases[1] + phrases[2]).width,
    width2 = ctx.measureText(phrases[1]).width
    ;
    ctx.textAlign = 'left';
    ctx.fillText(phrases[1], (background.width - width1) / 2, 1118 + 48);
    ctx.font = '800 63px Manrope';
    ctx.fillStyle = '#1A84FF';
    ctx.fillText(phrases[2], (background.width - width1) / 2 + width2, 1118 + 48);

bridge.send('VKWebAppShowStoryBox', {
    background_type: 'image',
    blob: canvas.toDataURL('image/png'),
    attachment: {
        url: `https://vk.com/app${getUrlParams().vk_app_id}`,
        text: 'go_to',
        type: 'url'
    }
});