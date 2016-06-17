// ==UserScript==
// @name         Imgur hosting fix for iRacing forum
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fixes the Imgur hosting restriction on the iRacing member forum domain
// @author       Rory McCrossan
// @match        http://members.iracing.com/jforum/posts/list/*.page
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    $('<style />', {
        text: 'iframe.imgur-fix { border: 0; padding: 0; margin: 0; }'
    }).appendTo('head');

    $('img').filter(function() {
        return this.src.indexOf('imgur.com') != -1;
    }).each(function(i) {
        var $originalImg = $(this).hide();
        var $imgLink = $originalImg.closest('a').hide();
        var imgPathArr = $originalImg.prop('src').split('.');
        var imgFormat = imgPathArr.pop();
        var imgPathNoExt = imgPathArr.join('.');        
        var $iframe = $('<iframe id="frm-' + i + '" class="imgur-fix"></iframe>').insertAfter($imgLink.length ? $imgLink : $originalImg);

        if (imgFormat == 'gifv') {
            $iframe.ready(function(){
                setTimeout(function() {
                    var $vid = $('<video poster="' + imgPathNoExt + '.jpg" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="">' + 
                                 '<source src="' + imgPathNoExt + '.webm" type="video/webm">' + 
                                 '<source src="' + imgPathNoExt + '.mp4" type="video/mp4">' + 
                                 '<object type="application/x-shockwave-flash" data="//s.imgur.com/include/flash/gifplayer.swf?1444772065&amp;imgur_video=' + imgPathNoExt + '.mp4&amp;imgur_url=">' + 
                                 '<param name="movie" value="//s.imgur.com/include/flash/gifplayer.swf?1444772065&amp;imgur_video=' + imgPathNoExt + '.mp4">' + 
                                 '<param name="allowscriptaccess" value="never">' + 
                                 '<param name="version" value="0">' + 
                                 '<param name="scale" value="scale">' + 
                                 '<param name="salign" value="tl">' + 
                                 '<param name="wmode" value="opaque">' + 
                                 '</object>' + 
                                 '</video>').on('loadedmetadata', function() {
                        $('#frm-' + i).css({
                            width: $vid.innerWidth() + 20,
                            height: $vid.innerHeight() + 20
                        });
                    });
                    $('#frm-' + i).contents().find('body').append($vid);
                }, 50);
            });
        } else if (imgFormat == 'mp4') {
            $iframe.ready(function(){
                setTimeout(function() {
                    var $vid = $('<video autoplay="" muted="" loop="" controls="">' + 
                                 '<source type="video/mp4" src="' + imgPathNoExt + '.mp4">' +
                                 '</video>').on('loadedmetadata', function() {
                        $('#frm-' + i).css({
                            width: $vid.innerWidth() + 20,
                            height: $vid.innerHeight() + 20
                        });
                    });
                    $('#frm-' + i).contents().find('body').append($vid);
                }, 50);
            });
        } else {
            $iframe.ready(function(){
                setTimeout(function(){
                    var $newImg = $('<img src="' + $originalImg.prop('src') + '" />');                
                    $newImg.on('load', function() {
                        $('#frm-' + i).css({
                            width: $newImg.width() + 20,
                            height: $newImg.height() + 20
                        });
                    });
                    $('#frm-' + i).contents().find('body').append($newImg);
                    if ($imgLink.length)
                        $newImg.wrap('<a href="' + $imgLink.prop('href') + '" target="_blank"></a>');
                }, 50);
            });
        }
    });
})();