const tareasArray = localStorage.getItem("tareas") ? JSON.parse(localStorage.getItem("tareas")) : [] 

console.log(tareasArray)

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


window.onload = function (){
    display()
}







