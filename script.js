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
        sidebar.innerHTML = '<style>' + window.bootstrap + '</style>' + 
                            window.mainViewHtml;
        sidebar.style.cssText = window.mainViewCss;
        document.body.appendChild(sidebar);
        sidebarOpen = true;
    }
}
