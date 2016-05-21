/*Handle requests from background.html*/
function handleRequest(
        request, 
        sender, sendResponse
        ) {
    if (request.callFunction == "toggleSidebar")
        toggleSidebar();
}

chrome.extension.onRequest.addListener(handleRequest);

/*Small function wich create a sidebar(just to illustrate my point)*/
var sidebarOpen = false;
function toggleSidebar() {
    if(sidebarOpen) {
        var el = document.getElementById('mySidebar');
            el.parentNode.removeChild(el);
            sidebarOpen = false;
    }
    else {
        var sidebar = document.createElement('div');
        sidebar.id = "mySidebar";
        sidebar.innerHTML = "<h1>Giffby</h1>";
        sidebar.style.cssText = "\
        position:fixed;\
        bottom:0px;\
        left:0px;\
        width:100%;\
        height:40%;\
        background:white;\
        border-style: solid;\
        border-top: solid #000000;\
        border-left: solid #ffffff;\
        border-right: solid #ffffff;\
        border-bottom: solid #ffffff;\
        z-index:999999;\
        ";
        document.body.appendChild(sidebar);
        sidebarOpen = true;
    }
}
