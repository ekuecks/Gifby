var _selectedForm = undefined;
var _selectedSelect = undefined;
var _selectedStmt = undefined;
const STATEMENT_ID_BASE = 'gifby_statement_';
const IMG_ICON = 'http://imgur.com/jtBVq4Y.png';
var statementCount = 0;
function saveState(){
    chrome.runtime.sendMessage({saveState: JSON.stringify(window.state)}, function(response) {
    });
}

function getState(){
    chrome.runtime.sendMessage({getState: true}, function(response) {
    });
}

window.firstload = false;

setTimeout(function(){
getState();
}, 1000);

class Goto {
  constructor(identifier, num) {
    this.type='Goto';
    this.identifier = identifier;
    this.num = num;
    this.vidNum = window.state.vids.length;
    this.time = (new Date()).getTime() - window.state.started;
    if(identifier != 'nopush')
        window.state.cmds.push(this);
    saveState();
  }

  toDOM() {
    var div = document.createElement("div");
    div.id = STATEMENT_ID_BASE + this.num;
    var vidNum = this.vidNum;
    var time = this.time;
    var openVid = '<a class ="plyV" id="'+vidNum+' '+time+' '+'10000'+
                  '"></a>';
    div.innerHTML = this.identifier + openVid;
    return div;
  }
}

class Fill {
  constructor(identifier, text, num) {
    this.type='Fill';
    this.identifier = identifier;
    this.text = text;
    this.num = num;
    this.vidNum = window.state.vids.length;
    this.time = (new Date()).getTime() - window.state.started;
    if(identifier != 'nopush')
        window.state.cmds.push(this);
    saveState();
  }

  toDOM() {
    var div = document.createElement("div");
    div.id = STATEMENT_ID_BASE + this.num;
    var vidNum = this.vidNum;
    var time = this.time;
    var openVid = '<a class ="plyV" id="'+vidNum+' '+time+' '+'10000'+
                  '"><img src="'+IMG_ICON+'"></img></a>';
    div.innerHTML = this.identifier + " " + this.text + openVid;
    return div;
  }
}

class Click {
  constructor(identifier, num) {
    this.type='Click';
    this.identifier = identifier;
    this.num = num;
    this.vidNum = window.state.vids.length;
    this.time = (new Date()).getTime() - window.state.started;
    if(identifier != 'nopush')
        window.state.cmds.push(this);
    saveState();
  }

  toDOM() {
    var div = document.createElement("div");
    div.id = STATEMENT_ID_BASE + this.num;
    var vidNum = this.vidNum;
    var time = this.time;
    var openVid = '<a class ="plyV" id="'+vidNum+' '+time+' '+'6000'+
                  '"><img src="'+IMG_ICON+'"></img></a>';
    div.innerHTML = this.identifier + " " + openVid;
    return div;
  }
}

class Select {
  constructor(identifier, text, num) {
    this.type='Select';
    this.identifier = identifier;
    this.text = text;
    this.num = num;
    this.vidNum = window.state.vids.length;
    this.time = (new Date()).getTime() - window.state.started;
    if(identifier != 'nopush')
        window.state.cmds.push(this);
    saveState();
  }

  toDOM() {
    var div = document.createElement("div");
    div.id = STATEMENT_ID_BASE + this.num;
    var vidNum = this.vidNum;
    var time = this.time;
    var openVid = '<a class ="plyV" id="'+vidNum+' '+time+' '+'7000'+
                  '"><img src="'+IMG_ICON+'"></img></a>';
    div.innerHTML = this.identifier + " " + this.text + openVid;
    return div;
  }
}

function playVid(vidNum, time, loopLength){
    clearInterval(window.loopy);
    $('#mySidebar').height(650);
    var time = time/1000; //convert to seconds
    time -= 3;
    if(time < 0)
        time = 0;
    $('#movie').html(`
        <a id='closeMovie'> Close </a><br>
        <video controls="" autoplay="" name="media" width="800" height = "600" loop>
            <source src="`+window.state.vids[vidNum]+`#t=`+time+`" type="video/webm">
        </video>
    `);
    window.loopy = setInterval(function(){
    $('#movie').html(`
        <a id='closeMovie'> Close </a><br>
        <video controls="" autoplay="" name="media" width="800" height = "600" loop>
            <source src="`+window.state.vids[vidNum]+`#t=`+time+`" type="video/webm">
        </video>
    `);
    $('#closeMovie').click(function(e){
        clearInterval(window.loopy);
        $('#movie').hide()
        $('#mySidebar').height(250);
    });
    }, loopLength);
    $('#movie').show(1, function(){
        $('#closeMovie').click(function(e){
            clearInterval(window.loopy);
            $('#movie').hide()
            $('#mySidebar').height(250);
        });
    });
}

function updateStmt(stmt, newText) {
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
  var vidpos = stmt.innerHTML.indexOf('a class');
  var vidtag = stmt.innerHTML.substr(vidpos - 1);
  var num = stmt.id.split('_')[2];
  var type = $('#' + stmt.id).get(0).innerHTML.split(' ')[0];
  // updating in memory
  window.state.cmds[num].text = newText;
  saveState();
  $('#' + stmt.id).get(0).innerHTML = stmt.innerHTML.substring(0, pos) + newText + vidtag;
}

setTimeout(function(){
$('#record').click(function(){
    $('#indicator').html('Recording ...');
    window.state.isRecording = true; // we assume they select a screen
    window.state.started = (new Date()).getTime();
    stmt = new Goto("GOTO \"" + window.location.href + "\"", statementCount);
    statementCount++;
    _selectedSelect = undefined; 
    _selectedStmt = undefined;
    _selectedFill = undefined;
    $('#gifby').get(0).appendChild(stmt.toDOM());
    saveState();
    chrome.runtime.sendMessage({cmd: "record"}, function(response) {
    });
});

$('#execute').click(function(){
  var nodes = $('#gifby').get(0).childNodes
  console.log(nodes);
  var src = "";
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    console.log(node);
    if(node.id && node.id.substring(0,15) == 'gifby_statement') {
      var text = node.innerHTML;
      var stop = text.indexOf('<a class="plyV"');
      console.log(node.innerHTML.substring(0, stop));
      src += node.innerHTML.substring(0, stop) + "\n";
    }
  }
  console.log(src);
  chrome.runtime.sendMessage({cmd: "execute", src: src}, function(response) {
});
});

$('#stop').click(function(){
    $('#indicator').html('');
    chrome.runtime.sendMessage({cmd: "stahp"}, function(response) {
    });
    window.state.isRecording = false;
    saveState();
    getState();
});
}, 1000);

$('html').click(function(e){
  if(!window.state.isRecording)
    return;
  if(e.target.id == 'record')
    return;
  saveState();
  window.state.homeUrl = document.location;
  if(e.target.nodeName == "INPUT") {
    if(_selectedForm != undefined) {
      updateStmt(_selectedStmt, "\"" + _selectedForm.value + "\"");
      if(e.target == _selectedForm) {
        return;
      }
    }
    else if(_selectedSelect != undefined) {
      updateStmt(_selectedStmt, "\"" + _selectedSelect.value + "\"");
    }
    // Keep track that this form is selected
    console.log(e.target);
    var stmt;
    if(e.target.id != "") {
      // Unique id for this object
      stmt = new Fill("FILL \"ID: " + e.target.id +"\"", "\"" + e.target.value + "\"",statementCount);
    }
    else if(e.target.className != "") {
      var i = 0;
      var className = e.target.className.split(' ')[0];
      var nodes = document.getElementsByClassName(className);
      var length = nodes.length;
      while(i < length) {
        if(nodes[i] == e.target) {
          break;
        }
        i++;
      }
      i++;
      stmt = new Fill("FILL \"CLASS: " + className +" NUMBER: " + i + "\"",  "\"" + e.target.value + "\"", statementCount);
    }
    else {
      // nodeName = INPUT
      var i = 0;
      var nodes = document.getElementsByTagName(e.target.nodeName);
      var length = nodes.length;
      while(i < length) {
        if(nodes[i] == e.target) {
          break;
        }
        i++;
      }
      i++;
      stmt = new Fill("FILL \"ATTRIBUTE: " + e.target.nodeName +" NUMBER: " + i + "\"", "\"" + e.target.value + "\"", statementCount);
    }
    statementCount++;
    _selectedForm = e.target;
    _selectedStmt = stmt.toDOM();
    _selectedSelect = undefined;
    $('#gifby').get(0).appendChild(stmt.toDOM());
  }
  else if(e.target.nodeName == "SELECT") {
    if(_selectedSelect != undefined) {
      updateStmt(_selectedStmt, "\"" + _selectedSelect.value + "\"");
      if(e.target == _selectedSelect) {
        return;
      }
    }
    else if(_selectedForm != undefined) {
      updateStmt(_selectedStmt, "\"" + _selectedForm.value + "\"");
    }
    // Keep track that this form is selected
    console.log(e.target);
    var stmt;
    if(e.target.id != "") {
      // Unique id for this object
      stmt = new Select("SELECT \"ID: " + e.target.id +"\"", "\"" + e.target.value + "\"", statementCount);
    }
    else if(e.target.className != "") {
      var i = 0;
      var className = e.target.className.split(' ')[0];
      var nodes = document.getElementsByClassName(className);
      var length = nodes.length;
      while(i < length) {
        if(nodes.get(i) == e.target) {
          break;
        }
        i++;
      }
      i++;
      stmt = new Select("SELECT \"CLASS: " + className +" NUMBER: " + i + "\"",  "\"" + e.target.value + "\"", statementCount);
    }
    else {
      // nodeName = INPUT
      var i = 0;
      var nodes = document.getElementsByTagName(e.target.nodeName);
      var nodes = $(e.target.nodeName);
      var length = nodes.length;
      while(i < length) {
        if(nodes[i] == e.target) {
          break;
        }
        i++;
      }
      i++;
      stmt = new Select("SELECT \"ATTRIBUTE: " + e.target.nodeName +" NUMBER: " + i + "\"", "\"" + e.target.value + "\"", statementCount);
    }
    statementCount++;
    _selectedSelect = e.target;
    _selectedStmt = stmt.toDOM();
    _selectedFill = undefined;
    $('#gifby').get(0).appendChild(stmt.toDOM());
  }
  else {
    if(_selectedForm != undefined) {
      updateStmt(_selectedStmt, "\"" + _selectedForm.value + "\"");
    }
    else if(_selectedSelect != undefined) {
      updateStmt(_selectedStmt, "\"" + _selectedSelect.value + "\"");
    }
    _selectedForm = undefined;
    _selectedSelect = undefined;
    _selectedStmt = undefined;
    console.log(e.target);
    var stmt;
    if(e.target.id != "") {
      // Unique id for this object
      stmt = new Click("CLICK \"ID: " + e.target.id +"\"", statementCount);
    }
    else if(e.target.className != "") {
      var i = 0;
      var className = e.target.className.split(' ')[0];
      var nodes = document.getElementsByClassName(className);
      var length = nodes.length;
      
      while(i < length) {
        if(nodes[i] == e.target) {
          break;
        }
        i++;
      }
      i++;
      stmt = new Click("CLICK \"CLASS: " + className +" NUMBER: " + i + "\"", statementCount);
    }
    else {
      // nodeName = BUTTON
      var i = 0;
      var nodes = document.getElementsByTagName(e.target.nodeName);
      var length = nodes.length;
      while(i < length) {
        if(nodes[i] == e.target) {
          break;
        }
        i++;
      }
      i++;
      stmt = new Click("CLICK \"ATTRIBUTE: " + e.target.nodeName +" NUMBER: " + i + "\"", statementCount);
    }
    statementCount++;
    $('#gifby').get(0).appendChild(stmt.toDOM());
  }
    $('.plyV').click(function(e){
        console.log(e);
        var vidNum = e.currentTarget.id.split(' ')[0];
        var time   = e.currentTarget.id.split(' ')[1];
        var duration   = e.currentTarget.id.split(' ')[2];
        playVid(vidNum, time, duration);
    });
});

$('html').keydown( function(e) {
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log(msg);
  // a video is rdy
  if(msg.vidlink){
    //$("#vidshit").html($('#vidshit').html() + `
    //    <video controls="" autoplay="" name="media" width="400" height = "300" loop>
    //        <source src="`+msg.vidlink+`" type="video/webm">
    //    </video>
    //`);
  }
  if(msg.execute){
    console.log($('.yt-uix-sessionlink.t-uix-tile-link.t-ui-ellipsis.t-ui-ellipsis-2.pf-link').slice(0,1));
    console.log(msg.code);
    new Function(msg.code)();
  }
  if(msg.state){
    window.state = JSON.parse(msg.state);

    if(window.state.executing) {
      state.executing = false;
      saveState();
      console.log(window.state.code);
      eval(window.state.code);
    }
    if(window.firstload == false){
        if(window.state.isRecording)
            $('#indicator').html('Recording ...');
        window.firstload = true;
        setTimeout(function(){
        for(var i = 0; i < window.state.cmds.length; i++){
            var cmd = window.state.cmds[i];
            var newCmd = undefined;
            if(cmd.type == 'Goto'){
                newCmd = new Goto('nopush');
            }
            if(cmd.type == 'Fill'){
                newCmd = new Fill('nopush');
            }
            if(cmd.type == 'Click'){
                newCmd = new Click('nopush');
            }
            if(cmd.type == 'Select'){
                newCmd = new Select('nopush');
            }
            for(prop in cmd){
                newCmd[prop] = cmd[prop];
            }
            $('#gifby').get(0).appendChild(newCmd.toDOM());
            $('.plyV').click(function(e){
                console.log(e);
                var vidNum = e.currentTarget.id.split(' ')[0];
                var time   = e.currentTarget.id.split(' ')[1];
                var duration   = e.currentTarget.id.split(' ')[2];
                playVid(vidNum, time, duration);
            });
        }
        }, 200);
    }
  }
});
