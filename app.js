const express = require('express');
const fs = require('fs');
const cors = require('cors');
const  path   = require('path');
const app = express();
var port=8080;

app.use(express.static('static'));
app.use(express.json());
app.use(cors());

let pathIndex = path.join(__dirname,'./index.html');
app.get('/', (req, res) => {
res.render(pathIndex);
});

app.post('/submit', (req, res) => {
    console.log(req.body);
    updatePollResponse(req.body);
   
    res.send(JSON.stringify({res: "OK"}));
    });

app.get('/result', (req, res) => {
        viewPollResults((data)=>{
        res.send(JSON.stringify(data));

        });
    });

app.get('/comments', (req, res) => {
      getComments((data)=>{
      res.send(JSON.stringify(data));

      });
  });    

app.post('/update', (req, res) => {
      console.log(`update server  ${JSON.stringify(req.body)}`);
      updateQuestions(req.body);
      res.send(JSON.stringify({res: "OK"}));

    }) 

app.post('/comments', (req, res) => {
      console.log(`comment on server  ${JSON.stringify(req.body)}`);
      addComments(req.body);
      res.send(JSON.stringify({res: "OK"}));

    }) 

    const pollResultsFilePath = path.join(__dirname, 'poll_results.json');

function addComments(response){
  fs.readFile(pollResultsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading poll results:', err);
    } else {
      try {
        const allData = JSON.parse(data);
        let comments = allData.comments;

        if(!comments) // if no comments
        allData.comments = [];
       
        allData.comments.push(response);
        console.log(JSON.stringify(allData));
        savePollResults(allData);
       
      } catch (err) {
        console.error('Error parsing JSON data:', err);
      }
    }
  });
    }

 function savePollResults(results) {
  const json = JSON.stringify(results, null, 2);

  fs.writeFile(pollResultsFilePath, json, (err) => {
    if (err) {
      console.error('Error saving poll results:', err);
    } else {
      console.log('Poll results saved successfully.');
    }
  });
}

function updateQuestions(newResult) {

      try {
          let storeData={"form":{}};
         
        for (let id in newResult) {
         
          let opt=[];
          storeData.form[id]={};
          const result = newResult[id];
          storeData.form[id].question=result.Question;
          
         result.options.forEach( (element, index) => {  //store all options
          let temp={
            "desc": element,
            "count": 0
          }

          opt[index]=temp;
          
         });  
         storeData.form[id].options=opt; // form queston and save in id
        //  console.log(`values are ${JSON.stringify(result)}   ---${JSON.stringify(storeData)}`);

        }

        
        savePollResults(storeData);
      } catch (err) {
        console.error('Error parsing JSON data:', err);
      }
    
 
}

function viewPollResults(callback) {
  fs.readFile(pollResultsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading poll results:', err);
    } else {
      try {
        data=JSON.parse(data);
        let pollResults={};
        console.log("data form"+JSON.stringify(data.form));
        if(data.form)
          pollResults = (data.form);
        callback(pollResults);
      } catch (err) {
        console.error('Error parsing JSON data:', err);
      }
    }
  });
}

function getComments(callback) {
  fs.readFile(pollResultsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading poll results:', err);
    } else {
      try {
        data = JSON.parse(data);
        let comments=[];
        console.log(data.comments);

        if(data.comments) 
         comments = (data.comments);
        
         callback(comments);
      } catch (err) {
        console.error('Error parsing JSON data:', err);
      }
    }
  });
}

function updatePollResponse(newResult) {
 
  fs.readFile(pollResultsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading poll results:', err);
    } else {
      try {
          let storedData=JSON.parse(data);
        for (const id in newResult) {
          const result = newResult[id];
          const selectedOptionIndex = result.selected;
         
          storedData.form[id].options[selectedOptionIndex].count++;
        //  console.log(`values are ${JSON.stringify(result)}  ${selectedOptionIndex} =  ---${JSON.stringify(storedData)}`);

        }

        
        savePollResults(storedData);
      } catch (err) {
        console.error('Error parsing JSON data:', err);
      }
    }
  });
}


app.listen(port,()=> {
 console.log('App is listening on port '+port);   
});
