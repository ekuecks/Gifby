window.mainViewHtml = `
<div style='margin-left: 20px; margin-top:10px'>
    <div style='width: 800px'>
        <div>
        <b><font size='5'>Giffy</font></b>
        <span style='position:fixed; right: 10px'>
            <button class='button-error pure-button' id='record'>Record</button>
            <button class='pure-button' id='stop'>Stop</button>
        </span>
        </div>
        <div class="pure-g">
            <div class="pure-u-1-3"><p>Thirds</p></div>
            <div class="pure-u-1-3"><p>Thirds</p></div>
            <div class="pure-u-1-3"><p>Thirds</p></div>
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
