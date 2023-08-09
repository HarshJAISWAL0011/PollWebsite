console.log("Admin Pannel");
// let baseURL = "http://localhost:8080";
let baseURL = "https://main--rainbow-moonbeam-7c6881.netlify.app";


const submitBtn= document.getElementById('submitBtn');
const loader= document.getElementsByClassName('loader');
const viewResult=document.getElementsByClassName('view-results')[0];
const additionalFieldsContainer = document.getElementById("additionalFields");
const addBtn = document.getElementById("addBtn");


// const newRadioContainer = document.createElement("Button");
// newRadioContainer.id = "addBtn";

 

viewResult.addEventListener('click', () => {
  console.log("clicked");
  window.location.href = '/static/result.html';
 
});



submitBtn.addEventListener('click', () => {
  const radioGroups = document.querySelectorAll('input[type="radio"]');
  let grpList = new Set();
 
    let data={};
    let dataNo=1;
 
    
      const dynamicContainers = document.querySelectorAll('.contain');
    
      dynamicContainers.forEach(container => {
          // Get text from the text box
          const textBox = container.querySelector('.dynamic-textbox');
          const textBoxValue = textBox.value;

          const radioContainer=container.querySelector('.dynamic-radio-container');
          let curr_grpName = radioContainer.querySelectorAll('input[type="radio"]')[0].name;
          console.log("radio grp name ="+curr_grpName);
          
          const radioInputs = document.querySelectorAll(`input[type="radio"][name="${curr_grpName}"]`);
          const selectedValue = Array.from(radioInputs).find(input => input.checked)?.value || null;
          
          console.log(`Group: ${curr_grpName}, Selected Value: ${selectedValue}`);
  
          // Iterate through all radio inputs within the group

          let obj={
            Question: textBoxValue
          }
          console.log("final obj="+JSON.stringify(obj));
          let arrOptions=[];
          radioInputs.forEach((input) => {
              console.log(`Group: ${curr_grpName}, Option: ${input.value}, Selected: ${input.checked}`);

              arrOptions[arrOptions.length]=input.value;
              
             
          });
          obj['options']=arrOptions;
          data[dataNo] = obj;

          console.log("final obj="+JSON.stringify(data));
          dataNo++;

      });
      
      
      console.log('submit ');
      
      fetch(baseURL+'/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Convert the data object to a JSON string
      })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);
        alert('Poll has been creaed');
      })
      .catch(error => console.error('Error:', error));
      

 
 
});


 

function setResult(resultSection) {
  fetch(baseURL+'/result', {
    method: 'GET',
   
  })
  .then(response => response.json()) // Parse the response as JSON
  .then(data => {
    console.log('Server response:', data);
    resultSection.innerHTML = JSON.stringify(data); // Set the result to the inner HTML of the resultSection
  })
  .catch(error => console.error('Error:', error));

   
}


addBtn.addEventListener("click", () => {
  // Used to add margin to the items to look seperated 
  const container = document.createElement("div");
  container.className = "contain";

  // Question text field
  const newTextField = document.createElement("input");
  newTextField.type = "text";
  newTextField.className = "dynamic-textbox";
  
  //Radio Container
  const newRadioContainer = document.createElement("div");
  newRadioContainer.className = "dynamic-radio-container";

  const addNewBox = document.createElement("button");
  addNewBox.textContent = "Add Option";
  addNewBox.className = "add-option-button";
  let grpName=generateRandomName();

  // New option text box
  addNewBox.addEventListener("click", () => {
      // Create the optionText input to get value for options
      const optionText = document.createElement("input");
      optionText.type = "text";
      optionText.className = "input-option-text";
      container.appendChild(optionText);

      // listen if enter is pressed
      optionText.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          let opt=optionText.value;
            optionText.remove();

            // Dynamically create the radio option
            const radioLabel = document.createElement("label");
            radioLabel.className = "option";
            
            const radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = grpName;
            radioInput.value = opt;
            
            const radioSpan = document.createElement("span");
            radioSpan.className = "checkmark";
            
            radioLabel.appendChild(radioInput);
            radioLabel.appendChild(radioSpan);
            radioLabel.appendChild(document.createTextNode(opt.charAt(0).toUpperCase() + opt.slice(1)));
            
            newRadioContainer.appendChild(radioLabel);

        }
    });

  });

  container.appendChild(newTextField);
  container.appendChild(newRadioContainer);
  container.appendChild(addNewBox);
  
  additionalFieldsContainer.appendChild(container);
});

function generateRandomName() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let randomName = '';

  for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      const randomLetter = letters[randomIndex];
      randomName += randomLetter;
  }

  return randomName;
}


//Intially populate
fetch(baseURL+'/result', {
  method: 'GET',
})
.then(response => response.json())
.then(data => {
  console.log('Server response:', data);
  let dataObj=data;
  for(const id in dataObj){
    populateContainer(dataObj[id].question, dataObj[id].options);
  }


})
.catch(error => console.error('Error:', error));


function populateContainer(quest,options) {

// Used to add margin to the items to look seperated 
const container = document.createElement("div");
container.className = "contain";

// Question text field
const newTextField = document.createElement("input");

newTextField.type="text";
newTextField.value=quest
newTextField.className = "dynamic-textbox";

//Radio Container
const newRadioContainer = document.createElement("div");
newRadioContainer.className = "dynamic-radio-container";

let grpName=generateRandomName();

// New option text box
options.forEach(element => {

     let opt=element.desc; 
       // Dynamically create the radio option
       const radioLabel = document.createElement("label");
       radioLabel.className = "option";
       
       const radioInput = document.createElement("input");
       radioInput.type = "radio";
       radioInput.name = grpName;
       radioInput.value = opt;
       
       const radioSpan = document.createElement("span");
       radioSpan.className = "checkmark";
       
       radioLabel.appendChild(radioInput);
       radioLabel.appendChild(radioSpan);
       radioLabel.appendChild(document.createTextNode(opt.charAt(0).toUpperCase() + opt.slice(1)));
       
       newRadioContainer.appendChild(radioLabel);

 

});

container.appendChild(newTextField);
container.appendChild(newRadioContainer);


additionalFieldsContainer.appendChild(container);
}