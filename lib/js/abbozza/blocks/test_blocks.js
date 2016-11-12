/* 
 * Copyright 2016 michael.
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


Blockly.Blocks['test_main'] = {

  symbols: null,
  name: "main",

  init: function() {
    this.appendDummyInput()
        .appendField("Hauptprogramm");
    this.appendStatementInput("STATEMENTS")
        .setCheck("STATMENT");
    this.setTooltip('');
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setDeletable(false);
    this.setMutator(new Blockly.Mutator());
  },
  
  execute: function(interpreter, heapEntry){
    var block = this.getInputTargetBlock("main_input");
    var context = interpreter.context_;
    
    if ( !heapEntry.running_ ) {
        // If the block isn't already running, start it
        heapEntry.running_ = true;
        context.echo("Started main block...");
        
        // Enque first subblock
        var firstBlock = this.getInputTargetBlock("STATEMENTS");
        if ( firstBlock ) {
            // The calling heapEntry for the first block is this blocks heapEntry
            interpreter.enqueueBlock(firstBlock, heapEntry, heapEntry.symbols_);
        } else {
            // If there is no first block, terminate
            context.echo("... main block empty");
            heapEntry.running_ = false;
            heapEntry.finished_ = true;
        }
    } else {
        // The execution of the internal blocks ended
        context.echo("... main block finished");
        heapEntry.running_ = false;
        heapEntry.finished_ = true;
    }
    
    // No return value
    return null;
  }
  
};


Blockly.Blocks['test_text'] = {

init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("<default>"),"TEXT");
    this.setOutput(true,"STRING");
    this.setTooltip('');
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setDeletable(true);
     this.setColour(120);
  },
  
  execute: function(interpreter, heapEntry){
    var text = this.getFieldValue("TEXT");
    
    heapEntry.finished_ = true;
    
    // return the result of the evaluation
    return text;
  }

}


Blockly.Blocks['test_print'] = {

init: function() {
    this.appendValueInput("TEXT")
        .setCheck("STRING")
        .appendField("print");
    this.setTooltip('');
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setNextStatement(true,"STATMENT");
    this.setPreviousStatement(true,"STATMENT");
    this.setDeletable(true);
     this.setColour(120);
  },
  
  execute: function(interpreter, heapEntry){
      if ( heapEntry.step_ == 0) {
          // If the block is called the first time
          // Get the value block
          var block = this.getInputTargetBlock("TEXT");
          if ( block ) {
              // enqueue the subblock
              // the calling heapEntry is this blocks heapEntry
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 1;
      } else if ( heapEntry.step_ == 1) {
          console.log(heapEntry.result_);
          console.log(typeof heapEntry.result_);
          // If the input was evaluated, continue
          // The result of the subblock is in wrpper.result_
          interpreter.context_.echo(heapEntry.result_);
          heapEntry.finished_ = true;
      }
      return null;
  }

}


Blockly.Blocks['test_read'] = {

init: function() {
    this.appendDummyInput()
        .appendField("read")
        .appendField(new Blockly.FieldTextInput("<default>"),"PROMPT");
    this.setTooltip('');
    this.setOutput(true,"STRING");
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setDeletable(true);
     this.setColour(120);
  },
  
  execute: function(interpreter, heapEntry){
    var prompt = this.getFieldValue("PROMPT");
    var context = interpreter.context_;
 
    if ( heapEntry.step_ == 0 ) {
        heapEntry.step_ = 1;
        heapEntry.stalled_ = true;
        context.myread(prompt, function(entered) { 
            heapEntry.temp = entered;
            heapEntry.stalled_ = false;
            heapEntry.step_ = 2; 
            heapEntry.interpreter_.continue();
        } );    
        context.focus();
    } else if ( heapEntry.step_ == 1 ) {
        // Do nothing. Just wait 
    } else if ( heapEntry.step_ == 2) {
        heapEntry.finished_ = true;
        return heapEntry.temp;
    }
   
    return null;
  }

}



Blockly.Blocks['test_concat'] = {

init: function() {
    this.appendValueInput("TEXT1")
        .setCheck("STRING")
        .appendField("concat(");
    this.appendDummyInput()
            .appendField(",");
    this.appendValueInput("TEXT2")
        .setCheck("STRING");
    this.appendDummyInput()
            .appendField(")");
    this.setInputsInline(true);
    this.setTooltip('');
    this.setOutput(true,"STRING");
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setDeletable(true);
     this.setColour(120);
  },
  
  execute: function(interpreter, heapEntry){
    var prompt = this.getFieldValue("PROMPT");
    var context = interpreter.context_;
 
    if ( heapEntry.step_ == 0 ) {
        // First step: Retrieve the first value
          var block = this.getInputTargetBlock("TEXT1");
          if ( block ) {
              // enqueue the subblock
              // the calling heapEntry is this blocks heapEntry
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
         heapEntry.step_ = 1;
    } else if ( heapEntry.step_ == 1 ) {
          // Second step: Retrieve the second value
          // Store the first result
          heapEntry.temp_ = heapEntry.result_; 
          var block = this.getInputTargetBlock("TEXT2");
          if ( block ) {
              // enqueue the subblock
              // the calling heapEntry is this blocks heapEntry
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 2;
    } else if ( heapEntry.step_ == 2) {
        heapEntry.finished_ = true;
        return heapEntry.temp_ + heapEntry.result_;
    }
   
    return null;
  }

}

Blockly.Blocks['var_decl_in'] = { //inner variable declarement
  init: function() {
    this.appendDummyInput()
        .appendField("Name: ")
        .appendField(new Blockly.FieldTextInput("Name"), "NAME")
        .appendField("Typ: ")
        .appendField(new Blockly.FieldDropdown([["String", "STRING"], ["Int", "INT"], ["Boolean", "BOOLEAN"]]), "Type");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['global_vars_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Globale Variablen: ");
    this.appendStatementInput("GLOBAL")
        .setCheck(null);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
Blockly.Blocks['global_vars'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Variable", "VARIABLE"]]), "VARIBALE");
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};