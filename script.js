/*Handle requests from background.html*/
function handleRequest(
        request, 
        sender, sendResponse
        ) {
    if (request.callFunction == "toggleSidebar")
        toggleSidebar();
}

chrome.extension.onRequest.addListener(handleRequest);

window.state = {};
window.state.sidebarOpen = false;

/*Small function wich create a sidebar(just to illustrate my point)*/
function toggleSidebar() {
   // if(window.state.sidebarOpen) {
   //     hideSidebar();
   // }
   // else {
   //     showSidebar();
   // }
}

function hideSidebar(){
    var el = document.getElementById('mySidebar');
        el.parentNode.removeChild(el);
        window.state.sidebarOpen = false;
}

function showSidebar(){
    var sidebar = document.createElement('div');
    sidebar.id = "mySidebar";
    sidebar.innerHTML = '<style>' + window.bootstrap + '</style>' + 
                        window.mainViewHtml;
    sidebar.style.cssText = window.mainViewCss;
    document.body.appendChild(sidebar);
    window.state.sidebarOpen = true;

}

setTimeout(function(){
showSidebar();
}, 100);
