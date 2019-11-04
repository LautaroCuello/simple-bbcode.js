# simplebbcode.js
A simple BBCode interpreter/editor developed in JS.
# v0.5 Guide:

# Editor

`new Editor(editorID, editorTarget, options)`

* editorID: ID of the <div> or similar where the buttons will be displayed.
* editorTarget: ID of the <textarea> or similar where the text will be written.
* options (**optional**): An object with personalization options.
  * buttons_text: Replace the text shown of a button with HTML.
  * buttons_disable: Disable a button (doesn't insert it).
  * buttons_class: Add a class to an specific buttons or all of them.

Example:

`new Editor('editor', 'target', {'buttons_text': {
'bold': '<b>this is bold</b>'},
'buttons_disable' : ['underline'],
'buttons_class': { 'italic': 'red' }
})`

or

`new Editor('editor', 'target', {'buttons_text': {
'bold': '<b>this is bold</b>'},
'buttons_disable' : ['underline'],
'buttons_class': 'red'
})`

# Interpreter

`new Interpreter(sourceID, options, sourceTarget, editorID);`

* sourceID: ID of the <textarea>/<div> or similar where the text is written.
* options (**optional**):
  * bbcode_disable: Disable a bbcode type (doesn't modify it).
* sourceTarget (**optional**): ID of the <div> or similar where the interpreted text is going to be put.
* editorID (**optional**): ID of the <div> or similar of the editor buttons. __Recommended for live edition__

`new Interpreter( 'source', { 'bbcode_disable' : ['bold'] } );`

or

`new Interpreter( 'source', { 'bbcode_disable' : ['bold'] }, 'target');`

or

`new Interpreter( 'source', { 'bbcode_disable' : ['bold'] }, 'target', 'editor');`

# Older versions:

# Usage

Add Simple-bbcode.js to your file.

```js
<script src="simple-bbcode.js"></script>
```

The script consist on two functions listed below from a total of three:

```js
/*
Replace tags from any given tag/id/class/etc.
target: Replace tags from any given tag/id/class/etc.
*/
function replaceTags(target);
/*
Creates a BBCodeEditor made of buttons with an onclick function associated to the script.
button_source: ID where the buttons will be created.
button_target: ID where the buttons would create tags.
classes (optional): If you want to add style to the buttons.
fontawesome (optional): A boolean if you want to use the free FontAwesome icons (you need to add the library)
*/
function createBBCodeEditor(button_source, button_target, classes, fontawesome);
/*
It's attached with the editor, it's how the buttons work.
target: ID Where the tags are created.
index: Which set of tags should be added.
As a bonus it puts the cursor in the middle of the tag and checks if you have selected text.
*/
function insertBBCode(target, index)
```
