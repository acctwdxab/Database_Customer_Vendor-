document.addEventListener('DOMContentLoaded', insertOne);	  
document.getElementById('search-button').addEventListener('click', loadFilteredEntries);

function insertOne(){
    document.getElementById('post-button').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var customerID  = document.getElementById('customerID-input').value;
	  var purchaseOrderDate = document.getElementById('date-input').value;
	  var dollarAmount = document.getElementById('dollar-input').value;	 
      if (customerID == "" || purchaseOrderDate == "" || dollarAmount == "") {
		window.alert("field can not be empty.");
		return;
	  }
      req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/insert_Purchase_Order?customerID='+customerID+'&purchaseOrderDate='+purchaseOrderDate+'&dollarAmount='+dollarAmount, true);
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
	document.getElementById('poList').addEventListener('click', function(event){
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
	  var purchaseOrderDate = document.getElementById('input'+id+3).value;
	  var dollarAmount = document.getElementById('input'+id+4).value;
	  
      req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/update_customer?update_Purchase_Order='+id+'&customerID='+customerID+'&purchaseOrderDate='+purchaseOrderDate+'&dollarAmount='+dollarAmount, true);
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
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/delete_Purchase_Order?purchaseOrderNumber='+id, true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			var tableBody = document.getElementById('poListBody')
			var targetRow = document.getElementById('TR'+id);
			tableBody.removeChild(targetRow);
		} else {
			console.log("Error in network request: " + req.statusText);
		}});
	  req.send(null);			  

}

function addEntry(id){
	  var req = new XMLHttpRequest();
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/get_one_Purchase_Order?purchaseOrderNumber='+id, true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
                	var response = JSON.parse(JSON.parse(req.responseText).results);			  
			var table = document.getElementById('poList')
			var tableBody = document.getElementById('poListBody')

			for(var i = 0; i < response.length; i++){	
				var newRow = document.createElement('tr');	
				newRow.id = 'TR' + (response[i].customerID)
				for(var j = 0; j < 6; j++){		
					var newItem = document.createElement('td');
					newItem.id = 'TD' + (response[i].customerID) + (j+1);
					switch(j){
						case 0:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','number');
							newInput.id = 'input' + (response[i].customerID) + (j+1);
							newInput.value = response[i].customerID;
							break;
						case 1:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].customerID) + (j+1);
							newInput.value = response[i].email;
							break;
						case 2:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].customerID) + (j+1);
							newInput.value = response[i].entityName;
							break;
						case 3:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].customerID) + (j+1);
							newInput.value = response[i].location;
							break;						
						case 4:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'update-' + (response[i].customerID) + '-' + (j+1);
							newInput.value = 'update';
							break;
						case 5:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'delete-' + (response[i].customerID) + '-'+ (j+1);
							newInput.value = 'delete';
					}
					newItem.appendChild(newInput);
					newRow.appendChild(newItem);
				}	
				tableBody.appendChild(newRow);	
			}

			for (var i=0; i < response.length; i++){
				console.log(response[i].customerID + ", " + response[i].email+ ", " + response[i].entityName+ ", " + response[i].location);
			}
		} else {
			console.log("Error in network request: " + req.statusText);
		}});

	  req.send(null);	  

}

function loadEntry(){
	  var req = new XMLHttpRequest();
    	  req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/Purchase_Order', true);
          req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
                	var response = JSON.parse(JSON.parse(req.responseText).results);			  
			var table = document.getElementById('poList')
			var tableBody = document.getElementById('poListBody')

			for(var i = 0; i < response.length; i++){	
				var newRow = document.createElement('tr');	
				newRow.id = 'TR' + (response[i].purchaseOrderNumber)
				for(var j = 0; j < 6; j++){		
					var newItem = document.createElement('td');
					newItem.id = 'TD' + (response[i].purchaseOrderNumber) + (j+1);
					switch(j){
						case 0:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','number');
							newInput.id = 'input' + (response[i].purchaseOrderNumber) + (j+1);
							newInput.value = response[i].purchaseOrderNumber;
							break;
						case 1:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].purchaseOrderNumber) + (j+1);
							newInput.value = response[i].customerID;
							break;
						case 2:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].purchaseOrderNumber) + (j+1);
							newInput.value = response[i].purchaseOrderDate;
							break;
						case 3:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','text');
							newInput.id = 'input' + (response[i].purchaseOrderNumber) + (j+1);
							newInput.value = response[i].dollarAmount;
							break;						
						case 4:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'update-' + (response[i].purchaseOrderNumber) + '-' + (j+1);
							newInput.value = 'update';
							break;
						case 5:
							var newInput = document.createElement('INPUT');
							newInput.setAttribute('type','button');
							newInput.id = 'delete-' + (response[i].purchaseOrderNumber) + '-'+ (j+1);
							newInput.value = 'delete';
					}
					newItem.appendChild(newInput);
					newRow.appendChild(newItem);
				}	
				tableBody.appendChild(newRow);	
			}

			for (var i=0; i < response.length; i++){
				console.log(response[i].purchaseOrderNumber + ", " + response[i].customerID+ ", " + response[i].purchaseOrderDate+ ", " + response[i].dollarAmount);
			}
		} else {
			console.log("Error in network request: " + req.statusText);
		}});

	  req.send(null);	
}


function loadFilteredEntries(){
	var searchKey = document.getElementById('search-key').value;
	var tableBody = document.getElementById('poListBody')
	tableBody.innerHTML = "";
	if (searchKey == "") {
		loadEntry();
	}	else {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://flip3.engr.oregonstate.edu:48421/Purchase_Order_Filtered?searchKey='+searchKey, true);
		req.addEventListener('load',function() {
			if(req.status >= 200 && req.status < 400){
				var response = JSON.parse(JSON.parse(req.responseText).results);		
				console.log('response is', response);	  

				for(var i = 0; i < response.length; i++){	
					var newRow = document.createElement('tr');	
					newRow.id = 'TR' + (response[i].purchaseOrderNumber)
					for(var j = 0; j < 6; j++){		
						var newItem = document.createElement('td');
						newItem.id = 'TD' + (response[i].purchaseOrderNumber) + (j+1);
						switch(j){
							case 0:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','number');
								newInput.id = 'input' + (response[i].purchaseOrderNumber) + (j+1);
								newInput.value = response[i].purchaseOrderNumber;
								break;
							case 1:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].purchaseOrderNumber) + (j+1);
								newInput.value = response[i].customerID;
								break;
							case 2:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].purchaseOrderNumber) + (j+1);
								newInput.value = response[i].purchaseOrderDate;
								break;
							case 3:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','text');
								newInput.id = 'input' + (response[i].purchaseOrderNumber) + (j+1);
								newInput.value = response[i].dollarAmount;
								break;						
							case 4:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','button');
								newInput.id = 'update-' + (response[i].purchaseOrderNumber) + '-' + (j+1);
								newInput.value = 'update';
								break;
							case 5:
								var newInput = document.createElement('INPUT');
								newInput.setAttribute('type','button');
								newInput.id = 'delete-' + (response[i].purchaseOrderNumber) + '-'+ (j+1);
								newInput.value = 'delete';
						}
						newItem.appendChild(newInput);
						newRow.appendChild(newItem);
					}	
					tableBody.appendChild(newRow);	
				}
	
				for (var i=0; i < response.length; i++){
					console.log(response[i].purchaseOrderNumber + ", " + response[i].customerID+ ", " + response[i].purchaseOrderDate+ ", " + response[i].dollarAmount);
				}

		} else {
			console.log("Error in network request: " + req.statusText);
		}});
	
		req.send(null);	
	}

}

loadEntry();
