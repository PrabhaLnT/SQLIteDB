//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/

document.addEventListener("deviceready", init, false);
//Activate :active state on device
document.addEventListener("touchstart", function() {}, false);

var app = {};
app.db = null;
var Sync_status = false;

//Create DB

app.openDb = function() {
   var dbName = "EIPOfflineDB.sqlite";
   if (window.navigator.simulator === true) {
        // For debugin in simulator fallback to native SQL Lite
        console.log("Use built in SQL Lite");
        app.db = window.openDatabase(dbName, "1.0", "EIP Offline", 200000);
    }
    else {
        app.db = window.sqlitePlugin.openDatabase(dbName);
    }
}
// Create Table     
app.createTable = function() {
	var db = app.db;
	db.transaction(function(tx) {
		
        tx.executeSql("Create table WOM_MeasurementCreate (ID INTEGER PRIMARY KEY ASC, Job_code text, Job_name Text, strVendorCodeDesc ,\
                      Work_orderNo text,Start_date text, End_date text, Entry_date  test, Item_no text, PBS_assetcode text, DIM1 integer, DIM2 integer, DIM3 integer, Sets integer,\
			Remarks text, Sync_Status boolean)",[]);
	});
}
   
// Insert data
app.addTodo = function(Jcode, Jname, Vcodedescr, Wonum, Sdate, Edate, Entrydate, Itemcode, Assetcode, DIM1, DIM2, DIM3,Sets, Remarks)
{
	var db = app.db;
    console.log("inside add to do");
	db.transaction(function(tx) {
		var addedOn = new Date();
		/*tx.executeSql("INSERT INTO todo(todo, added_on) VALUES (?,?)",
					  [todoText, addedOn],
					  app.onSuccess,
					  app.onError);*/
      tx.executeSql(
"Insert into WOM_MeasurementCreate(Job_code, Job_name, strVendorCodeDesc, Work_orderNo,Start_date,End_date,Entry_date, Item_no, PBS_assetcode, DIM1, DIM2, DIM3, Sets, Remarks, Sync_Status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [Jcode, Jname, Vcodedescr, Wonum, Sdate, Edate, Entrydate,Itemcode, Assetcode, DIM1, DIM2, DIM3, Sets, Remarks, Sync_status], app.onSuccess, app.onError);
	});
    console.log("after insert");
}
      
app.onError = function(tx, e) {
	console.log("Error: " + e.message);
    app.hideOverlay();
} 

app.onSuccess = function(tx, r) {
	app.refresh();
    app.hideOverlay();
}

app.hideOverlay = function() {
    var overlay = document.getElementById("overlay");
    overlay.style.display = "none";    
}

app.showOverlay = function(id) {
    var overlay = document.getElementById("overlay");
	
    overlay.innerHTML = "<div class='row -justify-content-bottom'><div class='col'><button class='button -negative' onclick='app.deleteTodo(" + id + ");'>Delete</button>" + 
        "<button class='button' onclick='app.hideOverlay();'>Cancel</button></div></div>";
    
    overlay.style.display = "block";
}


//delete the record
app.deleteTodo = function(id) {
	var db = app.db;
    console.log("inside delete id = "+ id);
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM WOM_MeasurementCreate WHERE ID=?", [id],
					  app.onSuccess,
					  app.onError);
	});
}
//display the query result in the output window
app.refresh = function() {
	var renderTodo = function (row) {
	    return "<li class='list__item'><i class='list__icon list__icon--check fa fa-check u-color-positive'></i><span class='list__text'>" + row.strVendorCodeDesc + "</span>" +
            "<a class='delete' href='javascript:void(0);' onclick='app.showOverlay(" + row.ID + ");'><i class='list__icon list__icon--delete fa fa-trash-o u-color-negative'></i></a></li>";
	}
    
	var render = function (tx, rs) {
        console.log("output = "+ tx + rs);
		var rowOutput = "";
		var todoItems = document.getElementById("todoItems");
		for (var i = 0; i < rs.rows.length; i++) {
          
            
			rowOutput += renderTodo(rs.rows.item(i));
           
          
		}
     
		todoItems.innerHTML = rowOutput;
	}
    
	var db = app.db;
	db.transaction(function(tx) {
        console.log("before select = " + tx);
      
		tx.executeSql("SELECT * FROM WOM_MeasurementCreate", [], 
					  render,
					  app.onError);
    
       
	});
}
      
function init() {
    navigator.splashscreen.hide();
	app.openDb();
	app.createTable();
	app.refresh();
}
      
function addTodo() {
	var Jcode = document.getElementById("jobcode");
    var Jname = document.getElementById("jobname");
    var VcodeDescr = document.getElementById("vendorcodedescr");
    var Wonum = document.getElementById("wonumber");
    var Sdate = document.getElementById("startdate");
    var Edate = document.getElementById("enddate");
    var Entrydate = document.getElementById("entrydate");
    var Itemcode = document.getElementById("itemcode");
    var Assetcode = document.getElementById("assetcode");
    var DIM1 = document.getElementById("dim1");
    var DIM2 = document.getElementById("dim2");
    var DIM3 = document.getElementById("dim3");
    var Sets = document.getElementById("sets");
    var Remarks = document.getElementById("remarks");
    
    console.log("Jname = " + Jname.value);
    
	app.addTodo(Jcode.value, Jname.value, VcodeDescr.value, Wonum.value, Sdate.value, Edate.value, Entrydate.value, Itemcode.value, Assetcode.value, DIM1.value, DIM2.value, DIM3.value, Sets.value, Remarks.value);
	
}