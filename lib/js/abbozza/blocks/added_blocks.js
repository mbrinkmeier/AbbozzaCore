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
    context.echo("Started...");
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
            block = block.nextConnection && block.nextConnection.targetBlock();
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

Blockly.Blocks['conditional_yn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Type yes or no");
    this.appendStatementInput("yes")
        .setCheck(null)
        .appendField("if yes do");
    this.appendStatementInput("no")
        .setCheck(null)
        .appendField("if no do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute: function(context){
      var answer = context.read("Bitte ja oder nein eingeben");
      if(answer.match(/ja+/i)||answer.match(/ye+s/i)){
        block = this.getInputTargetBlock("yes");
        while(block){  
          block.execute(context);
          block = block.nextConnection && block.nextConnection.targetBlock();
        }
      }
      else{
          if(answer.match(/nein/i)||answer.match(/no+/i)){
            block = this.getInputTargetBlock("no");
            while(block){  
                block.execute(context);
                block = block.nextConnection && block.nextConnection.targetBlock();
            }  
           
          }
          else{
             context.echo("Eingabe nicht erkannt!");
          }
        }
    }
};

Blockly.Blocks['my_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("0"), "numb");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip('A number');
    this.setHelpUrl('');
  },
  
  execute: function(context){
      return this.getInputTargetBlock("numb");
  }
};

Blockly.Blocks['my_true'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("true");
    this.setOutput(true, "Boolean");
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute:function(context){
      return true;
  }
};

Blockly.Blocks['my_false'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("false");
    this.setOutput(true, "Boolean");
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute:function(context){
      return false;
  }
};

Blockly.Blocks['cond_if'] = {
  init: function() {
    this.appendValueInput("condition")
        .setCheck("Boolean")
        .appendField("if");
    this.appendDummyInput()
        .appendField("is true");
    this.appendStatementInput("then")
        .setCheck(null)
        .appendField("then");
    this.appendStatementInput("else")
        .setCheck(null)
        .appendField("else");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute: function(context){
      cond = this.getInputTargetBlock("condition");
      if(cond.execute(context)==true){
          block = this.getInputTargetBlock("then");
          while(block){  
                block.execute(context);
                block = block.nextConnection && block.nextConnection.targetBlock();
            }  
      }
      
      else{
          block = this.getInputTargetBlock("else");
          while(block){  
                block.execute(context);
                block = block.nextConnection && block.nextConnection.targetBlock();
            }  
      }
  }
};