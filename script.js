// ==UserScript==
// @name         Imgur hosting fix for iRacing forum
// @namespace    http://tampermonkey.net/
// @version      1.0
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
        $('<iframe id="frm-' + i + '" class="imgur-fix">').insertAfter($imgLink.length ? $imgLink : $originalImg).ready(function(){
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
    });
})();