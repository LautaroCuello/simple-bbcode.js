/*

    Author: Cuello, Lautaro
    Script: BBCodeVisualizer
    Version: v0.3
    Description: A simple custom bbcode client-side visualizer, it modifies the bbcode to html and
    provides a couple of buttons next to a designed textarea to let the user easily write.
    Doesn't provide style.

    Changelog:

    v0.1:
    - Intial version.

    v0.2:
    - Fixed a bug created a new tag when two bbcode tags were used, so if you wrote [i][b]text[/b][/i]
    the text next to it would have a <i></i> tag attached.

    v0.3:
    - Added new bbcode options, added configuration with FA, fixed incompatibilites between bbcodes,
    fixed performance issues regarding simplifying regex code.

 */

// (^([a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~][a-zA-Z0-9!#$%&'*+\-\./=?^_`{|}~]+[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~])[@]([a-zA-Z0-9]+)[\.]([a-zA-Z]{2,})+[\.]?([a-zA-Z]{2})+?$) Email

// Configuration

var bbcode_editor = true; // If you want to use the BBCode Editor code.
var buttons_target = "#bbcode-buttons"; // Buttons id target.
var button_class = '"btn btn-primary"'; // CSS Classes of the generated buttons.
var buttons_fa = true; // True (free FA) or false to use text.
var replaceBody = true; // True if you want to replace the body or false to not do so.
var text_source = "#text"; // Text input source.
var text_target = "#textresult"; // Text result output.


// Initialize

window.onload = function(){
    if(replaceBody){
        replaceTags('body');
    }
    if(document.querySelector(text_source) != null && document.querySelector(text_target) != null && bbcode_editor){
        createBBCodeEditor();
        document.querySelector(text_source).oninput = function(){
            document.querySelector(text_target).style['display'] = 'none';
            document.querySelector(text_target).innerHTML = document.querySelector(text_source).value;
            replaceTags(text_target);
            document.querySelector(text_target).style['display'] = 'inherit';
        }
    }
    document.querySelector("body").style['display'] = "inherit";
};

// Replace

function replaceTags(target){
    reg_exp_list = [
        // Appearance
        [new RegExp('(\\[b\\])(.*)(\\[\\/b\\])', 'g'), '<b>$2</b>'],
        [new RegExp('(\\[u\\])(.*)(\\[\\/u\\])', 'g'), '<u>$2</u>'],
        [new RegExp('(\\[i\\])(.*)(\\[\\/i\\])', 'g'), '<i>$2</i>'],
        [new RegExp('(\\[s\\])(.*)(\\[\\/s\\])', 'g'), '<s>$2</s>'],
        [new RegExp('(\\[size=([0-9]{1,2})\\])(.*)(\\[\\/size\\])', 'g'), '<span style="font-size: $2pt">$3</span>'],

        // Align
        [new RegExp('(\\[align="left"\\])(.*)(\\[\\/align\\])', 'g'), '<span style="text-align:left">$2</span>'],
        [new RegExp('(\\[align="right"\\])(.*)(\\[\\/align\\])', 'g'), '<p style="text-align:right">$2</p>'],
        [new RegExp('(\\[align="center"\\])(.*)(\\[\\/align\\])', 'g'), '<span style="text-align:center">$2</span>'],
        [new RegExp('(\\[align="justify"\\])(.*)(\\[\\/align\\])', 'g'), '<p style="text-align:justify">$2</p>'],
        [new RegExp('(\\[left\\])(.*)(\\[\\/left\\])', 'g'), '<span style="text-align:left">$2</span>'],
        [new RegExp('(\\[right\\])(.*)(\\[\\/right\\])', 'g'), '<span style="text-align:right">$2</span>'],
        [new RegExp('(\\[center\\])(.*)(\\[\\/center\\])', 'g'), '<span style="text-align:center">$2</span>'],
        [new RegExp('(\\[justify\\])(.*)(\\[\\/justify\\])', 'g'), '<span style="text-align:justify">$2</span>'],

        // Font TBD?

        // Image
        [new RegExp('(\\[img\\])(.*)(\\[\\/img\\])', 'g'), '<img src="$2"/>'],
        [new RegExp('(\\[img\\sw=([0-9]+)\\sh=([0-9]+)\\])(.*)(\\[\\/img\\])', 'g'), '<img style="width: $2px; height: $3px;" src="$4"/>'],
        [new RegExp('(\\[img\\swidth=([0-9]+)\\sheight=([0-9]+)\\])(.*)(\\[\\/img\\])', 'g'), '<img style="width: $2px; height: $3px;" src="$4"/>'],

        // List
        [new RegExp('(\\[list\\])([\\s\\S]*?)(\\[\\/list\\])', 'g'), '<ul>$2</ul>'],
        [new RegExp('(\\[list=1\\])([\\s\\S]*?)(\\[\\/list\\])', 'g'), '<ol>$2</ol>'],
        [new RegExp('(\\[list=a\\])([\\s\\S]*?)(\\[\\/list\\])', 'g'), '<ol style="list-style: lower-alpha;">$2</ol>'],
        [new RegExp('(\\[list=A\\])([\\s\\S]*?)(\\[\\/list\\])', 'g'), '<ol style="list-style: upper-alpha;">$2</ol>'],
        [new RegExp('(\\[\\*\\])(.*)', 'g'), '<li>$2</li>'],

        // Colour
        [new RegExp('(\\[color=(#[a-fA-F0-9]{6})\\])(.*)(\\[\\/color\\])', 'g'), '<span style="color: $2;">$3</span>'],
        [new RegExp('(\\[color=(#[a-fA-F0-9]{3})\\])(.*)(\\[\\/color\\])', 'g'), '<span style="color: $2;">$3</span>'],

        // Quote
        [new RegExp('(\\[q="([a-zA-Z0-9]*)"\\])(.*)(\\[\\/q\\])', 'g'), '<div class="card"><div class="card-body"><h6 class="card-title">$2 dijo:</h6><p class="card-text"><p class="card-text">\"$3\"</p></div></div>'],
        [new RegExp('(\\[q\\])(.*)(\\[\\/q\\])', 'g'), '<div class="card"><div class="card-body">\"$2\"</p></div></div>'],

        // Hiperlinks
        [new RegExp('(\\[url=([a-zA-Z0-9\\-._~:\\/\\?#\\[\\]@!$&\'()*+,;%=]+)\\])(.*)(\\[\\/url\\])', 'g'), '<a href="$2">$3</a>'],
        [new RegExp('(\\[url\\])([a-zA-Z0-9\\-._~:\\/\\?#\\[\\]@!$&\'()*+,;%=]+)(\\[\\/url\\])', 'g'), '<a href="$2">$2</a>'],

        // Miscellaneous
        [new RegExp('(\\[nl\\])|(\\[NL\\])', 'g'), '<br>'],
        //[new RegExp('(\\[url="([a-zA-Z0-9\\-._~:\\/\\?#\\[\\]@!$&\'()*+,;%=]+)"\\])(\\[img\\])([a-zA-Z0-9\\-._~:\\/\\?#\\[\\]@!$&\'()*+,;%=]+)(\\[\\/img\\])(\\[\\/url\\])', 'g'), '<a href="$2"><img src="$4"/></a>'],
        //[new RegExp('(\\[url="([a-zA-Z0-9\\-._~:\\/\\?#\\[\\]@!$&\'()*+,;%=]+)"\\])(\\[img\\sw=([0-9]+)\\sh=([0-9]+)\\])([a-zA-Z0-9\\-._~:\\/\\?#\\[\\]@!$&\'()*+,;%=]+)(\\[\\/img\\])(\\[\\/url\\])', 'g'), '<a href="$2"><img style="width: $4px; height: $5px;" src="$6"/></a>'],
        //[new RegExp('(\\[url="([a-zA-Z0-9\\-._~:\\/\\?#\\[\\]@!$&\'()*+,;%=]+)"\\])(\\[img\\swidth=([0-9]+)\\sheight=([0-9]+)\\])([a-zA-Z0-9\\-._~:\\/\\?#\\[\\]@!$&\'()*+,;%=]+)(\\[\\/img\\])(\\[\\/url\\])', 'g'), '<a href="$2"><img style="width: $4px; height: $5px;" src="$6"/></a>'],
    ];
    var result = document.querySelector(target).innerHTML;
    for(var index in reg_exp_list){
        result = result.replace(reg_exp_list[index][0], reg_exp_list[index][1]);
    }
    document.querySelector(target).innerHTML = result;
};

// Write
function createBBCodeEditor(){
    var buttons_list_fa = [
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(0)" ><i class="fa fa-bold"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(1)"><i class="fas fa-underline"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(2)"><i class="fas fa-italic"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(3)"><i class="fas fa-strikethrough"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(4)"><i class="fas fa-text-height"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(5)"><i class="fas fa-align-left"><!--Align: Left--></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(6)"><i class="fas fa-align-right"><!--Align: Right--></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(7)"><i class="fas fa-align-center"><!--Align: Center--></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(8)"><i class="fas fa-align-justify"><!--Align: Justify--></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(9)"><i class="fas fa-link"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(10)"><i class="fas fa-image"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(11)"><i class="fas fa-list-ul"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(12)"><i class="fas fa-list-ol"></i></button>',
        //'<button type="button" class=' + button_class + ' onclick="insertBBCode(13)"><i class="fas fa-palette"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(14)"><i class="fas fa-quote-right"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(15)"><i class="fas fa-level-down-alt"></i></button>',
    ];

    var buttons_list = [
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(0)" ><b>b</b></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(1)"><u>u</u></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(2)"><i>i</i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(3)"><s>s</s></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(4)">Size</button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(5)">Align: Left</i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(6)">Align: Right</i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(7)">Align: Center</i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(8)">Align: Justify</i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(9)">Link</button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(10)">Image</button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(11)">Unordered List</button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(12)">Ordered List</button>',
        //'<button type="button" class=' + button_class + ' onclick="insertBBCode(13)"><i class="fas fa-palette"></i></button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(14)">Quote</button>',
        '<button type="button" class=' + button_class + ' onclick="insertBBCode(15)">New Line</button>',
    ];
    var aux = document.querySelector(buttons_target).innerHTML;
    if(buttons_fa){
        for(var index in buttons_list_fa){
            aux += buttons_list_fa[index];
        }
    } else {
        for(var index in buttons_list){
            aux += buttons_list[index];
        }
    }
    document.querySelector(buttons_target).innerHTML = aux;
}

function insertBBCode(index){
    var bbcode_list = [
        ['[b]', '[/b]'],
        ['[u]', '[/u]'],
        ['[i]', '[/i]'],
        ['[s]', '[/s]'],
        ['[size=12]', '[/size]'],
        ['[align="left"]', '[/align]'],
        ['[align="right"]', '[/align]'],
        ['[align="center"]', '[/align]'],
        ['[align="justify"]', '[/align]'],
        ['[url=http://www.yoururl.com]Site Name', '[/url]'],
        ['[img]Image URL', '[/img]'],
        ['[list]\n[*] ', '\n[/list]'],
        ['[list=1]\n[*] ', '\n[/list]'],
        ['[color=#000000]Nombre del sitio', '[/color]'],
        ['[q]', '[/q]'],
        ['[nl]'],
    ];
    var selectionStart = document.querySelector(text_source).selectionStart;
    var selectionEnd = document.querySelector(text_source).selectionEnd;
    var value = document.querySelector(text_source).value;
    if(bbcode_list[index][1] !== undefined) {
        if (selectionStart === selectionEnd) {
            document.querySelector(text_source).value = value.slice(0, selectionStart) + bbcode_list[index][0] + bbcode_list[index][1] + value.slice(selectionEnd, value.length);
        } else {
            document.querySelector(text_source).value = value.slice(0, selectionStart) + bbcode_list[index][0] + value.slice(selectionStart, selectionEnd) + bbcode_list[index][1] + value.slice(selectionEnd, value.length);
        }
    } else {
        if (selectionStart === selectionEnd) {
            document.querySelector(text_source).value = value.slice(0, selectionStart) + bbcode_list[index][0] + value.slice(selectionEnd, value.length);
        } else {
            document.querySelector(text_source).value = value.slice(0, selectionStart) + value.slice(selectionStart, selectionEnd) + bbcode_list[index][0] + value.slice(selectionEnd, value.length);
        }
    }
    document.querySelector(text_target).style['display'] = 'none';
    document.querySelector(text_target).innerHTML = document.querySelector(text_source).value;
    replaceTags(text_target);
    document.querySelector(text_target).style['display'] = 'inherit';
    document.querySelector(text_source).selectionEnd = selectionEnd + bbcode_list[index][0].length;
    document.querySelector(text_source).focus();
}
