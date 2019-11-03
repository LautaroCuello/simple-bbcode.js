/*

    Author: Cuello, Lautaro
    Script: simplebbcode.interpreter.js
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

class Interpreter {
    _sourceID = ''
    _sourceTarget = ''
    _options = {}

    constructor(sourceID, options = {}, sourceTarget = sourceID, editorID = false){
        this._sourceID = sourceID;
        this._sourceTarget = sourceTarget;
        this._options = options;
        this._replaceTags();
        if(editorID){
            document.getElementById(editorID).addEventListener('click', () => {this._replaceTags()});
            document.getElementById(this._sourceID).addEventListener('input', () => {this._replaceTags()});
            document.getElementById(this._sourceID).addEventListener('change', () => {this._replaceTags()});
        }
    }

    _replaceTags = function(){
        let bbcode_tags = {
            'bold': [["[b]", "[/b]"], ["<b>", "</b>"]],
            'underline': [["[u]", "[/u]"], ["<u>", "</u>"]],
            'italic': [["[i]", "[/i]"], ["<i>", "</i>"]],
            'strikethrough': [["[s]", "[/s]"], ["<s>", "</s>"]],
            //'color': [[new RegExp('\\[color=(#[a-fA-F0-9]{3})\\]([\\s\\S]+)\\[\\/color\\]', 'g'), '<span style="color: $1;">$2</span>']],
        }

        if(typeof this._options.bbcode_disable !== "undefined"){
            for(let item of this._options.bbcode_disable){
                if (Object.keys(bbcode_tags).includes(item)) {
                    delete bbcode_tags[item];
                }
            }
        }

        const value = (document.getElementById(this._sourceID).localName === "textarea" ? document.getElementById(this._sourceID).value : document.getElementById(this._sourceID).innerHTML);
        let split_values = value.split(' ');

        for(let split_index in split_values) {
            for(let tags of Object.values(bbcode_tags)) {
                if(tags.length === 2) {
                    for(let tags_index in tags){
                        split_values[split_index] = split_values[split_index].replace(tags[0][tags_index], tags[1][tags_index]);
                    }
                } else {
                    split_values[split_index] = split_values[split_index].replace(tags[0][0], tags[0][1]);
                }
            }
        }

        document.getElementById(this._sourceTarget).innerHTML = split_values.join(' ');
    }
}