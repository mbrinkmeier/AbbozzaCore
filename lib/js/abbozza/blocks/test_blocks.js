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
  warning: null,
  symbols: null,
  init: function() {
    this.appendDummyInput()
        .appendField("Hauptprogramm");
    this.appendStatementInput("STATEMENTS")
        .setCheck("STATMENT");
    this.setTooltip('');
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setDeletable(false);
    this.setMutator(new Blockly.Mutator(['var_decl_in']));
    this.symbols = new SymbolDB(null);                           
  },
  
  execute: function(interpreter, heapEntry){
   
    var context = interpreter.context_;
    
    if ( !heapEntry.running_ ) {
        // If the block isn't already running, start it
        heapEntry.running_ = true;
        context.echo("Started main block...");
        interpreter.setDB(this.symbols);
        heapEntry.setSymbols(this.symbols);
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
  
  //TODO: mehrfache Namen sofort ändern
  decompose: function(workspace){
      console.log('start');
      if(workspace == null) {
          console.log('Fehler!');
      }
      var topBlock = Blockly.Block.obtain(workspace, 'global_vars');
      console.log('top bloock loaded');
      topBlock.initSvg();
      console.log('initialized top block');
      console.log(this.symbols);
      var length = this.symbols.getLength();
      if(length == 0){
          console.log('Empty SymbolDB');
          return topBlock;
      }
      console.log('Length: '+length);
      var connection = topBlock.getInput('VARS').connection;
      console.log("started initializing");
      for(var i = 0;i<length;i++){
          var block = Blockly.Block.obtain(workspace, 'var_decl_in');
          block.initSvg();
          block.getField("NAME").setText(""+this.symbols.getSymbol2(i).name);
          //TODO Auswählen des richtigen Types???
          console.log("Block: "+block);
          switch(this.symbols.getSymbol2(i).type){
              case 'string':
                  block.getField("TYPE").setValue("string");
                  console.log("string");
                break;
              case 'number':
                  block.getField("TYPE").setValue("number");
                  console.log("int");
                break;
              case 'boolean':
                  block.getField("TYPE").setValue("boolean");
                  console.log("bool");
                break;
          }
          console.log("Initialize complete");
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
    block.deleteWarning();
    var current = block.getInputTargetBlock('VARS');
    var warned = false;
    this.symbols.reset();
    while(current){
       console.log("Current: "+current);
       var name = current.getFieldValue("NAME");
       var text = name;
       var count = 0;
       var used = this.symbols.checkUsed(name);
       while(used){
           name = text+""+count;
           count++;
           warned = true;
           used = this.symbols.checkUsed(name);
       }
       
       var type = current.getField("TYPE").getValue();
       console.log("Name "+name);
       this.symbols.addSymbol(name,type,0,true);
       current = current.nextConnection.targetBlock();
       
    }  
    if(warned){
        block.setWarning();
    }
    console.log("Symbols: "+this.symbols);
          
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
        .appendField(new Blockly.FieldTextInput("Name"),"NAME")
        .appendField("Typ: ")
        .appendField(new Blockly.FieldDropdown([["string", "string"], ["number", "number"], ["boolean", "boolean"]]), "TYPE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(120);
  }
};

Blockly.Blocks['global_vars'] = { //declarement of global variables (used in test_main.compose/decompose)
   warning: null,
   init: function() {
       this.appendDummyInput()
               .appendField("Globale Variablen: ");
    this.appendStatementInput("VARS")
        .setCheck(null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(120);
  },
  setWarning: function(){
      this.warning = new Blockly.Warning(this);
      this.warning.setText("Some name(s) are doubled.","WARN001");
      this.warning.updateColour();
      this.warning.createIcon();
  },
  deleteWarning: function(){
     if(this.warning){
         this.warning.dispose();
         this.warning = null;
     }
  }
};
Blockly.Blocks['params'] = { 
    warning: null,
  init: function() {      
    this.appendStatementInput("PARAMS")
        .setCheck(null)
        .appendField("Parameter: ");            
    this.appendStatementInput("VARS")
        .setCheck(null)
        .appendField("Lokale Variablen: ");
    this.setTooltip('');
    this.setHelpUrl('');
    this.setDeletable(false);
    this.setColour(120);
  },
  setWarning: function(){
      this.warning = new Blockly.Warning(this);
      this.warning.setText("Some name(s) are doubled.","WARN001");
      this.warning.updateColour();
      this.warning.createIcon();
  },
  deleteWarning: function(){
     if(this.warning){
         this.warning.dispose();
         this.warning = null;
     }
  }
};

Blockly.Blocks['use_vars'] = { //use of variables of all kind in the programm
  symbols: null,
  init: function() {
    var block = this;
    this.symbols = new SymbolDB(null);
    this.setOutput(true,null);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(function(){
            var root = block.getRootBlock();
            var result = [["EMPTY","EMPTY"]];
            if(root==this){

                var topBlocks = block.workspace.getTopBlocks();
                console.log("searching top block");
                for(var i = 0; i < topBlocks.length; i++){
                    
                    if(topBlocks[i].type=="test_main"){
                        block.symbols = topBlocks[i].symbols;
                        break;
                    }
                }
                

            }
            else{
               block.symbols = root.symbols;
            }
            var symbol = null;
            var first = true;
            //var surround = this.getSurroundParent();
            for(var i = 0; i < block.symbols.getLength(); i++){
                   symbol = block.symbols.getSymbol2(i);
                   console.log("Symbol: "+symbol);
                   if(symbol.kind == 0 || symbol.kind == 1){ 
                       if(first){
                           first = false;
                           result = [];
                       }
                   
                       
                       result.push([""+symbol.name,""+symbol.name]);
                       
                   }
                  
            }
         
            var parent = block.symbols.getParent();
            while(parent){
                for(var i = 0; i < parent.getLength(); i++){
                   symbol = parent.getSymbol2(i);
                   
                   if(symbol.kind == 0 || symbol.kind == 1){
                       if(first){
                            first = false;
                            result = [];
                        }   
                        if(!block.symbols.checkUsed(symbol.name)){ //Local variables overwrite global ones
                            result = result.push([""+symbol.name,""+symbol.name]);
                        }
                   }
                }
                parent = parent.getParent();
            }
  
            return result;
            
        }),"VARS"); //Typausgabe mit einfügen? -> onItemSelect überschreiben?

    this.setTooltip('');
    this.setHelpUrl('');
  },
  
  execute: function(interpreter, heapEntry){
    if(heapEntry.step_ == 0){
      
      var name = this.getField('VARS').getValue();
      var symbol = this.symbols.getSymbol(name);
      console.log("Symbol: "+symbol);
      if(symbol){
        switch(symbol.kind){
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

Blockly.Blocks['set_var'] = {
  symbols: null,
  root: null,
  init: function() {
    var block = this;
    this.symbols = new SymbolDB(null);
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("Setze")
        .appendField(new Blockly.FieldDropdown(function(){
            root = block.getRootBlock();
            var result = [["EMPTY","EMPTY"]];
            if(root==this){

                var topBlocks = block.workspace.getTopBlocks(); //TODO: Ans laufen bringen
                console.log("searching top block");
                for(var i = 0; i < topBlocks.length; i++){
                    
                    if(topBlocks[i].name && topBlocks[i].name=="test_main"){
                        block.symbols = topBlocks[i].symbols;
                        break;
                    }
                }
                

            }
            else{
               block.symbols = root.symbols;
            }
            var symbol = null;
            var first = true;
            for(var i = 0; i < block.symbols.getLength(); i++){
                   symbol = block.symbols.getSymbol2(i);
                   console.log("Symbol: "+symbol);
                   if(symbol.kind == 0){
                       if(first){
                           first = false;
                           result = [];
                       }
                   
                       
                       result.push([""+symbol.name,""+symbol.name]);
                       
                   }
            }
         
            var parent = block.symbols.getParent();
            while(parent){
                for(var i = 0; i < parent.getLength(); i++){
                   symbol = parent.getSymbol2(i);
                   if(symbol.kind == 0){
                        if(!block.symbols.checkName(symbols.name));{
                            result = result.push([""+symbol.name,""+symbol.name]);
                        }
                    }
                }
                parent = parent.getParent();
            }
  
            return result;
        }), "NAME")
        .appendField("auf");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  execute: function(interpreter,heapEntry){ //TODO: Typsicherheit
      if(heapEntry.step_ == 0){
          var block = this.getInputTargetBlock("VALUE");
          interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          heapEntry.step_ = 1;
      }
      else if(heapEntry.step_ == 1){
          var name = this.getField("NAME").getValue();         
          heapEntry.symbols_.setSymbol(name,heapEntry.result_);
          heapEntry.finished_ = true;
      }
      return null;
  }
};

Blockly.Blocks['test_function'] = { 
  warning: null,
  symbols: null,
  first_run: true,
  init: function() {
    this.appendDummyInput()
        .appendField("Funktion");
    this.appendDummyInput()
        .appendField("Name: ")
        .appendField(new Blockly.FieldTextInput("Name"),"NAME");
    this.appendStatementInput("STATEMENTS")
    .setCheck("STATMENT");
    this.setTooltip('');
    this.setHelpUrl('');
    this.setDeletable(true);
    this.setMutator(new Blockly.Mutator(['var_decl_in']));
    this.setColour(120);
    this.symbols = new SymbolDB(null);
    console.log("Init complete");
  },
 
  
  execute: function(interpreter, heapEntry){
    if(heapEntry.step_ == 0){
       var block = this.getInputTargetBlock("STATEMENT");
       if(block){
          interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols); 
       }
       heapEntry.finished_=true;
    }
    
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
      var topBlock = Blockly.Block.obtain(workspace, 'params');
      if(first_run){ //Initialise the parent correctly
          first_run = false;
          var topBlocks = this.workspace.getTopBlocks();
                console.log("searching top block");
                for(var i = 0; i < topBlocks.length; i++){
                    
                    if(topBlocks[i].name && topBlocks[i].name=="test_main"){
                        this.symbols = newSymbolDB(topBlocks[i]);
                        break;
                    }
                }
                
      }
      console.log("Started Decompose...");
      topBlock.initSvg();
      var length = this.symbols.getLength();
      
      var connection = topBlock.getInput("PARAMS").connection;
      var connection2 = topBlock.getInput("VARS").connection;
      for(var i = 0;i<length;i++){
          var block = Blockly.Block.obtain(workspace, 'var_decl_in');
          var symbol = this.symbols.getSymbol2(i);
          block.initSvg();
          block.getField("NAME").setText(""+symbol.name);
          console.log("Block: "+block);
          switch(symbol.type){
              case 'String':
                  block.getField("TYPE").setValue("string");
                  console.log("string");
                break;
              case 'Int':
                  block.getField("TYPE").setValue("int");
                  console.log("int");
                break;
              case 'Boolean':
                  block.getField("TYPE").setValue("boolean");
                  console.log("bool");
                break;
          }
          console.log("Initialize complete");
          if(symbol.kind == 0){
            connection2.connect(block.previousConnection);
            connection2 = block.nextConnection;
          }else if(symbol.kind == 1){
            connection.connect(block.previousConnection);
            connection = block.nextConnection; 
          }
          
          
      }
      console.log("...finished");
      return topBlock;
  },
  /**
   * This method puts the new declared variables from @decompose into
   * a new SymbolDB for later use. The old SymbolDB will be deleted.
   * @param {block} the topBlock from the @decompose function
   */
    compose: function(block){
        block.deleteWarning();
        console.log("Started compose...");
        var current = block.getInputTargetBlock('PARAMS');
        var warned = false;
        this.symbols.reset();
        while(current){

           console.log("Current: "+current);
           var name = current.getFieldValue("NAME");
           var text = name;
           var count = 0;
           var used = this.symbols.checkUsed(name);
           while(used){
               name = text+""+count;
               count++;
               warned = true;
               used = this.symbols.checkUsed(name);
           }

           var type = current.getField("TYPE").getValue();
           console.log("Name "+name);
           this.symbols.addSymbol(name,type,1,false); //TODO Klassenvariable nutzen

            current = current.nextConnection.targetBlock();
        }  

        current = block.getInputTargetBlock("VARS");
        while(current){
           console.log("Current: "+current);
           var name = current.getFieldValue("NAME");
           var text = name;
           var count = 0;
           var used = this.symbols.checkUsed(name);
           while(used){
               name = text+""+count;
               count++;
               warned = true;
               used = this.symbols.checkUsed(name);
           }

           var type = current.getField("TYPE").getValue();
           console.log("Name "+name);
           this.symbols.addSymbol(name,type,0,false);
           current = current.nextConnection.targetBlock();

        }  
        if(warned){
            block.setWarning();
        }
        console.log("...finished");
    }
};

Blockly.Blocks['call_func'] = { //use of functions in the programm
  symbols: null,
  count : 0,
  init: function() {
      var block = this;
    this.appendDummyInput()
    
        .appendField("Rufe: ")
        .appendField(new Blockly.FieldDropdown(function(){
            var root = block.getRootBlock();
            var first = true;
            var result = [["EMPTY","EMPTY"]];
            

            var topBlocks = block.workspace.getTopBlocks();

            for(var i = 0; i < topBlocks.length; i++){
                if(topBlocks[i].type="test_main"){
                    block.symbols = topBlocks[i].symbols;
                    break;
                }
            }


           
            var symbol = null;
            for(var i = 0; i < block.symbols.getLength(); i++){
                   symbol = block.symbols.getSymbol2(i);
                   if(symbol.getType() != 2){
                       if(first){
                           result = [];
                       }
                        result = result.push([""+symbol.name,""+symbol.name]);
                   }
            }
            //this.update(); geeignete Stelle?
            return result;
            
        },"FUNC"))
        .appendField(" auf"); //hier eine funktion hin, die das dropdown macht
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  update: function(){ //TODO: an geeigneter Stelle aufrufen (Eventlistener auf das Ändernevent?)
      var symbol = this.symbols.getSymbol(this.getField("FUNC").getValue());
      if(symbol){
          for(var i = 0; i < this.count; i++){
              this.removeInput("PAR"+i);
          }
          this.count = symbol.count;
          for(var i = 0; i < this.ount; i++){
              this.appendValueInput("PAR"+i).appendField(""+symbol.name+": ");  
          } 
          
      }
  }
};
  