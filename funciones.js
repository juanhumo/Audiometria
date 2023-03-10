const mainCanvas = document.getElementById("my-canvas");
const ctx = mainCanvas.getContext("2d");


//************************* Código para mostrar ocultar menu **************************//

var menu_visible = false;
let menu = document.getElementById("menu-content");


function showMenu(){

    if(menu_visible===false){
        menu.style.display = "block";
        menu_visible = true;
    }
    else{
        menu.style.display = "none";
        menu_visible = false;
    }
}




//******************** Código para mostrar contenido por pestañas *********************//

const tabs = document.querySelectorAll('.tabs li');
const tabContent = document.querySelectorAll('.tab-content');

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    tabs.forEach((tab) => tab.classList.remove('active'));
    tab.classList.add('active');

    tabContent.forEach((content) => content.classList.remove('active'));
    tabContent[index].classList.add('active');
  });
});


//************************ Dibuja y da ancho y alto al canvas *************************//

const drawCanvas = function(){
    ctx.canvas.width = document.documentElement.clientWidth;
    ctx.canvas.height = document.documentElement.clientHeight; 
}

//************************ Genero la cuadrícula del audiograma ************************//
function drawGrid() {
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#bebeb2";

    for (let x = 1; x < ctx.canvas.width; x += (ctx.canvas.width) / 9) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ctx.canvas.height);
    }
    for (let y = 1; y < ctx.canvas.height; y += (ctx.canvas.height) / 15) {
        ctx.moveTo(0, y);
        ctx.lineTo(ctx.canvas.width, y);
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
        ctx.clearRect(0, 0, mainCanvas.clientWidth, mainCanvas.clientHeight);         //borra todo
        ctx.setLineDash([]);                  //linea sólida en caso de que este seteada en dashed
        drawGrid();                                                             // Restaura grilla
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        for (let i = 0; i < markers.length; i++) {markers[i].draw();}        // Restaura marcadores
        isSelecting = false;                                                 // Finaliza selección                                               
    }
};



/***************************** Graficar línea de unión entre marcadores ****************************/

const drawLines = (evt) => {
    if (evt.key === "d") {   

        isSelecting=true;
        endSelection();                     //borra todo y restaura el array de marcadores y grilla

        
/*************** Función para separar los marcadores en sub arrays según su clase ****************/

        const markersByClass = {};     //Array de sub arrays para separar las clases de marcadores
        for (let marker of markers) {
            const className = marker.toString(); //aplica método toString de c/clase (return clase)
            if (!markersByClass[className]) {                     //chequea si existe el sub array
                markersByClass[className] = [];                                //crea el sub array
            }
            markersByClass[className].push(marker);     //Coloca objeto en sub array según su clase    
        } 
/*************************************************************************************************/

        ctx.lineWidth = 2;

/************* Dibuja las lineas de forma que solo unan marcadores de la misma clase *************/

        for (let className in markersByClass) {              //recorre por cada clave hasta el fin
            const markersOfClass = markersByClass[className];      // asigna sub array segun clave
            markersOfClass.sort((a, b) => a.cursorX - b.cursorX);   // ordena de < a > seg'un cc X

/*******se usan las propiedades de color y estilo de linea de cada clase antes de graficar*******/
            ctx.setLineDash(markersOfClass[0].lineStyle === 'dashed' ? [6, 3] : []);   //lineStyle
            ctx.strokeStyle = markersOfClass[0].color;                      // Color de cada clase

            for (let i = 0; i < markersOfClass.length - 1; i++) {           //recorre el sub array
                ctx.beginPath();
                ctx.moveTo(markersOfClass[i].cursorX, markersOfClass[i].cursorY);
                ctx.lineTo(markersOfClass[i + 1].cursorX, markersOfClass[i + 1].cursorY);
                ctx.stroke();
            }
        } 
/*************************************************************************************************/
    }
    isSelecting=false;
};


//********************* Declaración de clases para cada marcadores ********************//


class Circle {
    constructor(cursorX, cursorY, ctx,) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
        this.color = "red";
        this.lineStyle = "solid";
      }
    draw() {
        this.ctx.strokeStyle = this.color; 
        const circle = new Path2D();
        circle.arc(this.cursorX, this.cursorY, 7, 0, 2 * Math.PI);
        this.ctx.stroke(circle);
    }
    toString() {
        return "Circle";
      }
}



class Triangle {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
        this.color = "red";
        this.lineStyle = "solid";
      }
    draw() {
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX, this.cursorY-7);
        this.ctx.lineTo(this.cursorX-7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX, this.cursorY-7);
        this.ctx.closePath();
        this.ctx.stroke();
      }
      toString() {
        return "Triangle";
      }
}

class Square {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
        this.color = "blue";
        this.lineStyle = "solid";
      }
    draw() {
        this.ctx.strokeStyle = this.color; 
        const square = new Path2D();
        square.rect(this.cursorX-7, this.cursorY-7, 14, 14);
        this.ctx.stroke(square);
    }
    toString() {
        return "Square";
      }
}

class Ex {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
        this.color = "blue";
        this.lineStyle = "solid";
      }
    draw() {
        this.ctx.strokeStyle = this.color; 
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX-7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY-7);
        this.ctx.moveTo(this.cursorX-7, this.cursorY-7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY+7);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    toString() {
        return "Ex";
      }
}


class Minor {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
        this.color = "red";
        this.lineStyle = "dashed";
      }
    draw() {
        this.ctx.strokeStyle = this.color; 
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX-2, this.cursorY+7);
        this.ctx.lineTo(this.cursorX-7, this.cursorY);
        this.ctx.lineTo(this.cursorX-2, this.cursorY-7);
        this.ctx.stroke();
    }
    toString() {
        return "Minor";
      }
}

class Major {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
        this.color = "blue";
        this.lineStyle = "dashed";
      }
    draw() {
        this.ctx.strokeStyle = this.color; 
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX+2, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY);
        this.ctx.lineTo(this.cursorX+2, this.cursorY-7);
        this.ctx.stroke();
    }
    toString() {
        return "Major";
      }
}

class SquareBracketOpen {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
        this.color = "red";
        this.lineStyle = "dashed";
      }
    draw() {
        this.ctx.strokeStyle = this.color; 
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX-2, this.cursorY+7);
        this.ctx.lineTo(this.cursorX-7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX-7, this.cursorY-7);
        this.ctx.lineTo(this.cursorX-2, this.cursorY-7);
        this.ctx.stroke();
    }
    toString() {
        return "SquareBracketOpen";
      }
}


class SquareBracketClose {
    constructor(cursorX, cursorY, ctx) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.ctx = ctx;
        this.color = "blue";
        this.lineStyle = "dashed";
      }
    draw() {
        this.ctx.strokeStyle = this.color; 
        this.ctx.beginPath();
        this.ctx.moveTo(this.cursorX+2, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY+7);
        this.ctx.lineTo(this.cursorX+7, this.cursorY-7);
        this.ctx.lineTo(this.cursorX+2, this.cursorY-7);
        this.ctx.stroke();
    }
    toString() {
        return "SquareBracketClose";
      }
}


mainCanvas.addEventListener("dblclick", drawMarkers);
mainCanvas.addEventListener("mousedown", startSelection);
mainCanvas.addEventListener("mousemove", updateSelection);
mainCanvas.addEventListener("mouseup", endSelection);

document.addEventListener("keyup", drawLines);

window.addEventListener("resize", drawCanvas);
window.addEventListener("resize", drawGrid);

