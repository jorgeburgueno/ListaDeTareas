const proyectosArray = localStorage.getItem("proyectos") ? JSON.parse(localStorage.getItem("proyectos")) : [] 
const contenedorProyectos = document.querySelector(".lista-de-proyectos");
const proyectoTitulo = document.querySelector(".titulo-proyecto");


let projectoId = 0;

class Proyecto {
    constructor(titulo){
        this.titulo = titulo;
        this.pendientesArray = [];
        this.id= projectoId++;
    }

    addTodo(pendiente) {
        this.pendienteLista.push(pendiente);
    }

    removeTodo(index){
        this.pendiente.splice(index, 1);
    }
}

function crearProyecto(titulo){
    const proyecto = new Proyecto(titulo);
    proyectosArray.push(proyecto)
}

function removeProject(projectoId){
    proyectosArray = proyectosArray.filter((proyecto) => projecto.id !== projectoId);
}

document.querySelector("#enter").addEventListener("click", (e) => {
    e.preventDefault()
    const titulo = document.querySelector("#titulo").value
    crearProyecto(titulo);
    renderProyectos()
})



function activar(){
    const tabs = document.querySelectorAll(".item")
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", function() {
          var current = document.getElementsByClassName("active");         
          
          if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
          }      
          
          this.className += " active";
        });
      }
      
}

function renderProyectos() {
    contenedorProyectos.innerHTML = "";

    proyectosArray.forEach((proyecto) => {
        const elementoProyecto = document.createElement("div");
        elementoProyecto.classList.add("item");
        elementoProyecto.dataset.projectId = proyecto.id;
        
        elementoProyecto.innerHTML = `
        <div class="item" data-project-id="${proyecto.id}">
        <div class= "input">
            <textarea disabled>${proyecto.titulo}</textarea>
            <div class="edit">
                <i class="fa-solid fa-trash borrarBtn"></i>
                <i class="fa-solid fa-pen-to-square editBtn"></i>
            </div>
        </div>
        <div class="update">
            <button class="saveBtn">Guardar</button>
            <button class="cancelBtn">Cancelar</button>
        </div>
        </div>
        `
        contenedorProyectos.appendChild(elementoProyecto);
    })
}


//Forms

class Pendiente {
    constructor(nombre, fecha, detalles, prioridad) {
        this.nombre= nombre;
        this.fecha= fecha;
        this.detalles= detalles;
        this.prioridad=prioridad;
    }
}

function addPendienteAProyecto(projectoId, nombre, fecha, detalles, prioridad){
    const proyecto = proyectosArray.find((proyecto) => proyecto.id === projectoId);
    if (proyecto) {
        const pendiente = new Pendiente(nombre, fecha, detalles, prioridad);
        proyecto.addTodo(pendiente)
    }
}

function removePendiente(projectoId, pendienteIndex) {
    const proyecto = proyectosArray.find ((proyecto) => proyecto.id === projectoId);
    if (proyecto) {
        proyecto.removePendiente(pendienteIndex);
    }
}

function pendienteForm(projectoId){
    const form = document.querySelector("#pendientes-form");
    const nombre = document.querySelector("#nombre");
    const fecha = document.querySelector("#fecha");
    const detalles = document.querySelector("#detalles");
    const prioridad = document.querySelector("#prioridad");

    addPendienteAProyecto(projectoId, nombre.value, fecha.value, detalles.value, prioridad.value);
}

function renderPendientesdeProyecto(projectId){
    const proyecto = proyectosArray.find((proyecto) => proyecto.id === projectId);
    if (proyecto) {
        proyectoTitulo.textContent = proyecto.titulo;
        contenedorProyectos.innerHTML="";
        displayPendiente(projectId)
    }
}
class UI {
    static displayPendiente(){        
      const pendientes = Store.getPendiente();

      pendientes.forEach((pendiente) => UI.addPendienteALista(pendiente));
    }

    static addPendienteALista(pendiente){
       const lista = document.querySelector(".lista-de-pendientes");

       const row = document.createElement("tr");
       row.innerHTML = `
       <td>${pendiente.nombre}</td>
       <td>${pendiente.fecha}</td>
       <td>${pendiente.detalles}</td>
       <td>${pendiente.prioridad}</td>
       <td><button class="btn-delete">X</button></td>
       `;

       lista.appendChild(row)
    }
    
    static borrarPendiente(el){
        if(el.classList.contains("btn-delete")){
           el.parentElement.parentElement.remove() 
        }
    }
    

    static showAlert(mensaje, className){
        const div = document.createElement("div");
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(mensaje));
        const container = document.querySelector(".pendiente-input");
        const form = document.querySelector("#pendientes-form");
        container.insertBefore(div, form); 
        //hacerlo durar solo 2 segundos
        setTimeout(() => document.querySelector(".alert").remove(), 2000);
    }

    static clearFields(){
        document.querySelector("#nombre").value='';
        document.querySelector("#fecha").value='';
        document.querySelector("#detalles").value='';
        document.querySelector("#prioridad").value='';
    }
    
}

//Guardar un pendiente
class Store {
    static getPendiente(){
      let pendientes;
      if(localStorage.getItem("pendientes") === null){
        pendientes = []
      } else {
        pendientes = JSON.parse(localStorage.getItem("pendientes"));
      }

      return pendientes
    }

    static addPendiente(pendiente){
      const pendientes = Store.getPendiente();
      pendientes.push(pendiente);
      localStorage.setItem("pendientes", JSON.stringify(pendientes));
    }

    static borraPendiente(nombre){
      const pendientes = Store.getPendiente();

      pendientes.forEach((pendiente, index) => {
        if(pendiente.nombre === nombre) {
            pendientes.splice(index, 1);
        }
      });
      localStorage.setItem("pendientes", JSON.stringify(pendientes));
    }
    
}

//Anadir un pendiente
document.querySelector("#pendientes-form").addEventListener("submit", (e) =>{
    
    e.preventDefault();
    const projectId = parseInt(e.target.dataset.projectId);
    const nombre = document.querySelector("#nombre").value;
    const fecha = document.querySelector("#fecha").value;
    const detalles = document.querySelector("#detalles").value;
    const prioridad = document.querySelector("#prioridad").value;

    if(nombre === "" || fecha === ""  || prioridad === ""){
      UI.showAlert("Porfavor llena todos los campos")
    } else {
        const pendiente = new Pendiente(nombre, fecha, detalles, prioridad);
        pendienteForm(projectoId)
        UI.addPendienteALista(pendiente);

        Store.addPendiente(pendiente);
        
        UI.clearFields();
    }    

});

//Borra pendiente
document.querySelector(".lista-de-pendientes").addEventListener("click", (e) =>{
   
   //borra de UI
    UI.borrarPendiente(e.target);
   
   //borra de storage
   Store.borraPendiente(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent); 

   //alerta de borrado 
    UI.showAlert("Pendiente borrado")
})



document.addEventListener("DOMContentLoaded", UI.displayPendiente, activar())

