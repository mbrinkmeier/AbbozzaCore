/*
 * abbozza.js 
 * Copyright 2015 Michael Brinkmeier (mbrinkmeier@uni-osnabrueck.de).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Abbozza  = {
    _mainColor : "#d4daff",
    _darkColor : "#b0b0ff",
    _hoverColor : "#ffdca8",
    _minWorkspaceWidth: 400,
    _minContextWidth: 300,
    _minContextHeight: 300,
    _minMiscHeight: 0,
    
    _modified: false,
    _globalSymbols: null,
    
    _blocklyDiv: null,
    _workspacePanel: null,
    _interpreter : null,
    _context : null
}


Abbozza.init = function(toolbox) {
   
  this.makeButtons();

  this.setContext(new Terminal());

  document.oncontextmenu = function(event) { return false; };
        
  // Configuration.load();
  
  var toolbox = ToolboxMgr.rebuild("js/abbozza/core/toolbox.xml",true);

  Sliders.init();
  
  window.Blockly = Blockly;
  
  console.log("hier");
  this.newSketch();
}


Abbozza.newSketch = function() {
    this.clear();
    
    this._globalSymbols = new SymbolDB();
    Blockly.mainWorkspace.symbols = this._globalSymbols;
    
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, document.getElementById('startBlocks'));
    
    this._modified = false;
}



Abbozza.refit = function() {
    Blockly.svgResize(Blockly.mainWorkspace);
    if (this._context) this._context.refit();
}


Abbozza.setContext = function(context) {
    this._context = context;
    
    this._context.initView(document.getElementById("context_view"));
}

Abbozza.setToolbox = function() {
}

Abbozza.load = function() {
}

Abbozza.save = function() {
}

Abbozza.new = function() {
}

Abbozza.settings = function() {
}

Abbozza.info = function() {
}

Abbozza.step = function() {
    if (this._interpreter != null && !this._interpreter.finished_) {
       this._interpreter.step();
    } else {
        if (this._context) this._context.reset();
        var workspace = Blockly.mainWorkspace;
        var main_blocks = workspace.getTopBlocks();
        for(var i = 0; i<main_blocks.length;i++){
            var block = main_blocks[i];
            if(block.isDeletable()==false){
                this._interpreter = new Interpreter();
                this._interpreter.stepwise_ = true;
                this._interpreter.start(this._context,workspace,block,document.getElementById("button_play"));
                this._interpreter.step();
            }
        }
    }    
}

Abbozza.stop = function() {
    if (this._context) this._context.reset();
    this._interpreter.stop();
    this._interpreter = null;
}

Abbozza.play = function() {
// <original_code>    
//    var workspace = Blockly.mainWorkspace;
//    var main_blocks = workspace.getTopBlocks();
//    for(var i = 0; i<main_blocks.length;i++){
//        var block = main_blocks[i];
//        if(block.isDeletable()==false){
//            block.execute(this._context);
//        }
//    }
// </oroginal_code>
    if (this._interpreter != null && !this._interpreter.finished_) {
        this._interpreter.stepwise_ = false;
        this._interpreter.resume();
    } else {
        if (this._context) this._context.reset();
        var workspace = Blockly.mainWorkspace;
        var main_blocks = workspace.getTopBlocks();
        for(var i = 0; i<main_blocks.length;i++){
            var block = main_blocks[i];
            if(block.isDeletable()==false){
                this._interpreter = new Interpreter();
                this._interpreter.stepwise_ = false;
                this._interpreter.start(this._context,workspace,block,document.getElementById("button_play"));
            }
        }
    }
}

Abbozza.clear = function() {
    Blockly.mainWorkspace.clear();
}