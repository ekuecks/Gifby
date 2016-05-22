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
    if(e.target.nodeName == "A"){
        saveState();
    }
});
