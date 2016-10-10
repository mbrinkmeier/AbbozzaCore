/* 
 * Copyright 2016 Maurice.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


Blockly.Blocks['main'] = {

    symbols: null,
    name: "main",

  init: function() {
    this.appendDummyInput()
        .appendField("Hauptprogramm");
    this.appendStatementInput("main_input")
        .setCheck(null);
    this.setTooltip('');
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setDeletable(false);
  },
  execute: function(context){
    var block = this.getInputTargetBlock("main_input");
    while(block){
        block.execute(context);
        block = block.nextConnection && block.nextConnection.targetBlock();
    }
    context.echo('Play succesfull!');
  }
};

Blockly.Blocks['conditional_while'] = {

  init: function() {
    this.appendValueInput("condition")
        .setCheck("Boolean")
        .appendField("while");
    this.appendDummyInput()
        .appendField("is true");
    this.appendStatementInput("loop")
        .setCheck(null)
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute: function(context){
    var block = this.getInputTargetBlock("loop");
     while(this.getInputTargetBlock("condition")){
        while(block){
            block.execute(context);
            block.getNextBlock();
        }
    }
  }
};


Blockly.Blocks['echo'] = {
  init: function() {
    this.appendValueInput("text")
        .setCheck("String")
        .appendField("print");
    this.appendDummyInput()
        .appendField("on console");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
    },
    
    execute: function(context){
        context.echo(this.getInputTargetBlock("text"));
    }
};

Blockly.Blocks['read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("read from console");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute: function(context){
      
  }
};