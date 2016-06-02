window.mainViewHtml = `
<div id='gifby' style='margin-left: 20px; margin-top:10px; overflow: scrollable; height: 100%; overflow-y: scroll;'>
    <div style='width: 800px;'>
        <div>
        <b><font size='5'>Gifby</font></b><font id='indicator' color='red'></font>
        <span style='position:fixed; right: 10px'>
            <button class='button-error pure-button' id='record'>Record</button>
            <button class='pure-button' id='stop'>Stop</button>
        </span>
        </div>
        <div id='scriptcontetn' class="pure-g">

        <div id='vidshit'>
        </div>

        <div id="movie" style='position:fixed; right: 10px;'>
        </div>

        </div>
    </div>
</div>
`;
window.mainViewCss = `
    position:fixed;
    bottom:0px;
    left:0px;
    width:100%;
    height:250px;
    overflow-y: scroll;
    background:white;
    border-style: solid;
    border-top: solid #000000;
    border-left: solid #ffffff;
    border-right: solid #ffffff;
    border-bottom: solid #ffffff;
    z-index:999999;
`;
