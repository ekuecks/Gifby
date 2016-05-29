var _selectedForm = undefined;
function saveState(){
    console.log(JSON.stringify(window.state));
    chrome.storage.sync.set({'state':JSON.stringify(window.state)}, function (err){
        console.log(err);
    });
}

function restoreState(){
    chrome.storage.sync.get('state', function (obj){
        obj = obj.state;
        //default settings
        if(obj == undefined){
            obj = {};
            obj.sidebarOpen = false;
            obj = JSON.stringify(obj);
            console.log('first time');
        }
        window.state = JSON.parse(obj);
        if(window.state.sidebarOpen){
            showSidebar();
        }
    });
}

restoreState();

$('html').click(function(e){
    //if(e.target.nodeName == "A"){
    console.log(e.target);
        saveState();
    //}
});

$('input').click(function(e) {
    // Keep track that this form is selected
    _selectedForm = e.target;
    console.log(e.target);
    if(e.target.id != undefined) {
      // Unique id for this object
      console.log("FILL \"ID: " + e.target.id +"\" \"\"");
    }
    else if(e.target.className != undefined) {
      var i = 0;
      var nodes = $("." + e.target.className);
      var length = nodes.length;
      while(i < length) {
        if(nodes.get(i) == e.target) {
          break;
        }
        i++;
      }
      console.log("FILL \"CLASS: " + e.target.className +" NUMBER: " + i + "\" \"\"");
    }
    else {
      // nodeName = INPUT
      var i = 0;
      var nodes = $("." + e.target.className);
      var length = nodes.length;
      while(i < length) {
        if(nodes.get(i) == e.target) {
          break;
        }
        i++;
      }
      console.log("FILL \"ATTRIBUTE: " + e.target.nodeName +" NUMBER: " + i + "\" \"\"");
    }
});

$('button').click(function(e) {
    console.log(e.target);
    if(e.target.id != undefined) {
      // Unique id for this object
      console.log("CLICK \"ID: " + e.target.id +"\"");
    }
    else if(e.target.className != undefined) {
      var i = 0;
      var nodes = $("." + e.target.className);
      var length = nodes.length;
      while(i < length) {
        if(nodes.get(i) == e.target) {
          break;
        }
        i++;
      }
      console.log("CLICK \"CLASS: " + e.target.className +" NUMBER: " + i + "\"");
    }
    else {
      // nodeName = BUTTON
      var i = 0;
      var nodes = $("." + e.target.className);
      var length = nodes.length;
      while(i < length) {
        if(nodes.get(i) == e.target) {
          break;
        }
        i++;
      }
      console.log("CLICK \"ATTRIBUTE: " + e.target.nodeName +" NUMBER: " + i + "\"");
    }
});

$('html').keydown( function(e) {
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
});
