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
    this.setMutator(new Blockly.Mutator('decl_var_in'));
  },
  
  execute: function(interpreter, heapEntry){
   
    var context = interpreter.context_;
    
    if ( !heapEntry.running_ ) {
        // If the block isn't already running, start it
        heapEntry.running_ = true;
        context.echo("Started main block...");
        interpreter.setDB(this.symbols);
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
  },
  /**
   * Used for loading the current state of the block
   * @param {XML} and xml-document, which has been used to save this block
   * @return {undefined}
   */
  domToMutation: function(xmlElement){
      
  },
  /**
   * Used for saving the current state of the block
   * @return a mutation, that stores the current inouts of this block
   */
  mutationToDom: function(){
      var container = document.createElement('mutation');
      
      return container;
  },
  /**
   * This function opens a new workspace, where the user can declare variables for later use
   * @param {workspace} the current workspace
   * @return a Block with the new declined variables
   */
  decompose: function(workspace){
      var topBlock = Blockly.Block.obtain(workspace, 'global_vars_block');
      topBlock.initSvg();
      var length = this.symbols.getLength();
      var connection = topBlock.getInput('VARS').connection;
      for(var i = 0;i<length();i++){
          var block = Blockly.Block.obtain(workspace, 'var_decl');
          block.initSvg();
          this.appendDummyInput()
                .appendField("Name: ")
                .appendField(new Blockly.FieldTextInput(""+this.symbols.getSymbol2(i).name), "NAME")
                .appendField("Typ: ")
                .appendField(new Blockly.FieldDropdown([["String", "String"], ["Int", "Int"], ["Boolean", "Boolean"]]), "TYPE");
          //TODO Auswählen des richtigen Types???
          switch(this.symbold.getSymbol(i).type){
              case 'String':
                break;
              case 'Int':
                break;
              case 'Boolean':
                break;
        }
          connection.connect(block.previousConnection);
          connection = block.nextConnection;
      }
      
      return topBlock;
  
  },
  /**
   * This method puts the new declared variables from @decompose into
   * a new SymbolDB for later use. The old SymbolDB will be deleted.
   * @param {block} the topBlock from the @decompose function
   */
  compose: function(block){
     var current = block.getInput('VARS'); 
     this.symbols.reset();
      while(current){
        var name = current.getInputTargetBlock("NAME");
        var type = current.getInputTargetBlock("TYPE");
        this.symbols.addSymbol(name,type,0);
        current = current.nextConnection.targetBlock;
        
     }
      
      
          
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

};


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
        .appendField(new Blockly.FieldDropdown([["String", "String"], ["Int", "Int"], ["Boolean", "Boolean"]]), "TYPE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['global_vars_block'] = { //declarement of global variables (used in test_main.compose/decompose)
  count: 0,
  workspace: null,
  
  init: function() {
    this.appendDummyInput()
        .appendField("Globale Variablen: ");
    this.appendStatementInput("VARS")
        .setCheck(null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Blocks['use_vars'] = { //use of variables of all kind in the programm
  symbols: null,
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Variable", "Variable"]]), "VARIBALE");
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute: function(interpreter, heapEntry){
    if(heapEntry.step_ == 0){
      this.symbols = interpreter.getDB();
      var name = this.getFieldValue('VARIABLE');
      var symbol = this.symbols.getSymbol(name);
      if(symbol){
        switch(symbol.kind_){
            case 0:
            case 1:
                //Variable or parameter
                heapEntry.finished_ = true;
                return symbol.value;

            case 2:
                //function
                interpreter.enqueueBlock(symbol.value,heapEntry,heapEntry.symbols_);
                heapEntry.finished_ = true;
                return null;

        }
      } 
      return null;
      
    }
    return null;
  }
};

Blockly.Blocks['var_decl'] = { //inner variable declarement
  init: function() {
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};



Blockly.Blocks['function'] = {

  symbols: null,
  name: "function",
  init: function() {
    this.appendDummyInput()
        .appendField("Funktion");
    this.appendField("Name: ")
        .appendField(new Blockly.FieldTextInput("Name"), "NAME");
    this.appendStatementInput("STATEMENTS")
        .setCheck("STATMENT");
    this.setTooltip('');
    this.setHelpUrl('');
    this.setDeletable(false);
    this.setMutator(new Blockly.Mutator('var_decl_in'));
  },
  
  execute: function(interpreter, heapEntry){
   
    
    return null;
  },
  /**
   * Used for loading the current state of the block
   * @param {XML} and xml-document, which has been used to save this block
   * @return {undefined}
   */
  domToMutation: function(xmlElement){
      
  },
  /**
   * Used for saving the current state of the block
   * @return a mutation, that stores the current inouts of this block
   */
  mutationToDom: function(){
      var container = document.createElement('mutation');
      
      return container;
  },
  /**
   * This function opens a new workspace, where the user can declare variables for later use
   * @param {workspace} the current workspace
   * @return a Block with the new declined variables
   */
  decompose: function(workspace){
      var topBlock = Blockly.Block.obtain(workspace, 'global_vars_block');
      topBlock.initSvg();
      var length = this.symbols.getLength();
      var connection = topBlock.getInput('VARS').connection;
      for(var i = 0;i<length();i++){
          var block = Blockly.Block.obtain(workspace, 'var_decl');
          block.initSvg();
          this.appendDummyInput()
                .appendField("Name: ")
                .appendField(new Blockly.FieldTextInput(""+this.symbols.getSymbol2(i).name), "NAME")
                .appendField("Typ: ")
                .appendField(new Blockly.FieldDropdown([["String", "String"], ["Int", "Int"], ["Boolean", "Boolean"]]), "TYPE");
          //TODO Auswählen des richtigen Types???
          switch(this.symbold.getSymbol(i).type){
              case 'String':
                break;
              case 'Int':
                break;
              case 'Boolean':
                break;
        }
          connection.connect(block.previousConnection);
          connection = block.nextConnection;
      }
      
      return topBlock;
  
  },
  /**
   * This method puts the new declared variables from @decompose into
   * a new SymbolDB for later use. The old SymbolDB will be deleted.
   * @param {block} the topBlock from the @decompose function
   */
  compose: function(block){
     var topBlock = block.workspace.getTopBlocks();
     this.symbols = topBlock.getSymbolDB(); 
     
     var current = block.getInput('VARS'); 
     this.symbols.reset();
      while(current){
        var name = current.getInputTargetBlock("NAME");
        var type = current.getInputTargetBlock("TYPE");
        this.symbols.addSymbol(name,type,0);
        current = current.nextConnection.targetBlock;
        
     }
      
      
          
  }
  
};

