document.addEventListener('DOMContentLoaded', insertOne);	  
document.getElementById('search-button').addEventListener('click', loadFilteredEntries);

function insertOne(){
    document.getElementById('post-button').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var customerID = document.getElementById('name-input').value;
	  var purchaseOrderNumber = document.getElementById('PO-input').value;
	  var completed = document.getElementById('completed-input0').value;
	  var serviceType = document.getElementById('servicetype-input').value;
	  var dollarAmount = document.getElementById('dollar-input').value;
	  var location = document.getElementById('location-input').value;
	  var employeeID = document.getElementById('employeeID-input').value;
	   
      if (customerID == "" || purchaseOrderNumber == "" || completed == "" || serviceType == "" || dollarAmount == "" || location == "") {
		window.alert("field can not be empty.");
		return;
	  }
      req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/insert_Contract_Sales_Order?customerID='+customerID+'&purchaseOrderNumber='+purchaseOrderNumber+'&completed='+completed+'&serviceType='+serviceType+'&dollarAmount='+dollarAmount+'&location='+location, true);
      req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
            var response = req.responseText;			  
			console.log(JSON.stringify(response,undefined,2));
			addEntry(response.split(':')[1]);
			
			//update filed service report
			var salesOrderNumber = response.split(':')[1];
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
			  
		} else {
			console.log("Error in network request: " + req.statusText);
		}});

	  req.send(null);
	  
    })
	document.getElementById('salesorderList').addEventListener('click', function(event){
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
	  var customerID = document.getElementById('input'+id+2).value;
	  var purchaseOrderNumber = document.getElementById('input'+id+3).value;
	  var completed = document.getElementById('input'+id+4).value;
	  var serviceType = document.getElementById('input'+id+5).value;
	  var dollarAmount = document.getElementById('input'+id+6).value;
	  var location = document.getElementById('input'+id+7).value;
	  
      req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/update_Contract_Sales_Order?salesOrderNumber='+id+'&customerID='+customerID+'&purchaseOrderNumber='+purchaseOrderNumber+'&completed='+completed+'&serviceType='+serviceType+'&dollarAmount='+dollarAmount+'&location='+location, true);
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
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/delete_Contract_Sales_Order?salesOrderNumber='+id, true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			var tableBody = document.getElementById('salesorderListBody')
			var targetRow = document.getElementById('TR'+id);
			tableBody.removeChild(targetRow);
		} else {
			console.log("Error in network request: " + req.statusText);
		}});
	  req.send(null);			  

}

function addEntry(id){
	  var req = new XMLHttpRequest();
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/get_one_Contract_Sales_Order?salesOrderNumber='+id, true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
                	var response = JSON.parse(JSON.parse(req.responseText).results);			  
			var table = document.getElementById('salesorderList')
			var tableBody = document.getElementById('salesorderListBody')

			for(var i = 0; i < response.length; i++){	
				var newRow = document.createElement('tr');	
				newRow.id = 'TR' + (response[i].salesOrderNumber)
				for(var j = 0; j < 9; j++){		
					var newItem = document.createElement('td');
					newItem.id = 'TD' + (response[i].salesOrderNumber) + (j+1);
					switch(j){
						case 0:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','number');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].salesOrderNumber;
							break;
						case 1:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].customerID;
							break;
						case 2:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].purchaseOrderNumber;
							break;
						case 3:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].completed;
							break;
						case 4:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].serviceType;
							break;	
						case 5:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].dollarAmount;
							break;	
						case 6:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].location;
							break;		
						case 7:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'update-' + (response[i].salesOrderNumber) + '-' + (j+1);
							newInput.value = 'update';
							break;
						case 8:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'delete-' + (response[i].salesOrderNumber) + '-'+ (j+1);
							newInput.value = 'delete';
					}
					newItem.appendChild(newInput);
					newRow.appendChild(newItem);
				}	
				tableBody.appendChild(newRow);	
			}

			for (var i=0; i < response.length; i++){
				console.log(response[i].salesOrderNumber + ", " + response[i].customerID + ", " + response[i].purchaseOrderNumber + ", " + response[i].completed + ", " + response[i].serviceType   + ", " + response[i].dollarAmount    + ", " + response[i].location);
			}
		} else {
			console.log("Error in network request: " + req.statusText);
		}});

	  req.send(null);	  

}

function loadEntry(){
				
	var req = new XMLHttpRequest();
	req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/Contract_Sales_Order', true);
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
                	var response = JSON.parse(JSON.parse(req.responseText).results);			  
			var table = document.getElementById('salesorderList')
			var tableBody = document.getElementById('salesorderListBody')

			for(var i = 0; i < response.length; i++){	
				var newRow = document.createElement('tr');	
				newRow.id = 'TR' + (response[i].salesOrderNumber)
				for(var j = 0; j < 9; j++){		
					var newItem = document.createElement('td');
					newItem.id = 'TD' + (response[i].salesOrderNumber) + (j+1);
					switch(j){
						case 0:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','number');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].salesOrderNumber;
							break;
						case 1:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].customerID;
							break;
						case 2:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].purchaseOrderNumber;
							break;
						case 3:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].completed;
							break;
						case 4:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].serviceType ;
							break;
						case 5:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].dollarAmount;
							break;
						case 6:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
							newInput.value = response[i].location;
							break;
						case 7:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'update-' + (response[i].salesOrderNumber) + '-' + (j+1);
							newInput.value = 'update';
							break;
						case 8:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'delete-' + (response[i].salesOrderNumber) + '-'+ (j+1);
							newInput.value = 'delete';
					}
					newItem.appendChild(newInput);
					newRow.appendChild(newItem);
				}	
				tableBody.appendChild(newRow);	
			}

			for (var i=0; i < response.length; i++){
				console.log(response[i].salesOrderNumber + ", " + response[i].customerID + ", " + response[i].purchaseOrderNumber + ", " + response[i].completed + ", " + response[i].serviceType   + ", " + response[i].dollarAmount    + ", " + response[i].location);
			}
		} else {
			console.log("Error in network request: " + req.statusText);
		}});

	  req.send(null);	
}

function loadFilteredEntries(){
	var searchKey = document.getElementById('search-key').value;
	var tableBody = document.getElementById('salesorderListBody')
	tableBody.innerHTML = "";
	if (searchKey == "") {
		loadEntry();
	}	else {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/Contract_Sales_Order_Filtered?searchKey='+searchKey, true);
		req.addEventListener('load',function() {
			if(req.status >= 200 && req.status < 400){
				var response = JSON.parse(JSON.parse(req.responseText).results);		
				console.log('response is', response);	  
				var table = document.getElementById('salesorderList')
	
				for(var i = 0; i < response.length; i++){	
					var newRow = document.createElement('tr');	
					newRow.id = 'TR' + (response[i].salesOrderNumber)
					for(var j = 0; j < 9; j++){		
						var newItem = document.createElement('td');
						newItem.id = 'TD' + (response[i].salesOrderNumber) + (j+1);
						switch(j){
							case 0:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','number');
								newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
								newInput.value = response[i].salesOrderNumber;
								break;
							case 1:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
								newInput.value = response[i].customerID;
								break;
							case 2:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
								newInput.value = response[i].purchaseOrderNumber;
								break;
							case 3:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
								newInput.value = response[i].completed;
								break;
							case 4:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
								newInput.value = response[i].serviceType ;
								break;
							case 5:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
								newInput.value = response[i].dollarAmount;
								break;
							case 6:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].salesOrderNumber) + (j+1);
								newInput.value = response[i].location;
								break;
							case 7:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','button');
								newInput.id = 'update-' + (response[i].salesOrderNumber) + '-' + (j+1);
								newInput.value = 'update';
								break;
							case 8:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','button');
								newInput.id = 'delete-' + (response[i].salesOrderNumber) + '-'+ (j+1);
								newInput.value = 'delete';
						}
						newItem.appendChild(newInput);
						newRow.appendChild(newItem);
					}	
					tableBody.appendChild(newRow);	
				}
				for (var i=0; i < response.length; i++){
					console.log(response[i].salesOrderNumber + ", " + response[i].customerID + ", " + response[i].purchaseOrderNumber + ", " + response[i].completed + ", " + response[i].serviceType   + ", " + response[i].dollarAmount    + ", " + response[i].location);
				}
		} else {
			console.log("Error in network request: " + req.statusText);
		}});
	
		req.send(null);	
	}

}


loadEntry();
