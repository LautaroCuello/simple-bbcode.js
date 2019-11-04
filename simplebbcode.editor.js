/*

    Author: Cuello, Lautaro
    Script: simplebbcode.editor.js
    Version: v0.5
    Description: A simple bbcode replacer/editor.

    Changelog:

    v0.1:
    - Intial version.

    v0.2:
    - Fixed a bug created a new tag when two bbcode tags were used, so if you wrote [i][b]text[/b][/i]
    the text next to it would have a <i></i> tag attached.

    v0.3:
    - Added new bbcode options, added configuration with FA, fixed incompatibilites between bbcodes,
    fixed performance issues regarding simplifying regex code.

    v0.4:
    - Fixed tags not working as intended (Align and List)

    v0.4.1:
    - Strange behaviour fixes.

    v0.4.2:
    - QoL and performance improvements.

    v0.4.3:
    - Cleaning code.

    v0.4.4:
    - Little fixes.

    v0.5:
    - Added personalization, modified the code to work using classes and made adding new options easier.
 */

"use strict";

class Editor {
    _options = {}
    _editorID = ''
    _editorTarget = ''

    constructor(editorID, editorTarget, options = {}){
        this._options = options;
        this._editorID = editorID;
        this._editorTarget = editorTarget;
        this._createEditor();
    }

    _createEditor = function(){
        let buttons_list = {
            'bold': '<b>b</b>',
            'underline': '<u>u</u>',
            'italic': '<i>i</i>',
            'strikethrough': '<s>s</s>',
        }

        if(typeof this._options.buttons_text !== "undefined"){
            if(Object.keys(this._options.buttons_text).length != 0){
                Object.keys(buttons_list).forEach((item) => {
                    buttons_list[item] = (typeof this._options.buttons_text[item] !== "undefined" ? this._options.buttons_text[item] : buttons_list[item])
                });
            }
        }

        if(typeof this._options.buttons_disable !== "undefined"){
            for(let item of this._options.buttons_disable){
                if (Object.keys(buttons_list).includes(item)) {
                    delete buttons_list[item];
                }
            }
        }
        
        if(typeof this._options.buttons_class !== "undefined") {
            if(typeof this._options.buttons_class === "object") {
                for(let item of Object.keys(buttons_list)) {
                    document.getElementById(this._editorID).insertAdjacentHTML(
                        'beforeend',
                        '<button type="button" id="'+ item +'" class="' + (Object.keys(this._options.buttons_class).includes(item) ? this._options.buttons_class[item] : '') + '">' + buttons_list[item] + '</button>'
                    );
                    document.getElementById(item).addEventListener('click', () => {this.insertBBCode(item)});
                }
            } else {
                for(let item of Object.keys(buttons_list)){
                    document.getElementById(this._editorID).insertAdjacentHTML(
                        'beforeend',
                        '<button type="button" id="'+ item +'" class="' + this._options["buttons_class"] + '">' + buttons_list[item] + '</button>'
                    );
                    document.getElementById(item).addEventListener('click', () => {this.insertBBCode(item)});
                }
            }
        } else {
            for(let item of Object.keys(buttons_list)){
                document.getElementById(this._editorID).insertAdjacentHTML(
                    'beforeend',
                    '<button type="button" id="'+ item +'">' + buttons_list[item] + '</button>'
                );
                document.getElementById(item).addEventListener('click', () => {this.insertBBCode(item)});
            }
        }
    }

    insertBBCode = function(name){
        const bbcode_list = {
            'bold': ['[b]', '[/b]'],
            'underline': ['[u]', '[/u]'],
            'italic': ['[i]', '[/i]'],
            'strikethrough': ['[s]', '[/s]']
        }
        const target = document.getElementById(this._editorTarget);
        let selectionStart = target.selectionStart;
        let selectionEnd = target.selectionEnd;
        let value = target.value;
        if(typeof bbcode_list[name] !== "undefined"){
            if (selectionStart === selectionEnd) {
                target.value =
                value.slice(0, selectionStart) + bbcode_list[name][0] + (bbcode_list[name][1] != undefined ? bbcode_list[name][1] : "") + value.slice(selectionEnd, value.length);
            } else {
                target.value =
                value.slice(0, selectionStart) + bbcode_list[name][0] + value.slice(selectionStart, selectionEnd) + (bbcode_list[name][1] != undefined ? bbcode_list[name][1] : "") + value.slice(selectionEnd, value.length);
            }
            target.selectionEnd = selectionEnd + bbcode_list[name][0].length;
            target.focus();
        }
    }
}