// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const DESKTOP_MEDIA = ['screen', 'window', 'tab', 'audio'];

var pending_request_id = null;
var pc1 = null;
var pc2 = null;

//// Launch the chooseDesktopMedia().
//document.querySelector('#start').addEventListener('click', function(event) {
//        pending_request_id = chrome.desktopCapture.chooseDesktopMedia(
//            DESKTOP_MEDIA, onAccessApproved);
//        });
//
//document.querySelector('#cancel').addEventListener('click', function(event) {
//        if (pending_request_id != null) {
//        chrome.desktopCapture.cancelChooseDesktopMedia(pending_request_id);
//        }
//        });
//
//document.querySelector('#startFromBackgroundPage')
//.addEventListener('click', function(event) {
//        chrome.runtime.sendMessage(
//            {}, function(response) { console.log(response.farewell); });
//        });

// Launch webkitGetUserMedia() based on selected media id.
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
}

function getUserMediaError(error) {
    console.log('navigator.webkitGetUserMedia() errot: ', error);
}

function onMediaSuccess(stream) {
    console.log("rcvd stream");
    var mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'video/webm';

    //i dont want strechy video so i fixed the width and height of recorder equal to window
    mediaRecorder.width = 4000;
    mediaRecorder.height = 4000;

    mediaRecorder.ondataavailable = function (blob) {

        var blobURL = URL.createObjectURL(blob);
        console.log('<a href="' + blobURL + '">' + blobURL + '</a>');


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
    mediaRecorder.start(30000); // i want unlimited recording time so i increased the timeslice
    setTimeout(function(){
        mediaRecorder.stop();
    }, 10000);
    stream.onended = function() {
        mediaRecorder.stop();
        //finalizeVideo();
        console.log("Ended"); 
    };
}


function onMediaError(e) {
    console.error('media error', e);
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
        console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                                        "from the extension");
        pending_request_id = chrome.desktopCapture.chooseDesktopMedia(
            DESKTOP_MEDIA, onAccessApproved);
  });
