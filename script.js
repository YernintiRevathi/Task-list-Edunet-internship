//const declared for input buttons and task list area
const taskInput=document.querySelector("#newtask input");
const taskSection=document.querySelector(".tasks");

//listener for the Enter key to add a new task
taskInput.addEventListener("keyup", (e)=>{
    if(e.key==="Enter"){
        createTask();
    }
});

//the onclick event for the add button
document.querySelector("#push").onclick=function(){
    createTask();
}

//function that creates a task
function createTask(){
    //1. validation to check if the input field is empty
    if(taskInput.value.length==0){
        alert("Please Enter a Task");
    }
    else{
        //this block inserts HTML that creates each task into the the task area div element
        // 2. Create a new <div> element for the task
        const task = document.createElement("div");
        // 3. Add the "task" class for styling 
        task.classList.add("task");
        task.setAttribute("draggable", "true"); // Make the task draggable
        // 4. Set the inner HTML of the task div
        task.innerHTML = `
            <div class="drag-handle"></div>
            <label>
                <input onclick="updateTask(this)" type="checkbox" class="checkbox">
                <p>${document.querySelector("#newtask input").value}</p>
            </label>
            <button class="delete">
                <i class="uil uil-trash"></i>
            </button>
        </div>
        `;
        // 5. prepend (add at the beginning) the new task to the task section
        taskSection.prepend(task);
        taskInput.value=""; // Clear the input field

        //delete task functionality

        const deleteButton = task.querySelector('.delete');
        deleteButton.onclick = function () {
            this.parentNode.remove();
        };

        taskSection.offsetHeight>=300
        ?taskSection.classList.add("overflow")
        :taskSection.classList.remove("overflow");
        //adds a scrollbar if the area is larger than 300 px else removes
    }
}

function updateTask(task){
    // Find the parent .task element of the clicked checkbox
    //that is simply the element that is checked
    let taskItem=task.closest(".task");
    if(task.checked){
        taskItem.classList.add("completed");
        taskSection.appendChild(taskItem);
        //moves the completed task to the bottom of the list
    } else {
        taskItem.classList.remove("completed");
        taskSection.prepend(taskItem);
    }
}

// A variable to keep track of the element currently being dragged
let draggedTask = null;

// Fires when the user starts dragging a task
taskSection.addEventListener('dragstart', (e) => {
    draggedTask = e.target; // Store the dragged element
    setTimeout(() => {
        e.target.classList.add('dragging'); // Add styling after a tiny delay
    }, 0);
});

// Fires when the user stops dragging (drops the element)
taskSection.addEventListener('dragend', (e) => {
    draggedTask.classList.remove('dragging'); // Clean up by removing the style
    draggedTask = null; // Reset the variable
});

// Fires continuously as the dragged task is moved over the task section
taskSection.addEventListener('dragover', (e) => {
    e.preventDefault(); // This is required to allow a drop
    const afterElement = getDragAfterElement(taskSection, e.clientY);
    const dragging = document.querySelector('.dragging');

    if (afterElement == null) {
        // If there's no element below, append to the end
        taskSection.appendChild(dragging);
    } else {
        // Otherwise, insert the dragged item before the element below it
        taskSection.insertBefore(dragging, afterElement);
    }
});

function getDragAfterElement(container, y) {
    // Get all task elements that are NOT the one being dragged
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

    // Find which element is directly below the mouse cursor
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect(); // Get the position of the element
        const offset = y - box.top - box.height / 2; // Calculate distance from mouse to the element's center

        // We are looking for the element whose center is just below the cursor
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// You can think of this function as asking: "Of all the other tasks, 
// which one is my mouse pointer closest to and directly above?" 
// It calculates the vertical distance between your mouse and
// the center of every other task. The one with the smallest negative offset 
// (meaning the cursor is just above its center) is the one it returns. 
// The dragover event then knows to place the dragged item right before that element.