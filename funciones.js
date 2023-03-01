const mainCanvas = document.getElementById("my-canvas");
const ctx = mainCanvas.getContext("2d");


//************************ Genero la cuadrícula del audiograma ************************//
function drawGreed() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#bebeb2";

    for (let x = 1; x < mainCanvas.clientWidth; x += (mainCanvas.clientWidth) / 9) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, mainCanvas.clientHeight);
    }

    for (let y = 1; y < mainCanvas.clientHeight; y += (mainCanvas.clientHeight) / 15) {
        ctx.moveTo(0, y);
        ctx.lineTo(mainCanvas.clientWidth, y);
    }

    ctx.stroke();
}



//************************ Grafica los marcadores al hacer clic ***********************//
const markers = [];

const drawMarker = (evt) => {
    if (isSelecting === false) {
        cursorX = evt.offsetX;
        cursorY = evt.offsetY;
        markers.push([cursorX, cursorY]);               //Almaceno cc del marcador                       
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.strokeRect(cursorX - 7, cursorY - 7, 14, 14);
        //console.log("dibujado:", markers);                            
    }
};





//************************* Borra los marcadores al hacer clic ************************//

let startX, startY, endX, endY;
let isSelecting = false;

const startSelection = (evt) => {      //Captura cc: x-y cuando comienza la selección
    startX = evt.offsetX;
    startY = evt.offsetY;
    isSelecting = true;
};


const updateSelection = (evt) => { // Genera el cuadro de selección y elimina cc marcadores
    if (isSelecting === true) {
        endX = evt.offsetX;
        endY = evt.offsetY;
        ctx.fillStyle = "#86f9d313";
        ctx.fillRect(startX, startY, endX - startX, endY - startY);
        
        for (let i = 0; i < markers.length; i++) {   //borro cc de marcador si entra en la selección
            if (Math.abs(markers[i][0] - startX) <= Math.abs(startX - endX) &&
                Math.abs(markers[i][1] - startY) <= Math.abs(startY - endY)) { markers.splice(i, 1); }
        }
    }
};


const endSelection = (evt) => {    // Finaliza la selección, borra y restaura grilla y marcadores
    if (isSelecting === true) {
        ctx.clearRect(startX, startY, endX - startX, endY - startY);         //borra marcadores
        drawGreed();                                                         // Restaura grilla
        for (let i = 0; i < markers.length; i++) {                           
            ctx.lineWidth = 3;
            ctx.strokeStyle = "red";
            ctx.strokeRect(markers[i][0] - 7, markers[i][1] - 7, 14, 14);    // Restaura marcadores
        }
        isSelecting = false;                                                 // Finaliza selección
    }
};

mainCanvas.addEventListener("dblclick", drawMarker);
mainCanvas.addEventListener("mousedown", startSelection);
mainCanvas.addEventListener("mousemove", updateSelection);
mainCanvas.addEventListener("mouseup", endSelection);