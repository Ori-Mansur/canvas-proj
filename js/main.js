'use strict'


var gCanvas;
var gCtx
var gPressMouse = false
var gCurrElement = 'square'
var timestamp = null;
var lastMouseX = null;
var lastMouseY = null


function init() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d')
}

function onSetColor(el) {
    gCtx.strokeStyle = el
    // gCtx.style.color=el

}
function onSetBgc(el) {
    document.querySelector('canvas').style.backgroundColor = el
}

function draw(ev, txt) {

    if (!gPressMouse) return
    var speed = getMouseSpeed(ev)
    if (!speed.speedY) speed.speedY = 10
    var x = ev.offsetX
    var y = ev.offsetY
    switch (gCurrElement) {
        case 'triangle':
            drawTriangle(x, y, speed.speedY, speed.speedX)
            break;
        case 'square':
            drawRect(x, y, speed.speedY, speed.speedY)
            break;
        case 'text':

            drawText(txt, x, y)
            break;
        case 'line':
            drawLine(x, y)
            break;
        case 'circle':
            drawArc(x, y, speed.speedY)
            break;
    }

}
function startDraw(ev) {
    gPressMouse = true
    gCtx.beginPath()
    gCtx.moveTo(ev.offsetX, ev.offsetY)
    if (gCurrElement === 'text') {
        var txt = getTxt()
        if (!txt) {
            document.querySelector('.user-txt').style.borderColor = 'red'
            return
        } else {
            document.querySelector('.user-txt').style.borderColor = 'rgb(238, 238, 238)'
            draw(ev, txt)
            return
        }
    }
    draw(ev)
}
function endDraw() {
    gPressMouse = false
}
function getCurrXY(ev) {
    var x = ev.clientX
    var y = ev.clientY
    return { x, y }
}
function showModalTxt() {
    document.querySelector('.modal-txt').style.display = 'block'
}
function drawRect(x, y, h, w) {
    gCtx.beginPath();
    gCtx.rect(x, y, h, w)
    gCtx.stroke()
}
function drawArc(x, y, r) {
    gCtx.beginPath();
    gCtx.arc(x, y, r, 0, 2 * Math.PI);
    gCtx.stroke();
}
function drawLine(endX, endY) {
    gCtx.lineTo(endX, endY);
    // gCtx.closePath()
    gCtx.stroke();
}
function drawTriangle(x, y) {
    gCtx.lineTo(x, y);
    gCtx.lineTo(x + 100, y + 100);
    gCtx.closePath()
    gCtx.stroke();

}
function drawText(txt, x, y) {
    gCtx.font = "40px Arial";
    gCtx.fillText(txt, x, y);
    gCtx.strokeText(txt, x, y);

}
function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}
function getTxt() {
    return document.querySelector('.user-txt').value
}
function onSetShape(elName) {
    gCurrElement = elName
    if (gCurrElement === 'text') {
        showModalTxt()
    }
}

function onSetImg(){
    var elImgSrc=document.getElementById('img-canvas').value
    document.querySelector('img').src=elImgSrc
    drawImg()
    document.getElementById('img-canvas').value=''
    

}
function drawImg() {
    const img = document.querySelector('img');
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
}

function downloadImg(elLink) {

    var dataURL = gCanvas.toDataURL()
    elLink.href = dataURL
}


function resizeCanvas() {
    var elContainer = document.querySelector('main');
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}

function mouseMoveWhilstDown(target, whileMove) {
    var endMove = function () {
        window.removeEventListener('mousemove', whileMove);
        window.removeEventListener('mouseup', endMove);
    };

    target.addEventListener('mousedown', function (event) {
        event.stopPropagation(); // remove if you do want it to propagate ..
        window.addEventListener('mousemove', whileMove);
        window.addEventListener('mouseup', endMove);
    });
}




function getMouseSpeed(e) {
    if (!timestamp) {
        timestamp = Date.now();
        lastMouseX = e.screenX;
        lastMouseY = e.screenY;
    }
    var now = Date.now();
    var dt = now - timestamp;
    var dx = e.screenX - lastMouseX;
    var dy = e.screenY - lastMouseY;
    var speedX = Math.round(dx / dt * 100);
    if (speedX < 0) speedX *= -1
    var speedY = Math.round(dy / dt * 100);
    if (speedY < 0) speedY *= -1
    timestamp = now;
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
    return { speedX, speedY }
}