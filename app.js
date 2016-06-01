// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const DESKTOP_MEDIA = ['screen', 'window', 'tab', 'audio'];

var pending_request_id = null;
var weGotAccess = weGotAccess ? true : false;
var mediaRecorder = mediaRecorder ? mediaRecorder : null;

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
        var videoInfo="Compiled Video file size: " + Math.ceil(blob.size / 1024) + "KB";

        console.log(link);
        console.log(videoInfo);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            console.log(tabs);
            chrome.tabs.sendMessage(tabs[0].id, {vidlink: link},
            function(response) {});
        });

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
  });