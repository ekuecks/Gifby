window.mainViewHtml = `
<div id='gifby' style='margin-left: 20px; margin-top:10px'>
    <div style='width: 800px'>
        <div>
        <b><font size='5'>Giffy</font></b>
        <span style='position:fixed; right: 10px'>
            <button class='button-error pure-button' id='record'>Record</button>
            <button class='pure-button' id='stop'>Stop</button>
        </span>
        </div>
        <div id='scriptcontetn' class="pure-g">

        <div id='vidshit'>
        </div>
        <p>
        <button id="start">Start</button>
        <button id="cancel">Cancel</button>
        <button id="startFromBackgroundPage">Start from background page</button>
        </p>

        </div>
    </div>
</div>
`;
window.mainViewCss = `
    position:fixed;
    bottom:0px;
    left:0px;
    width:100%;
    height:40%;
    background:white;
    border-style: solid;
    border-top: solid #000000;
    border-left: solid #ffffff;
    border-right: solid #ffffff;
    border-bottom: solid #ffffff;
    z-index:999999;
`;
