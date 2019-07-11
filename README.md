# Simple-bbcode.js
A simple BBCode interpreter/editor developed in JS.

# Usage

Add Simple-bbcode.js to your file.

```js
<script src="simple-bbcode.js"></script>
```

Configure the script to suit your needs looking for those variables shown below.

```js
var bbcode_editor = true; // If you want to use the BBCode Editor code.
var buttons_target = "#bbcode-buttons"; // Buttons id target.
var button_class = '"btn btn-primary"'; // CSS Classes of the generated buttons.
var buttons_fa = true; // True (free FA) or false to use text.
var replaceTag = true; // True if you want to replace a part of the page or false to not do so.
var text_source = "#text"; // Text input source.
var text_target = "#textresult"; // Text result output.
```
