/*

    Author: Cuello, Lautaro
    Script: Simple-BBCode.js
    Version: v0.4.4
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

 */

function replaceTags(target){
    let reg_exp_list = [
        [new RegExp('\\[list\\]', 'g'), '<ul>'],
        [new RegExp('\\[\\/list\\]', 'g'), '</ol>'],
        [new RegExp('\\[list=1\\]', 'g'), '<ol>'],
        [new RegExp('\\[list=a\\]', 'g'), '<ol style="list-style: lower-alpha;">'],
        [new RegExp('\\[list=A\\]', 'g'), '<ol style="list-style: upper-alpha;">'],
        [new RegExp('\\[\\*\\](.+)', 'g'), '<li>$1</li>'],
        
        [new RegExp('\\[b\\]', 'g'), '<b>'],
        [new RegExp('\\[\/b\\]', 'g'), '</b>'],
        [new RegExp('\\[u\\]', 'g'), '<u>'],
        [new RegExp('\\[\/u\\]', 'g'), '</u>'],
        [new RegExp('\\[i\\]', 'g'), '<i>'],
        [new RegExp('\\[\/i\\]', 'g'), '</i>'],
        [new RegExp('\\[s\\]', 'g'), '<s>'],
        [new RegExp('\\[\/s\\]', 'g'), '</s>'],
        [new RegExp('\\[b\\]', 'g'), '<b>'],
        [new RegExp('\\[\/b\\]', 'g'), '</b>'],
        [new RegExp('\\[size=([0-9]{1,2})\\]([\\s\\S]+)\\[\\/size\\]', 'g'), '<span style="font-size: $1pt">$2</span>'],

        [new RegExp('\\[align="left"\\]', 'g'), '<p style="text-align: left;">'],
        [new RegExp('\\[align="right"\\]', 'g'), '<p style="text-align: right;">'],
        [new RegExp('\\[align="center"\\]', 'g'), '<p style="text-align: center;">'],
        [new RegExp('\\[align="justify"\\]', 'g'), '<p style="text-align: justify;">'],
        [new RegExp('\\[\\/align\\]', 'g'), '</p>'],

        // Font TBD

        [new RegExp('\\[img\\]([\\s\\S]+)\\[\\/img\\]', 'g'), '<img src="$1"/>'],
        [new RegExp('\\[img\\swidth=([0-9]+)\\sheight=([0-9]+)\\]([\\s\\S]+)\\[\\/img\\]', 'g'), '<img style="width: $1px; height: $2px;" src="$3"/>'],

        [new RegExp('\\[color=(#[a-fA-F0-9]{6})\\]([\\s\\S]+)\\[\\/color\\]', 'g'), '<span style="color: $1;">$2</span>'],
        [new RegExp('\\[color=(#[a-fA-F0-9]{3})\\]([\\s\\S]+)\\[\\/color\\]', 'g'), '<span style="color: $1;">$2</span>'],

        [new RegExp('\\[q="([a-zA-Z0-9]*)"\\]([\\s\\S]+)\\[\\/q\\]', 'g'), '<div class="card text-dark"><div class="card-body"><h6 class="card-title">$1 dijo:</h6><p class="card-text"><p class="card-text">\"$2\"</p></div></div>'],
        [new RegExp('\\[q\\]([\\s\\S]+)\\[\\/q\\]', 'g'), '<div class="card text-dark"><div class="card-body"><p class="card-text">\"$1\"</p></div></div>'],

        [new RegExp('\\[url=([a-zA-Z0-9\\-._~:\\/\\?#\\[\\]@!$&\'()*+,;%=]+)\\]([\\s\\S]+)\\[\\/url\\]', 'g'), '<a href="$1">$2</a>'],
        [new RegExp('\\[url\\]([a-zA-Z0-9\\-._~:\\/\\?#\\[\\]@!$&\'()*+,;%=]+)\\[\\/url\\]', 'g'), '<a href="$1">$1</a>'],

        [new RegExp('\\[nl\\]', 'g'), '<br>'],
        ];
    let result = document.querySelector(target).innerHTML;
    for(let item of reg_exp_list){
        result = result.replace(item[0], item[1]);
    }
    document.querySelector(target).innerHTML = result;
};

// Write
function createBBCodeEditor(button_source, button_target, classes = '', fontawesome = false){
    let buttons_list_fa = [
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 0)"><i class="fa fa-bold"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 1)"><i class="fas fa-underline"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 2)"><i class="fas fa-italic"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 3)"><i class="fas fa-strikethrough"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 4)"><i class="fas fa-text-height"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 5)"><i class="fas fa-align-left"><!--Align: Left--></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 6)"><i class="fas fa-align-right"><!--Align: Right--></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 7)"><i class="fas fa-align-center"><!--Align: Center--></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 8)"><i class="fas fa-align-justify"><!--Align: Justify--></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 9)"><i class="fas fa-link"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 10)"><i class="fas fa-image"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 11)"><i class="fas fa-list-ul"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 12)"><i class="fas fa-list-ol"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 13)"><i class="fas fa-circle"></i></button>',
        //'<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 14)"><i class="fas fa-palette"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 15)"><i class="fas fa-quote-right"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 16)"><i class="fas fa-level-down-alt"></i></button>',
    ];

    let buttons_list = [
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 0)" ><b>b</b></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 1)"><u>u</u></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 2)"><i>i</i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 3)"><s>s</s></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 4)">Size</button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 5)">Align: Left</i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 6)">Align: Right</i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 7)">Align: Center</i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 8)">Align: Justify</i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 9)">Link</button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 10)">Image</button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 11)">Unordered List</button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 12)">Ordered List</button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 13)">List Item</button>',
        //'<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 14)"><i class="fas fa-palette"></i></button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 15)">Quote</button>',
        '<button type="button" class="' + classes + '" onclick="insertBBCode(\'' + button_target + '\', 16)">New Line</button>',
    ];
    let result = document.getElementById(button_source).innerHTML;
    if(fontawesome){
        for(let item of buttons_list_fa){
            result += item;
        }
    } else {
        for(let item of buttons_list){
            result += item;
        }
    }
    document.getElementById(button_source).innerHTML = result;
}

function insertBBCode(target, index){
    let bbcode_list = [
        ['[b]', '[/b]'],
        ['[u]', '[/u]'],
        ['[i]', '[/i]'],
        ['[s]', '[/s]'],
        ['[size=12]', '[/size]'],
        ['[align="left"]', '[/align]'],
        ['[align="right"]', '[/align]'],
        ['[align="center"]', '[/align]'],
        ['[align="justify"]', '[/align]'],
        ['[url=http://www.yoururl.com]"Site Name"', '[/url]'],
        ['[img]"Image URL"', '[/img]'],
        ['[list]\n[*] ', '\n[/list]'],
        ['[list=1]\n[*] ', '\n[/list]'],
        ['\n[*] '],
        ['[color=#000000]', '[/color]'],
        ['[q]', '[/q]'],
        ['[nl]'],
    ];
    let selectionStart = document.getElementById(target).selectionStart;
    let selectionEnd = document.getElementById(target).selectionEnd;
    let value = document.getElementById(target).value;
    if (selectionStart === selectionEnd) {
        document.getElementById(target).value =
        value.slice(0, selectionStart) + bbcode_list[index][0] + (bbcode_list[index][1] != undefined ? bbcode_list[index][1] : "") + value.slice(selectionEnd, value.length);
    } else {
        document.getElementById(target).value =
        value.slice(0, selectionStart) + bbcode_list[index][0] + value.slice(selectionStart, selectionEnd) + (bbcode_list[index][1] != undefined ? bbcode_list[index][1] : "") + value.slice(selectionEnd, value.length);
    }
    document.getElementById(target).selectionEnd = selectionEnd + bbcode_list[index][0].length;
    document.getElementById(target).focus();
}