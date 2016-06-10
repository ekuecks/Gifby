// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const DESKTOP_MEDIA = ['screen', 'window', 'tab', 'audio'];

var pending_request_id = null;
var weGotAccess = weGotAccess ? true : false;
var recording = false;
var mediaRecorder = mediaRecorder ? mediaRecorder : null;

window.state = {'vids':[], 'cmds':[]};

function onAccessApproved(id) {
    if (!id) {
        console.log('Access rejected.');
        return;
    }

    navigator.webkitGetUserMedia({
        audio:{
            mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: id} },
        video: {
            mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: id,
            maxWidth:4000,
            maxHeight:4000} }
        }, onMediaSuccess, getUserMediaError);

    weGotAccess = true;
}

function getUserMediaError(error) {
    console.log('navigator.webkitGetUserMedia() errot: ', error);
}

function onMediaSuccess(stream) {
    console.log("rcvd stream");
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'video/webm';

    //i dont want strechy video so i fixed the width and height of recorder equal to window
    mediaRecorder.width = 4000;
    mediaRecorder.height = 4000;

    mediaRecorder.ondataavailable = function (blob) {

        var blobURL = URL.createObjectURL(blob);
        var link=blobURL;
        window.state.vids.push(link);
        var videoInfo="Compiled Video file size: " + Math.ceil(blob.size / 1024) + "KB";

        console.log(link);
        console.log(videoInfo);
        if(recording == true){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                console.log(tabs);
                chrome.tabs.sendMessage(tabs[0].id, {vidlink: link},
                function(response) {});
            });
            recording = false;
        }
    };

    mediaRecorder.start(9000000); //unlimited lol
}


function onMediaError(e) {
    console.error('media error', e);
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
        console.log(request);
        if(request.cmd == 'record') {
            recording = true;
            if(weGotAccess){
                mediaRecorder.start(9000000); //unlimited lol
                return;
            }
            pending_request_id = chrome.desktopCapture.chooseDesktopMedia(
            DESKTOP_MEDIA, onAccessApproved);
        }
        if(request.cmd == 'stahp') {
            mediaRecorder.stop();
        }
        if(request.cmd == "execute") {
          console.log(request.src);
          var code = daTranslate(request.src);
          console.log(code);
          var cmds = code.split(';');
          console.log(cmds);
          executeCommands(cmds, 0);
        }
        if(request.saveState){
            window.state = JSON.parse(request.saveState);
        }
        if(request.getState){
            chrome.tabs.query({active: true}, function(tabs){
                console.log(tabs);
                chrome.tabs.sendMessage(tabs[0].id, {state: JSON.stringify(window.state)},
                function(response) {});
            });
        }
  });

function daTranslate(src){
    var L = O;
    var matchResult = L.grammar.match(src);
    var ast = L.semanticsForParsing(matchResult).toAST();
    var code = L.transAST(ast);
    return code;
}

function executeCommands(cmds, i) {
  if(i < cmds.length) {
    console.log(cmds[i]);
    setTimeout(function() {chrome.tabs.query({active: true}, function(tabs){
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, {state: JSON.stringify(window.state), code: cmds[i], execute: true},
        function(response) {});
    }) }, 5000 * i);
    executeCommands(cmds, i + 1);
  }
}
