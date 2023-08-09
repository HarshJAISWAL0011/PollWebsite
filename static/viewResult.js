const additionalFieldsContainer = document.getElementById("additionalFields");
// let baseURL="http://localhost:8080";
let baseURL = "https://main--rainbow-moonbeam-7c6881.netlify.app";


fetch(baseURL+'/result', {
  method: 'GET',
})
.then(response => response.json())
.then(data => {
  console.log('Server response:', data);
  let dataObj = data;
 
  let totalCount=0;
  dataObj["1"].options.forEach((option)=> {
    totalCount+=option.count;
});

  if (totalCount==0)
  totalCount=1;

  for (const id in dataObj) {
    populateContainer(dataObj[id].question, dataObj[id].options,totalCount);
  }
})
.catch(error => console.error('Error:', error));

function populateContainer(question, options,totalCount) {
    const container = document.createElement("div");
    container.className = "container";
  
    const newTextField = document.createElement("h3");
    newTextField.textContent = question;
    newTextField.className = "dynamic-textbox";
  
    const newRadioContainer = document.createElement("div");
    newRadioContainer.className = "dynamic-radio-container";
  
    // let totalCount = options.reduce((sum, option) => sum + option.count, 0);


  
    options.forEach(element => {
      let opt = element.desc;
      let count = element.count;
  
      const radioLabel = document.createElement("label");
      radioLabel.className = "option";
  
      const radioSpan = document.createElement("span");
      radioSpan.className = "checkmark";
  
      const progressBarContainer = document.createElement("div");
      progressBarContainer.className = "progress-bar";
      
      const progressBarFiller = document.createElement("div");
      progressBarFiller.className = "filler";
      progressBarFiller.style.width = `${(count / totalCount) * 100}%`;
     
      const optionLabel = document.createElement("span");
      optionLabel.className = "option-label";
      optionLabel.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
  
      radioLabel.appendChild(radioSpan);
      radioLabel.appendChild(optionLabel);

      progressBarContainer.appendChild(progressBarFiller);
      radioLabel.appendChild(progressBarContainer);
     
  
      newRadioContainer.appendChild(radioLabel);
    });
  
    container.appendChild(newTextField);
    container.appendChild(newRadioContainer);
  
    additionalFieldsContainer.appendChild(container);
  }
  

 

