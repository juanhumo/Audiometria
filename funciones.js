const mainCanvas = document.getElementById("my-canvas");
const context = mainCanvas.getContext("2d");


//******************** Genero la cuadrícula del audiograma ********************//

context.lineWidth = 1;
context.strokeStyle = "#bebeb2";

for(let x=1; x<mainCanvas.clientWidth; x+=(mainCanvas.clientWidth)/9){
    context.moveTo(x, 0);
    context.lineTo(x, mainCanvas.clientHeight);
}

for(let y=1; y<mainCanvas.clientHeight; y+=(mainCanvas.clientHeight)/15){
    context.moveTo(0, y);
    context.lineTo(mainCanvas.clientWidth, y);
}

context.stroke();