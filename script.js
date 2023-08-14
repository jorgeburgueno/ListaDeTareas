const proyectosArray = localStorage.getItem("proyectos") ? JSON.parse(localStorage.getItem("proyectos")) : [] 
const contenedorProyectos = document.querySelector(".lista-de-proyectos");
const proyectoTitulo = document.querySelector(".titulo-proyecto");

let projectoId = 0;

document.querySelector("#enter").addEventListener("click", () => {
    const item = document.querySelector("#titulo")
    crearItem(item)
})


function activar(){
    const tabs = document.querySelectorAll(".item")
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", function() {
          var current = document.getElementsByClassName("active");
        

          // If there's no active class
          if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
          }
      
          // Add the active class to the current/clicked button
          this.className += " active";
        });
      }

}


function display(){
    let proyectos = ""
    for (let i = 0; i < proyectosArray.length; i++){
        proyectos += `<div class="item" onclick="activeProject(${proyectosArray[i].projectNumber})">
        <div class= "input">
            <textarea disabled>${proyectosArray[i].name}</textarea>
            <div class="edit">
                <i class="fa-solid fa-trash borrarBtn"></i>
                <i class="fa-solid fa-pen-to-square editBtn"></i>
            </div>
        </div>
        <div class="update">
            <button class="saveBtn">Guardar</button>
            <button class="cancelBtn">Cancelar</button>
        </div>
    </div>`
    }
    
    document.querySelector(".lista-de-proyectos").innerHTML = proyectos
    activarDelete()
    activarEdit()
    activarSave()
    activarCancel()
}

function activarDelete(){
    let borrarBtn = document.querySelectorAll(".borrarBtn")
    borrarBtn.forEach((db,i) => {
        db.addEventListener("click", () => { borrarItem(i)})
    })
}

function borrarItem(i){
    proyectosArray.splice(i, 1)
    localStorage.setItem("proyectos", JSON.stringify(proyectosArray))
    location.reload()
}

//Editar Tarea
function activarEdit(){
    const editBtn = document.querySelectorAll(".editBtn")
    const update = document.querySelectorAll(".update")
    const input = document.querySelectorAll(".input textarea")
    editBtn.forEach((eb, i) => {
        eb.addEventListener("click", () => {
          update[i].style.display = "block"
          input[i].disabled = false
        })       
    })
}

function activarSave(){
    const saveBtn = document.querySelectorAll(".saveBtn")
    const input = document.querySelectorAll(".input textarea")
    saveBtn.forEach((sb, i) => {
        sb.addEventListener("click", () => {
           updateItem(input[i].value, i) 
        })
    })
}

function updateItem(text, i){
    proyectosArray[i] = text
    localStorage.setItem("proyectos", JSON.stringify(proyectosArray))
    location.reload()    
}
function activarCancel(){
    const cancelBtn = document.querySelectorAll(".cancelBtn")
    const update = document.querySelectorAll(".update")
    const input = document.querySelectorAll(".input textarea")
    cancelBtn.forEach((cb, i) => {
        cb.addEventListener("click", () => {
            update[i].style.display = "none"
            input[i].disabled = true
        })
    })  
}

function activeProject(projectNumber){
    localStorage.setItem("activeProject", projectNumber)
}


function crearItem(item){
    let exists = false
    const name = item.value
    for (let index = 0; index < proyectosArray.length; index++) {
        const element = proyectosArray[index];
        if(element.name == name){
            exists = true
        }
    }
    if(exists === true) {
        alert("Nombre repetido, vales verga...")
    }
    else{
        const project = {"name": item.value, "projectNumber":Math.floor((Math.random() * 10000000) + 1)}
        proyectosArray.push(project)
        localStorage.setItem("proyectos", JSON.stringify(proyectosArray))
        location.reload()
    }

}

//Forms

class Pendiente {
    constructor(nombre, fecha, detalles, prioridad) {
        this.nombre= nombre;
        this.fecha= fecha;
        this.detalles= detalles;
        this.prioridad=prioridad;
        this.projectID = localStorage.getItem("activeProject")
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

    const nombre = document.querySelector("#nombre").value;
    const fecha = document.querySelector("#fecha").value;
    const detalles = document.querySelector("#detalles").value;
    const prioridad = document.querySelector("#prioridad").value;

    if(nombre === "" || fecha === ""  || prioridad === ""){
      UI.showAlert("Porfavor llena todos los campos")
    } else {
        const pendiente = new Pendiente(nombre, fecha, detalles, prioridad);
 
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



document.addEventListener("DOMContentLoaded", UI.displayPendiente, display(), activar())
