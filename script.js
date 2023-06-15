const tareasArray = localStorage.getItem("tareas") ? JSON.parse(localStorage.getItem("tareas")) : [] 

document.querySelector("#enter").addEventListener("click", () => {
    const item = document.querySelector("#tarea")
    crearItem(item)
})

function display(){
    let tareas = ""
    for (let i = 0; i < tareasArray.length; i++){
        tareas += `<div class="item">
        <div class= "input">
            <textarea disabled>${tareasArray[i]}</textarea>
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
    document.querySelector(".listado").innerHTML = tareas
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
    tareasArray.splice(i, 1)
    localStorage.setItem("tareas", JSON.stringify(tareasArray))
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
    tareasArray[i] = text
    localStorage.setItem("tareas", JSON.stringify(tareasArray))
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


function crearItem(item){
    tareasArray.push(item.value)
    localStorage.setItem("tareas", JSON.stringify(tareasArray))
    location.reload()
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



document.addEventListener("DOMContentLoaded", UI.displayPendiente, display())

 


