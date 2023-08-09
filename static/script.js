let userName=prompt('Enter your name','guest');
const scriptElement = document.createElement('script');

if(userName=='admin')
  scriptElement.src = '/static/admin.js';
else
  {
    const addButtonElements = document.getElementsByClassName('add-button');
    while (addButtonElements.length > 0) {
        addButtonElements[0].remove();
    }
    scriptElement.src = '/static/guest.js';
    scriptElement.setAttribute('data-username', userName); //send data to guest.js
}

document.head.appendChild(scriptElement)