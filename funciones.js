const mainCanvas = document.getElementById("my-canvas");
const ctx = mainCanvas.getContext("2d");


//************************ Genero la cuadrícula del audiograma ************************//
function drawGrid() {
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

const drawMarkers = (evt) => {

    if (isSelecting === false) {
        cursorX = evt.offsetX;
        cursorY = evt.offsetY;                
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red"; 
        let triangle = new Triangle(cursorX, cursorY, ctx);
        markers.push(triangle);               //Almaceno cc del marcador 
        triangle.draw();   
      
       console.log(markers);                     
    }
};




//************************* Borra los marcadores al hacer clic ************************//

let startX, startY, endX, endY;
let isSelecting = false;

const startSelection = (evt) => {      //Captura cc: x-y cuando comienza la selección
   
    if(evt.shiftKey===true){
        startX = evt.offsetX;
        startY = evt.offsetY;
        isSelecting = true;
    } 
};


const updateSelection = (evt) => { // Genera el cuadro de selección y elimina cc marcadores
    
    if (isSelecting === true) {
        endX = evt.offsetX;
        endY = evt.offsetY;
        ctx.fillStyle = "#86f9d313";
        ctx.fillRect(startX, startY, endX - startX, endY - startY);

        for (let i = markers.length - 1; i >= 0; i--) { //borro cc de marcador si entra en la selección
            if (Math.sign(markers[i].cursorX - startX) != Math.sign(markers[i].cursorX - endX) &&
                Math.sign(markers[i].cursorY - startY) != Math.sign(markers[i].cursorY - endY)) {
                markers.splice(i, 1);
            }
        }
    }
};


const endSelection = () => {        // Finaliza la selección, borra y restaura grilla y marcadores
    if (isSelecting === true) {
        ctx.clearRect(0, 0, mainCanvas.clientWidth, mainCanvas.clientHeight); //borra todo
        drawGrid();                                                           // Restaura grilla
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        for (let i = 0; i < markers.length; i++) {markers[i].draw();}        // Restaura marcadores
        isSelecting = false;                                                 // Finaliza selección                                               
    }
};



//********************** Graficar línea de unión entre marcadores *********************//

const drawLines = (evt) => {
    if (evt.key === "d") {   

        isSelecting=true;
        endSelection();          //borra todo y restaura el array de marcadores y grilla
       
        function compareX(a, b) { return a.cursorX - b.cursorX; } //Función para sort()
        markers.sort(compareX);                     //ordeno markers de < a > segun ccX  
        ctx.lineWidth = 2;

        for (let i = 0; i < markers.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(markers[i].cursorX+3, markers[i].cursorY);
            ctx.lineTo(markers[i + 1].cursorX-3, markers[i + 1].cursorY);
            ctx.stroke();
        }
        ctx.closePath();
    }
    isSelecting=false;
};


//*************************** Dibujo de distintos marcadores **************************//

function drawCircle() {
    const circle = new Path2D();
    circle.arc(100, 35, 25, 0, 2 * Math.PI);
    ctx.stroke(circle);
}

function drawX(){
    const eX = new Path2D();
    eX.moveTo(0, 0);
    eX.lineTo(20, 20);
    eX.moveTo(20, 0);
    eX.lineTo(0, 20);
    ctx.stroke(eX);
}

class Triangle {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
      }
    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX, this.cursorY-7);
        this.ctx.lineTo(this.cursorX-7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX, this.cursorY-7);
        this.ctx.closePath();
        this.ctx.stroke();
      }
}


function drawSimbol(selectedSimbol){
    
    const scuare = new Path2D();
    const minor = new Path2D();
    const mayor = new Path2D();  
}


mainCanvas.addEventListener("dblclick", drawMarkers);
mainCanvas.addEventListener("mousedown", startSelection);
mainCanvas.addEventListener("mousemove", updateSelection);
mainCanvas.addEventListener("mouseup", endSelection);
document.addEventListener("keyup", drawLines);