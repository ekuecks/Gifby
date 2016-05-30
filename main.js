var _selectedForm = undefined;
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


restoreState();
$('html').click(function(e){
    saveState();
});

setTimeout(function(){
$('#record').click(function(){
    window.state.isRecording = true;
    chrome.runtime.sendMessage({cmd: "record"}, function(response) {
    });
});

$('input').click(function(e) {
    // Keep track that this form is selected
    _selectedForm = e.target;
    console.log(e.target);
});

$('button').click(function(e) {
    console.log(e.target);
});

$('html').keydown( function(e) {
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
});

$('#stop').click(function(){
    chrome.runtime.sendMessage({cmd: "stahp"}, function(response) {
    });
    window.state.isRecording = false;
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
