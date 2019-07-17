# Simple-bbcode.js
A simple BBCode interpreter/editor developed in JS.

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
