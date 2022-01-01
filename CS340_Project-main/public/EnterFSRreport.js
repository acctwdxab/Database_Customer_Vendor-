document.addEventListener('DOMContentLoaded', insertOne);	  
document.getElementById('search-button').addEventListener('click', loadFilteredEntries);

function insertOne(){
    document.getElementById('post-button').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var salesOrderNumber = document.getElementById('salesorder-input').value;
	  var employeeID = document.getElementById('employeeID-input').value;		 
      if (salesOrderNumber == "" || employeeID == "") {
		window.alert("field can not be empty.");
		return;
	  }
      req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/insert_Field_Service_Report?salesOrderNumber='+salesOrderNumber+'&employeeID='+employeeID, true);
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
	document.getElementById('fsrList').addEventListener('click', function(event){
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
	  var salesOrderNumber = document.getElementById('input'+id+2).value;
	  var employeeID  = document.getElementById('input'+id+3).value;
	  	  
      req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/update_Field_Service_Report?reportID='+id+'&salesOrderNumber='+salesOrderNumber+'&employeeID='+employeeID, true);
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
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/delete_Field_Service_Report?reportID='+id, true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			var tableBody = document.getElementById('fsrListBody')
			var targetRow = document.getElementById('TR'+id);
			tableBody.removeChild(targetRow);
		} else {
			console.log("Error in network request: " + req.statusText);
		}});
	  req.send(null);			  

}

function addEntry(id){
	  var req = new XMLHttpRequest();
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/get_one_Field_Service_Report?reportID='+id, true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
                	var response = JSON.parse(JSON.parse(req.responseText).results);			  
			var table = document.getElementById('fsrList')
			var tableBody = document.getElementById('fsrListBody')

			for(var i = 0; i < response.length; i++){	
				var newRow = document.createElement('tr');	
				newRow.id = 'TR' + (response[i].reportID)
				for(var j = 0; j < 5; j++){		
					var newItem = document.createElement('td');
					newItem.id = 'TD' + (response[i].reportID) + (j+1);
					switch(j){
						case 0:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','number');
							newInput.id = 'input' + (response[i].reportID) + (j+1);
							newInput.value = response[i].reportID;
							break;
						case 1:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].reportID) + (j+1);
							newInput.value = response[i].salesOrderNumber;
							break;
						case 2:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].reportID) + (j+1);
							newInput.value = response[i].employeeID;
							break;											
						case 3:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'update-' + (response[i].reportID) + '-' + (j+1);
							newInput.value = 'update';
							break;
						case 4:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'delete-' + (response[i].reportID) + '-'+ (j+1);
							newInput.value = 'delete';
					}
					newItem.appendChild(newInput);
					newRow.appendChild(newItem);
				}	
				tableBody.appendChild(newRow);	
			}

			for (var i=0; i < response.length; i++){
				console.log(response[i].reportID + ", " + response[i].salesOrderNumber+ ", " + response[i].employeeID );
			}
		} else {
			console.log("Error in network request: " + req.statusText);
		}});

	  req.send(null);	  

}

function loadEntry(){
	  var req = new XMLHttpRequest();
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/Field_Service_Report', true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
                	var response = JSON.parse(JSON.parse(req.responseText).results);			  
			var table = document.getElementById('fsrList')
			var tableBody = document.getElementById('fsrListBody')

			for(var i = 0; i < response.length; i++){	
				var newRow = document.createElement('tr');	
				newRow.id = 'TR' + (response[i].reportID)
				for(var j = 0; j < 5; j++){		
					var newItem = document.createElement('td');
					newItem.id = 'TD' + (response[i].reportID) + (j+1);
					switch(j){
						case 0:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','number');
							newInput.id = 'input' + (response[i].reportID) + (j+1);
							newInput.value = response[i].reportID;
							break;
						case 1:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].reportID) + (j+1);
							newInput.value = response[i].salesOrderNumber 
							break;
						case 2:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].reportID) + (j+1);
							newInput.value = response[i].employeeID ;
							break;						
						case 3:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'update-' + (response[i].reportID) + '-' + (j+1);
							newInput.value = 'update';
							break;
						case 4:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'delete-' + (response[i].reportID) + '-'+ (j+1);
							newInput.value = 'delete';
					}
					newItem.appendChild(newInput);
					newRow.appendChild(newItem);
				}	
				tableBody.appendChild(newRow);	
			}

			for (var i=0; i < response.length; i++){
				console.log(response[i].reportID + ", " + response[i].salesOrderNumber + ", " + response[i].employeeID);
			}
		} else {
			console.log("Error in network request: " + req.statusText);
		}});

	  req.send(null);	
}

function loadFilteredEntries(){
	var searchKey = document.getElementById('search-key').value;
	var tableBody = document.getElementById('fsrListBody')
	tableBody.innerHTML = "";
	if (searchKey == "") {
		loadEntry();
	}	else {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/Field_Service_Report_Filtered?searchKey='+searchKey, true);
		req.addEventListener('load',function() {
			if(req.status >= 200 && req.status < 400){
				var response = JSON.parse(JSON.parse(req.responseText).results);		
				console.log('response is', response);	  

				for(var i = 0; i < response.length; i++){	
					var newRow = document.createElement('tr');	
					newRow.id = 'TR' + (response[i].reportID)
					for(var j = 0; j < 5; j++){		
						var newItem = document.createElement('td');
						newItem.id = 'TD' + (response[i].reportID) + (j+1);
						switch(j){
							case 0:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','number');
								newInput.id = 'input' + (response[i].reportID) + (j+1);
								newInput.value = response[i].reportID;
								break;
							case 1:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].reportID) + (j+1);
								newInput.value = response[i].salesOrderNumber 
								break;
							case 2:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].reportID) + (j+1);
								newInput.value = response[i].employeeID ;
								break;						
							case 3:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','button');
								newInput.id = 'update-' + (response[i].reportID) + '-' + (j+1);
								newInput.value = 'update';
								break;
							case 4:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','button');
								newInput.id = 'delete-' + (response[i].reportID) + '-'+ (j+1);
								newInput.value = 'delete';
						}
						newItem.appendChild(newInput);
						newRow.appendChild(newItem);
					}	
					tableBody.appendChild(newRow);	
				}
	
				for (var i=0; i < response.length; i++){
					console.log(response[i].reportID + ", " + response[i].salesOrderNumber + ", " + response[i].employeeID);
				}

		} else {
			console.log("Error in network request: " + req.statusText);
		}});
	
		req.send(null);	
	}

}

loadEntry();
