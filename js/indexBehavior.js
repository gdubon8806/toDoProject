//Main function
function mainProcess() {
  let addTaskBtn = document.getElementById('addNewTaskBtn'); // we target the AddBtn that will handle the event of adding a task
  //Event handler to the button that will trigger all when we want to add a task
  addTaskBtn.addEventListener('click', () => {
  taskDraftOBJ.generateTaskDraft(); 
})

  //Just calling some methods inside the mainProcess to hook up all the things
  StorageOBJ.initializeStorage();
  StorageOBJ.getTasks();
  secundaryProcessesOBJ.displayMenu();
}    

  //THIS IS THE OBJECT THAT MANAGES ALL SECUNDARY PROCESSES
  secundaryProcessesOBJ = {
    displayMenu: function () { //small function i use to display or hide the menu
      let menuContainer = document.getElementById('menuContainer');
      let menuBtn = document.getElementById('menuBtn')
      menuBtn.addEventListener('click', () => {
         if (menuContainer.style.visibility == "hidden") {
          menuContainer.setAttribute('class', 'test1');
          menuContainer.style.visibility = 'visible';
   
         } else {
          menuContainer.setAttribute('class', 'test2');
           setTimeout(() => {
            menuContainer.style.visibility = 'hidden'; 
           }, 500);
         }
      });
    },
  }

  //THIS IS THE OBJECT THAT MANAGES THE LOCALSTORAGE API
  StorageOBJ = {
    initializeStorage: function () { //this initializes our storage 
      if (localStorage.length < 1) { //in case we havent create our storage we do it, otherwise this is just ommited after the first execution
        let data = {
          tasks: {
            keysOfTasksArr: [],
            valuesOfTasksArr: [], 
          },
          checkedTasks : {
            keysOfCheckedTasksArr: [], 
            valuesOfCheckedTasksArr: []
          }
        }
        
       localStorage.setItem('data', JSON.stringify(data));
      }
    },
    refreshStorage: function (newId, newInputTask) { //this function save the new task
      let data = JSON.parse(localStorage.getItem('data')); //we get the data stored in our localStorage
      let keys = data.tasks.keysOfTasksArr; //we extract our keys 
      let values = data.tasks.valuesOfTasksArr; //we extract our values
      keys.push(newId); //then we push the new key of the new task
      values.push(newInputTask); //and we also push the new task

      localStorage.setItem("data", JSON.stringify(data)); //afterwards we override the current data item with the updated version

    },
    deleteTask: function (containerOfTaskToDelete) { // this deletes the task and it ID from the storage
      let idToDelete = containerOfTaskToDelete.firstChild.id; //first we get the id of the task
      let data = JSON.parse(localStorage.getItem('data')); //we get the data stored in our localStorage
      let keys = data.tasks.keysOfTasksArr;
      let values = data.tasks.valuesOfTasksArr; 
      
      for (let i in keys) {
        if (keys[i] == idToDelete) {
          keys.splice(i, 1);
          values.splice(i, 1);
          localStorage.setItem('data',JSON.stringify(data));
          break;
        }
      }
    },
    getTasks: function() { //this recovers the data, iterating over the keys array
      let data = JSON.parse(localStorage.getItem('data')); //we get the data stored in our localStorage
      let keys = data.tasks.keysOfTasksArr;
      let values = data.tasks.valuesOfTasksArr; 
      if(keys){ //if the we dont have keys, its null, so we dont need to execute this.
        for (let i = 0; i < keys.length; i++) {
          let textArea = taskConstructorOBJ.generateContainer(); //we will append the container for that task and we will get back the paragraph
          textArea.setAttribute('id', keys[i]); //then we will append it own id that already had before
          textArea.innerHTML += values[i]; // and as the values and keys arrays have their same indexes, if for example, a task is in index 1 
        } //that means its values are in indexex 1 in both array
      }      
      
    },
    updateTask : function(id, updatedtask) { //when want to modify a existing task 
      let data = JSON.parse(localStorage.getItem('data')); //we get the data stored in our localStorage
      let keys = data.tasks.keysOfTasksArr;
      let values = data.tasks.valuesOfTasksArr; 
      let indexTaskToUpdate = keys.indexOf(id);  //we locate the index of the task to update in the values array
      values[indexTaskToUpdate] = updatedtask;  //then we assign the updatedtask in this index of the previous version of this task
      localStorage.setItem('data', JSON.stringify(data)); //then we override the current data object of storage with the updated version
    },

    checkDoneTask: function(id, checkedTask){ //when we check our tasks as done
      let data = JSON.parse(localStorage.getItem('data'));
      let keysCheckedTasks = data.checkedTasks.keysOfCheckedTasksArr;
      let valuesCheckedTasks = data.checkedTasks.valuesOfCheckedTasksArr; 
      let keysOfTasks = data.tasks.keysOfTasksArr;
      let valuesOfTasks = data.tasks.valuesOfTasksArr;

      for (let i in keysOfTasks) {
        if (keysOfTasks[i] == id) {
          keysOfTasks.splice(i, 1);
          valuesOfTasks.splice(i, 1);
          valuesCheckedTasks.push(checkedTask);
          keysCheckedTasks.push(id)
          break;
        }
      }
      localStorage.setItem('data', JSON.stringify(data));
    },
  }


//THIS IS THE OBJECT THAT MANAGES THE CONSTRUCTION OF EVERY SINGLE TASK: BASICALLY A CONSTRUCTOR  
taskConstructorOBJ = {
  generateTask: function (draftTask) { //this glues up all the things to create a task
    //if the inputform isn't empty
    if (draftTask) {
      //we generate the physical container of the task
      let TextArea = this.generateContainer();

      //we assign the task content to its innerHTML 
      TextArea.innerHTML += draftTask;
      // We create an unique id for the the new task
      let ID = this.generateID();
      //we set the id to that current task in order to use the localStorage API
      TextArea.setAttribute('id', ID);
      //then we use this to push the new task and its Id to the localStorage
      StorageOBJ.refreshStorage(ID, draftTask);
      draftTask = ''
    }
  },
  generateContainer: function () { //used to generate the div container of the task
    let spaceforTasks = document.getElementById("AreaTasks"); //we access to the Area task where we gonna put our container
    
    let ContainerForTextArea = this.generateContainerforTextArea(); //then we create the div for the paragraph
    let TextArea = this.generateTextArea(); //then we generate a paragraph that goes inside the div container
    let deleteButton = this.generateDeleteButton(); //we create the delete btn
    let ModifyButton = this.generateModifyButton(); //we create the modify btn
    let checkedButton = this.generateCheckedButton();
    //then we append everything
    ContainerForTextArea.appendChild(TextArea);
    ContainerForTextArea.appendChild(deleteButton);
    ContainerForTextArea.appendChild(ModifyButton);
    ContainerForTextArea.appendChild(checkedButton);
    //then we append the full new task to the area tasks 
    spaceforTasks.appendChild(ContainerForTextArea);
    return TextArea;

  },
  generateTextArea: function () { //just the paragraph for writing the task
    let TextArea = document.createElement('p');
    TextArea.setAttribute('class', 'taskContent');
    return TextArea;
  },
  generateContainerforTextArea: function () { //just the div for the paragraph
    let newSpace = document.createElement('div');
    newSpace.setAttribute('class', 'taskContainer');
    return newSpace;
  },
  generateDeleteButton: function () { //the delete btn 
    let btn = document.createElement('button');
    btn.setAttribute('class', 'DeleteButton icon-trash');
    btn.setAttribute('id', 'boton' + Math.floor(Math.random() * 1200)); //we assing a random id
    btn.onclick = function (eventOBj) { //a handler to manage the delete task event
      let TasksArea = document.getElementById('AreaTasks');
      let containerOfTaskToDelete = document.getElementById(eventOBj.target.id).parentElement;
      StorageOBJ.deleteTask(containerOfTaskToDelete);
      TasksArea.removeChild(containerOfTaskToDelete);
    }
    return btn;
  },
  generateModifyButton: function () { //just the modify btn
    let btn = document.createElement('button');
    btn.setAttribute('class', 'ModifyButton icon-pencil');
    btn.setAttribute('id', 'boton' + Math.floor(Math.random() * 1200));
    btn.onclick = function (eventOBj) {
      let EditTaskContainer = document.getElementById(eventOBj.target.id).parentElement;
      let EditableTask = EditTaskContainer.firstChild;
      EditableTask.setAttribute('contentEditable', 'true');
      EditableTask.focus();
      EditableTask.addEventListener('keyup', e => { 
        if(e.code === 'ArrowUp') {
          StorageOBJ.updateTask(EditableTask.id, EditableTask.innerHTML)
          EditableTask.contentEditable = false;
        }
      })
      
    }
    return btn;
  },
  generateCheckedButton: function(){
    let btn = document.createElement('button');
    btn.setAttribute('class', 'CheckedButton icon-check-2');
    btn.setAttribute('id', 'boton' + Math.floor(Math.random() * 1200));
    btn.onclick = function (eventOBj) {
      let CheckedTaskContainer = eventOBj.target.parentElement

      let id = CheckedTaskContainer.firstChild.id
      let task = CheckedTaskContainer.firstChild.innerHTML

      StorageOBJ.checkDoneTask(id, task)
      StorageOBJ.deleteTask(CheckedTaskContainer)
      let parentContainer = CheckedTaskContainer.parentElement;
      parentContainer.removeChild(CheckedTaskContainer);
    }
    return btn;
    
  },
  // getClickedTaskContainer: function() {
  //   addEventListener('click', (e) => {
  //     this.openTaskDetails(e.target)
  //   })
  // },
  // openTaskDetails: function(e) {
  //   let clickedContainer = e
    
  // },
  generateID: function () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  },
}


let taskDraftOBJ = { //this is the draft object
  generateTaskDraft : function() { //this method creates the draft container for the task draft
    let draftContainer = document.getElementById('draftContainer');
    draftContainer.hidden = false;
    let inputAreaForTaskContainer = document.getElementById('inputAreaTaskContainer')
    let submitBTN = document.getElementById('submitBtnInDraftContainer');
    let cancelBTN = document.getElementById('cancelSubmitBtnInDraftContainer');
    inputAreaForTaskContainer.focus(); //this method focuses the container to write something

    submitBTN.onclick = () => {
      if(inputAreaForTaskContainer.innerHTML){
      this.submitDraftTask(draftContainer, inputAreaTaskContainer);
      }
    }
    cancelBTN.onclick = () => {
      this.cancelDraftTask(draftContainer)
    }
  },
  submitDraftTask: function(draftContainer, inputAreaTaskContainer) {
    let draftTask = inputAreaTaskContainer.innerHTML;   //so we  take the task content
    draftContainer.hidden = true;
    if(!(draftTask.innerHTML === '')) {
      inputAreaTaskContainer.innerHTML = ''
      taskConstructorOBJ.generateTask(draftTask);  //and after deleting the draft container we add the real task container
    }
    
  },
  cancelDraftTask: function(draftContainer) {
    draftContainer.hidden = true;
  }
}

  //When the page fully loads, it will execute the main process with all the callings to the methods that encapsulates all the complexity
  mainProcess();