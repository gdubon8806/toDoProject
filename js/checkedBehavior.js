  //When the page fully loads, it will execute the main process with all the callings to the methods that encapsulates all the complexity
  window.addEventListener('load', () => {
    mainProcess();
  });

  //Main function
  function mainProcess() {
    //Just calling some methods inside the mainProcess to hook up all the things
    StorageOBJ.getTasks();
    secundaryProcessesOBJ.displayMenu();
  }

  //THIS IS THE OBJECT THAT MANAGES ALL SECUNDARY PROCESSES
  secundaryProcessesOBJ = {
    displayMenu: function () { //small function i use to display or hide the menu
      let menuContainer = document.getElementById('menuContainer');
      let menuBtn = document.getElementById('menuBtn')
      menuBtn.addEventListener('click', () => {
        menuContainer.hidden = menuContainer.hidden ? false : true;
      });
    },
  }

  StorageOBJ = {
    getTasks: function() { //this recovers the data, iterating over the keys array
      let data = JSON.parse(localStorage.getItem('data')); //we get the data stored in our localStorage

      let keys = data.checkedTasks.keysOfCheckedTasksArr;
      console.log(keys)
      let values = data.checkedTasks.valuesOfCheckedTasksArr; 
      console.log(values)
      if(keys){ //if the we dont have keys, its null, so we dont need to execute this.
        for (let i = 0; i < keys.length; i++) {
          let textArea = taskConstructorOBJ.generateContainer(); //we will append the container for that task and we will get back the paragraph
          textArea.setAttribute('id', keys[i]); //then we will append it own id that already had before
          textArea.innerHTML += values[i]; // and as the values and keys arrays have their same indexes, if for example, a task is in index 1 
        } //that means its values are in indexex 1 in both array
      }      
      
    }
  }


//THIS IS THE OBJECT THAT MANAGES THE CONSTRUCTION OF EVERY SINGLE TASK: BASICALLY A CONSTRUCTOR  
taskConstructorOBJ = {
  generateContainer: function () { //used to generate the div container of the task
    let spaceforTasks = document.getElementById("AreaTasks"); //we access to the Area task where we gonna put our container
    
    let ContainerForTextArea = this.generateContainerforTextArea(); //then we create the div for the paragraph
    let TextArea = this.generateTextArea(); //then we generate a paragraph that goes inside the div container
    //then we append everything
    ContainerForTextArea.appendChild(TextArea);
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
 
}













