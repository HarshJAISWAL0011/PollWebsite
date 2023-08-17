console.log("Guest");
// let baseURL = "http://localhost:8080";
let baseURL = "https://pollwebsites.onrender.com";

const submitBtn= document.getElementById('submitBtn');
const viewResult=document.getElementsByClassName('view-results')[0];
const addQuest=document.getElementsByClassName('add-button');
const commentSubmitBtn = document.getElementById('commentSubmitBtn');
const commentContainer = document.getElementById('comment-container');
 
const additionalFieldsContainer = document.getElementById("additionalFields");
const username  = document.currentScript.getAttribute('data-username');

//  addQuest.remove();

viewResult.addEventListener('click', () => {
    console.log("clicked");
    window.location.href = '/static/result.html';
   
  });
  
  commentSubmitBtn.addEventListener('click', () => {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    let commentObj={};
    commentObj.comment = commentText;
    commentObj.name=username;

    if (commentText !== '') {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.classList.add('user-comment');
        commentDiv.textContent = commentText;

        commentContainer.appendChild(commentDiv);
        commentInput.value = ''; // Clear the input field

        //send to backend server
        fetch(baseURL+'/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentObj), // Convert the data object to a JSON string
        })
        .then(response => response.json())
        .then(data => {
          console.log('Server response:', data);
        })
        .catch(error => console.error('Error:', error));
        
  
    }
});

submitBtn.addEventListener('click', () => {
    const radioGroups = document.querySelectorAll('input[type="radio"]');
    let grpList = new Set();
    grpList=allRadioGroups();
   
    let allSelected = true;
  
    for(let grpName of grpList) {
      console.log("inside group list"+grpName);
      if(document.querySelectorAll(`input[type="radio"][name="${grpName}"]:checked`).length < 1){
        allSelected = false;
        break;
      }
    }
      let data={};
      let dataNo=1;
      if (allSelected==true) {
      
        const dynamicContainers = document.querySelectorAll('.contain');
      
        dynamicContainers.forEach(container => {
            // Get text from the text box
            // const textBox = container.querySelector('.dynamic-textbox');
            // const textBoxValue = textBox.value;
  
            const radioContainer=container.querySelector('.dynamic-radio-container');
            let curr_grpName = radioContainer.querySelectorAll('input[type="radio"]')[0].name;
            console.log("radio grp name ="+curr_grpName);
            
            const radioInputs = document.querySelectorAll(`input[type="radio"][name="${curr_grpName}"]`);
            const selectedValue = Array.from(radioInputs).find(input => input.checked)?.value || null;
            
            console.log(`Group: ${curr_grpName}, Selected Value: ${selectedValue}`);
    
            // Iterate through all radio inputs within the group
  
            let obj={
              // Question: textBoxValue
            }
            console.log("final obj="+JSON.stringify(obj));
            radioInputs.forEach((input,index) => {
                console.log(`Group: ${curr_grpName}, Option: ${input.value}, Selected: ${input.checked}`);
  
                // arrOptions[arrOptions.length]=input.value;
                if(input.checked)
                obj['selected']=index;
               
            });
            // obj['options']=arrOptions;
            data[dataNo] = obj;
            dataNo++;
  
        });
        
 
   
        
        fetch(baseURL+'/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data), // Convert the data object to a JSON string
        })
        .then(response => response.json())
        .then(data => {
          console.log('Server response:', data);
          // Redirect to another HTML page
         window.location.href = "/static/thankyou.html";
         window.history.replaceState(null, "", "another-page.html");

        })
        .catch(error => console.error('Error:', error));
        
  
    }else{
        alert('Please fill all answers');
    }
  });


fetch(baseURL+'/result', {
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', JSON.stringify(data));
        let dataObj=data;
        for(const id in dataObj){
          populateContainer(dataObj[id].question, dataObj[id].options);
        }


      })
      .catch(error => console.error('Error:', error));


 fetch(baseURL+'/comments', {
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        
        data.forEach(obj => populateComments( obj.comment,obj.name));
       


      })
      .catch(error => console.error('Error:', error));


function populateContainer(quest,options) {
  
   // Used to add margin to the items to look seperated 
   const container = document.createElement("div");
   container.className = "contain";
 
   // Question text field
   const newTextField = document.createElement("h3");
 
   newTextField.textContent=quest;
   newTextField.className = "heading";
   
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

function allRadioGroups() {
    const radioGroups = document.querySelectorAll('input[type="radio"]');
    const uniqueGroups = new Set();
  
    // Iterate through each selected radio button
    radioGroups.forEach(radio => {
        uniqueGroups.add(radio.name);
        console.log(radio.name);
    });
  
    console.log("uniq grp="+Array.from(uniqueGroups));
  
    return uniqueGroups;
  }
  
function populateComments(commentText , name){
  
  
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';
      commentDiv.textContent = commentText;


      const nameDiv = document.createElement('div');
      nameDiv.className = 'senderName';
      nameDiv.textContent = name;

      commentContainer.appendChild(nameDiv);
      commentContainer.appendChild(commentDiv);

     

}
