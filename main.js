var _selectedForm = undefined;
var _selectedStmt = undefined;
const STATEMENT_ID_BASE = 'gifby_statement';
var statementCount = 0;
function saveState(){
    chrome.storage.sync.set({'state':JSON.stringify(window.state)}, function (err){
    });
}

function restoreState(){
    chrome.storage.sync.get('state', function (obj){
        obj = obj.state;
        //default settings
        if(obj == undefined){
            obj = {};
            obj.sidebarOpen = false;
            obj.recording = false;
            obj = JSON.stringify(obj);
        }
        window.state = JSON.parse(obj);
        if(window.state.sidebarOpen){
            showSidebar();
        }
    });
}

class Fill {
  constructor(identifier, text, num) {
    this.identifier = identifier;
    this.text = text;
    this.num = num;
  }

  toDOM() {
    var div = document.createElement("div");
    div.id = STATEMENT_ID_BASE + this.num;
    div.innerHTML = this.identifier + " " + this.text;
    return div;
  }
}

class Click {
  constructor(identifier, num) {
    this.identifier = identifier;
    this.num = num;
  }

  toDOM() {
    var div = document.createElement("div");
    div.id = STATEMENT_ID_BASE + this.num;
    div.innerHTML = this.identifier;
    return div;
  }
}

function updateFill(stmt, newText) {
  // Get the position of third '"' character
  console.log(stmt.innerHTML);
  var pos = -1;
  var n = 0;
  while(n < 3){
      pos = stmt.innerHTML.indexOf('"', pos + 1);
      if (pos < 0) {
        break;
      }
      n++;
  }
  console.log(stmt.innerHTML.substr(0, pos));
  $('#' + stmt.id).get(0).innerHTML = stmt.innerHTML.substring(0, pos) + newText;
}

//restoreState();
$('html').click(function(e){
    saveState();
});

setTimeout(function(){
$('#record').click(function(){
    window.state.isRecording = true;
    chrome.runtime.sendMessage({cmd: "record"}, function(response) {
    });
});

$('#stop').click(function(){
    console.log('ehhh');
    chrome.runtime.sendMessage({cmd: "stahp"}, function(response) {
    });
    window.state.isRecording = false;
});


$('input').click(function(e) {
    if(_selectedForm == e.target) {
      updateFill(_selectedStmt, "\"" + e.target.value + "\"");
      return;
    }
    if(!window.state.isRecording)
        return;
    // Keep track that this form is selected
    console.log(e.target);
    var stmt;
    if(e.target.id != "") {
      // Unique id for this object
      stmt = new Fill("FILL \"ID: " + e.target.id +"\"", "\"" + e.target.value + "\"", statementCount);
    }
    else if(e.target.className != "") {
      var i = 0;
      var nodes = $("." + e.target.className);
      var length = nodes.length;
      while(i < length) {
        if(nodes.get(i) == e.target) {
          break;
        }
        i++;
      }
      stmt = new Fill("FILL \"CLASS: " + e.target.className +" NUMBER: " + i + "\"",  "\"" + e.target.value + "\"", statementCount);
    }
    else {
      // nodeName = INPUT
      var i = 0;
      var nodes = $(e.target.nodeName);
      var length = nodes.length;
      while(i < length) {
        if(nodes.get(i) == e.target) {
          break;
        }
        i++;
      }
      stmt = new Fill("FILL \"ATTRIBUTE: " + e.target.nodeName +" NUMBER: " + i + "\"", "\"" + e.target.value + "\"", statementCount);
    }
    statementCount++;
    _selectedForm = e.target;
    _selectedStmt = stmt.toDOM();
    $('#gifby').get(0).appendChild(stmt.toDOM());
});

$('button').click(function(e) {
    _selectedForm = undefined;
    _selectedStmt = undefined;
    console.log(e.target);
    if(!window.state.isRecording)
        return;
    if(e.target.id == 'record')
        return;
    var stmt;
    if(e.target.id != "") {
      // Unique id for this object
      stmt = new Click("CLICK \"ID: " + e.target.id +"\"", statementCount);
    }
    else if(e.target.className != "") {
      var i = 0;
      var nodes = $("." + e.target.className);
      var length = nodes.length;
      
      while(i < length) {
        if(nodes.get(i) == e.target) {
          break;
        }
        i++;
      }
      stmt = new Click("CLICK \"CLASS: " + e.target.className +" NUMBER: " + i + "\"", statementCount);
    }
    else {
      // nodeName = BUTTON
      var i = 0;
      var nodes = $(e.target.nodeName);
      var length = nodes.length;
      while(i < length) {
        if(nodes.get(i) == e.target) {
          break;
        }
        i++;
      }
      stmt = new Click("CLICK \"ATTRIBUTE: " + e.target.nodeName +" NUMBER: " + i + "\"", statementCount);
    }
    statementCount++;
    $('#gifby').get(0).appendChild(stmt.toDOM());
});

$('html').keydown( function(e) {
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log(msg);
  // a video is rdy
  if(msg.vidlink){
    $("#vidshit").html($('#vidshit').html() + `
        <video controls="" autoplay="" name="media" width="400" height = "300" loop>
            <source src="`+msg.vidlink+`" type="video/webm">
        </video>
    `);
  }
});
}, 1000);
