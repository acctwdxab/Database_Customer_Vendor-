document.addEventListener('DOMContentLoaded', insertOne);	  
document.getElementById('search-button').addEventListener('click', loadFilteredEntries);

function insertOne(){
    document.getElementById('post-button').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var supervisorID = document.getElementById('supervisorID-input').value;
	  var department = document.getElementById('department-input').value;
	  var jobTitle = document.getElementById('jobTitle-input').value;	 
      if (supervisorID == "" || department == "" || jobTitle == "") {
		window.alert("field can not be empty.");
		return;
	  }
      req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/insert_Field_Service_Engineer?supervisorID='+supervisorID+'&department='+department+'&jobTitle='+jobTitle, true);
      req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
            var response = req.responseText;			  
			console.log(JSON.stringify(response,undefined,2));
			addEntry(response.split(':')[1]);
		} else {
			console.log("Error in network request: " + req.statusText);
		}});

	  req.send(null);			  
      document.getElementsByName("post-form")[0].reset();
    })
	document.getElementById('jobList').addEventListener('click', function(event){
	var target = event.target;
	if(target.id.includes('update')){
		id = target.id.split('-')[1];
                updateEntry(id);
	}
	if(target.id.includes('delete')){
		id = target.id.split('-')[1];
		deleteEntry(id);
	}
    })
}

function updateEntry(id){
	  var req = new XMLHttpRequest();
	  var email = document.getElementById('input'+id+2).value;
	  var entityName = document.getElementById('input'+id+3).value;
	  var location = document.getElementById('input'+id+4).value;
	  
      req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/update_Field_Service_Engineer?employeeID='+id+'&email='+email+'&entityName='+entityName+'&location='+location, true);
      req.addEventListener('load',function(){
	   if(req.status >= 200 && req.status < 400){
             console.log("update complete");
		} else {
			console.log("Error in network request: " + req.statusText);
		}});
	  req.send(null);			  
}

function deleteEntry(id){
	  var req = new XMLHttpRequest();
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/delete_Field_Service_Engineer?employeeID='+id, true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			var tableBody = document.getElementById('jobListBody')
			var targetRow = document.getElementById('TR'+id);
			tableBody.removeChild(targetRow);
		} else {
			console.log("Error in network request: " + req.statusText);
		}});
	  req.send(null);			  

}

function addEntry(id){
	  var req = new XMLHttpRequest();
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/get_one_Field_Service_Engineer?employeeID='+id, true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
                	var response = JSON.parse(JSON.parse(req.responseText).results);			  
			var table = document.getElementById('jobList')
			var tableBody = document.getElementById('jobListBody')

			for(var i = 0; i < response.length; i++){	
				var newRow = document.createElement('tr');	
				newRow.id = 'TR' + (response[i].employeeID)
				for(var j = 0; j < 6; j++){		
					var newItem = document.createElement('td');
					newItem.id = 'TD' + (response[i].employeeID) + (j+1);
					switch(j){
						case 0:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','number');
							newInput.id = 'input' + (response[i].employeeID) + (j+1);
							newInput.value = response[i].employeeID;
							break;
						case 1:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].employeeID) + (j+1);
							newInput.value = response[i].supervisorID ;
							break;
						case 2:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].employeeID) + (j+1);
							newInput.value = response[i].department ;
							break;
						case 3:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].employeeID) + (j+1);
							newInput.value = response[i].jobTitle ;
							break;						
						case 4:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'update-' + (response[i].employeeID) + '-' + (j+1);
							newInput.value = 'update';
							break;
						case 5:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'delete-' + (response[i].employeeID) + '-'+ (j+1);
							newInput.value = 'delete';
					}
					newItem.appendChild(newInput);
					newRow.appendChild(newItem);
				}	
				tableBody.appendChild(newRow);	
			}

			for (var i=0; i < response.length; i++){
				console.log(response[i].employeeID + ", " + response[i].supervisorID + ", " + response[i].department + ", " + response[i].jobTitle );
			}
		} else {
			console.log("Error in network request: " + req.statusText);
		}});

	  req.send(null);	  

}

function loadEntry(){
	  var req = new XMLHttpRequest();
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/Field_Service_Engineer', true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
                	var response = JSON.parse(JSON.parse(req.responseText).results);			  
			var table = document.getElementById('jobList')
			var tableBody = document.getElementById('jobListBody')

			for(var i = 0; i < response.length; i++){	
				var newRow = document.createElement('tr');	
				newRow.id = 'TR' + (response[i].employeeID)
				for(var j = 0; j < 6; j++){		
					var newItem = document.createElement('td');
					newItem.id = 'TD' + (response[i].employeeID) + (j+1);
					switch(j){
						case 0:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','number');
							newInput.id = 'input' + (response[i].employeeID) + (j+1);
							newInput.value = response[i].employeeID;
							break;
						case 1:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].employeeID) + (j+1);
							newInput.value = response[i].supervisorID ;
							break;
						case 2:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].employeeID) + (j+1);
							newInput.value = response[i].department ;
							break;
						case 3:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].employeeID) + (j+1);
							newInput.value = response[i].jobTitle ;
							break;						
						case 4:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'update-' + (response[i].employeeID) + '-' + (j+1);
							newInput.value = 'update';
							break;
						case 5:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'delete-' + (response[i].employeeID) + '-'+ (j+1);
							newInput.value = 'delete';
					}
					newItem.appendChild(newInput);
					newRow.appendChild(newItem);
				}	
				tableBody.appendChild(newRow);	
			}

			for (var i=0; i < response.length; i++){
				console.log(response[i].employeeID + ", " + response[i].supervisorID + ", " + response[i].department + ", " + response[i].jobTitle );
			}
		} else {
			console.log("Error in network request: " + req.statusText);
		}});

	  req.send(null);	
}


function loadFilteredEntries(){
	var searchKey = document.getElementById('search-key').value;
	var tableBody = document.getElementById('jobListBody')
	tableBody.innerHTML = "";
	if (searchKey == "") {
		loadEntry();
	}	else {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/Field_Service_Engineer_Filtered?searchKey='+searchKey, true);
		req.addEventListener('load',function() {
			if(req.status >= 200 && req.status < 400){
				var response = JSON.parse(JSON.parse(req.responseText).results);		
				console.log('response is', response);	  


				for(var i = 0; i < response.length; i++){	
					var newRow = document.createElement('tr');	
					newRow.id = 'TR' + (response[i].employeeID)
					for(var j = 0; j < 6; j++){		
						var newItem = document.createElement('td');
						newItem.id = 'TD' + (response[i].employeeID) + (j+1);
						switch(j){
							case 0:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','number');
								newInput.id = 'input' + (response[i].employeeID) + (j+1);
								newInput.value = response[i].employeeID;
								break;
							case 1:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].employeeID) + (j+1);
								newInput.value = response[i].supervisorID ;
								break;
							case 2:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].employeeID) + (j+1);
								newInput.value = response[i].department ;
								break;
							case 3:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].employeeID) + (j+1);
								newInput.value = response[i].jobTitle ;
								break;						
							case 4:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','button');
								newInput.id = 'update-' + (response[i].employeeID) + '-' + (j+1);
								newInput.value = 'update';
								break;
							case 5:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','button');
								newInput.id = 'delete-' + (response[i].employeeID) + '-'+ (j+1);
								newInput.value = 'delete';
						}
						newItem.appendChild(newInput);
						newRow.appendChild(newItem);
					}	
					tableBody.appendChild(newRow);	
				}
	
				for (var i=0; i < response.length; i++){
					console.log(response[i].employeeID + ", " + response[i].supervisorID + ", " + response[i].department + ", " + response[i].jobTitle );
				}

		} else {
			console.log("Error in network request: " + req.statusText);
		}});
	
		req.send(null);	
	}

}

loadEntry();
