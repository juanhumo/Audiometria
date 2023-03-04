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
let simbolo = 8;

const drawMarkers = (evt) => {

    if (isSelecting === false) {
        cursorX = evt.offsetX;
        cursorY = evt.offsetY;                
        ctx.lineWidth = 3; 
        
        if(document.getElementById("circle-marker").checked){
                let circle = new Circle(cursorX, cursorY, ctx);
                markers.push(circle);
                circle.draw();
                
        }
        if(document.getElementById("minor-marker").checked){
                let minor = new Minor(cursorX, cursorY, ctx);
                markers.push(minor);
                minor.draw();
                
        }
        if(document.getElementById("triangle-marker").checked){
                let triangle = new Triangle(cursorX, cursorY, ctx);
                markers.push(triangle);               //Almaceno cc del marcador 
                triangle.draw();   
                
        }
        if(document.getElementById("bracket-open-marker").checked){    
                let bracketopen = new SquareBracketOpen(cursorX, cursorY, ctx);
                markers.push(bracketopen);
                bracketopen.draw();
                
        }
        if(document.getElementById("x-marker").checked){
                let ex = new Ex(cursorX, cursorY, ctx);
                markers.push(ex);
                ex.draw();
                
        }
        if(document.getElementById("major-marker").checked){
                let major = new Major(cursorX, cursorY, ctx);
                markers.push(major);
                major.draw();
                
        }
        if(document.getElementById("square-marker").checked){
                let square = new Square(cursorX, cursorY, ctx);
                markers.push(square);
                square.draw();
                
        }
        if(document.getElementById("bracket-close-marker").checked){
                let bracketclose = new SquareBracketClose(cursorX, cursorY, ctx);
                markers.push(bracketclose);
                bracketclose.draw();
                
        }      
        
       console.log(markers);                     
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
        ctx.setLineDash([]);                //linea sólida en caso de que este seteada en dashed
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
            ctx.setLineDash([6, 3]);                    // linea interrumpida
            ctx.beginPath();
            ctx.moveTo(markers[i].cursorX, markers[i].cursorY);
            ctx.lineTo(markers[i + 1].cursorX, markers[i + 1].cursorY);
            ctx.stroke();
        }
        ctx.closePath();
    }
    isSelecting=false;
};


//*************************** Dibujo de distintos marcadores **************************//

class Circle {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
      }
    draw() {
        this.ctx.strokeStyle = "red";
        this.ctx.fillStyle = 'white' 
        const circle = new Path2D();
        circle.arc(this.cursorX, this.cursorY, 7, 0, 2 * Math.PI);
        this.ctx.stroke(circle);
    }
}



class Triangle {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
      }
    draw() {
        this.ctx.strokeStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX, this.cursorY-7);
        this.ctx.lineTo(this.cursorX-7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX, this.cursorY-7);
        this.ctx.closePath();
        this.ctx.stroke();
      }
}

class Square {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
      }
    draw() {
        this.ctx.strokeStyle = "blue"; 
        const square = new Path2D();
        square.rect(this.cursorX-7, this.cursorY-7, 14, 14);
        this.ctx.stroke(square);
    }
}

class Ex {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
      }
    draw() {
        this.ctx.strokeStyle = "blue"; 
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX-7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY-7);
        this.ctx.moveTo(this.cursorX-7, this.cursorY-7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY+7);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}


class Minor {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
      }
    draw() {
        this.ctx.strokeStyle = "red"; 
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX-2, this.cursorY+7);
        this.ctx.lineTo(this.cursorX-7, this.cursorY);
        this.ctx.lineTo(this.cursorX-2, this.cursorY-7);
        this.ctx.stroke();
    }
}

class Major {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
      }
    draw() {
        this.ctx.strokeStyle = "blue"; 
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX+2, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY);
        this.ctx.lineTo(this.cursorX+2, this.cursorY-7);
        this.ctx.stroke();
    }
}

class SquareBracketOpen {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
      }
    draw() {
        this.ctx.strokeStyle = "roja"; 
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX-2, this.cursorY+7);
        this.ctx.lineTo(this.cursorX-7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX-7, this.cursorY-7);
        this.ctx.lineTo(this.cursorX-2, this.cursorY-7);
        this.ctx.stroke();
    }
}


class SquareBracketClose {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
      }
    draw() {
        this.ctx.strokeStyle = "blue"; 
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX+2, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY-7);
        this.ctx.lineTo(this.cursorX+2, this.cursorY-7);
        this.ctx.stroke();
    }
}


mainCanvas.addEventListener("dblclick", drawMarkers);
mainCanvas.addEventListener("mousedown", startSelection);
mainCanvas.addEventListener("mousemove", updateSelection);
mainCanvas.addEventListener("mouseup", endSelection);
document.addEventListener("keyup", drawLines);