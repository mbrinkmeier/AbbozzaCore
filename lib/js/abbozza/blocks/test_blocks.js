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

/*
 * This block represents the main block. It can not be deleted. Pressing the 
 * start button triggeres the execute funtion of this block. 
 * 
 */
Blockly.Blocks['test_main'] = {
  warning: null, 
  symbols: null, //The global variables
  funcs : null, //The registered functions
  name : 'test_main',
  init: function() {
    this.appendDummyInput()
        .appendField("Hauptprogramm");
    this.appendStatementInput("STATEMENTS")
        .setCheck("STATMENT");
    this.setTooltip('');
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setDeletable(false);
    this.setMutator(new Blockly.Mutator(['var_decl_in',"my_array_number"]));
    this.symbols = new SymbolDB(null);   
    this.funcs = new SymbolDB(null);
  },
  /*
   * This function executes the block.
   * @param {interpreter} interpreter - The interpreter running the block
   * @param {heapEntry} heapEntry - The heapEntry of this block
   * @return null
   */
  execute: function(interpreter, heapEntry){
   
    var context = interpreter.context_;
    
    if ( !heapEntry.running_ ) {
        // If the block isn't already running, start it
        heapEntry.running_ = true;
        context.echo("Started main block...");
        this.symbols.clearValues(); // Clear values of this block's SymbolDB
        interpreter.setDB(this.symbols);
        heapEntry.setSymbols(this.symbols);
        this.funcs.reset()
        //Clear values of all function block's SymbolDB(s)
        var topBlocks = this.workspace.getTopBlocks();
        for(var i = 0; i<topBlocks.length;i++){
            var block = topBlocks[i];
            if(block.type == "function"){
                block.clearValues();
                console.log("Block "+block);
                this.funcs.addFunction(block.getField("NAME").getValue(),"function",null);
            }
        }
        
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
    this.symbols.reset();
    for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
          var name = childNode.getAttribute('name');
          var type = childNode.getAttribute('type');
          var kind = childNode.getAttribute('kind');
          var value = childNode.getAttribute('value');
          var global = childNode.getAttribute('global');
        this.symbols.addSymbol(name,type,kind,value,global);
      }
    }
  },
  /**
   * Used for saving the current state of the block
   * @return a mutation, that stores the current inputs of this block
   */
  mutationToDom: function(){
      var container = document.createElement('mutation');
      for(var i = 0; i< this.symbols.getLength();i++){
          var parameter = document.creaeElement('arg');
          var symbol = this.symbols.getSymbol2(i);
          parameter.setAttribute('name', symbol.name);
          parameter.setAttribute('type', symbol.type);
          parameter.setAttribute('kind', symbol.kind);
          parameter.setAttribute('value', symbol.value);
          parameter.setAttribute('global', symbol.global);
          container.appendChild(parameter);
      }
      return container;
  },
  /**
   * This function opens a new workspace, where the user can declare variables
   * for later use.
   * @param {workspace} the current workspace
   * @return {Blockly.Block} a Block with the new declared variables
   */

  decompose: function(workspace){
      //Check the current stored functions and update the DB 
      this.dropFuncs();
      //prepare the topBlock
      var topBlock = Blockly.Block.obtain(workspace, 'global_vars');
      topBlock.initSvg();
      var length = this.symbols.getLength();
      if(length == 0){ //Empty SymbolDB -> nothing to do
          return topBlock;
      }      
      //create a block for every symbol in the SymbolDB, set its parameters
      //correctly and connect it to the topBlock.
      var connection = topBlock.getInput('VARS').connection;
      for(var i = 0;i<length;i++){
          var block = Blockly.Block.obtain(workspace, 'var_decl_in');
          block.initSvg();
          block.getField("ARRAY").setValue("FALSE");
          var symbol = this.symbols.getSymbol2(i);
          block.getField("NAME").setText(""+symbol.name);
          switch(symbol.type){
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
            case "array":
                console.log("array");
                block.getField("ARRAY").setValue("TRUE");
                block.getField("TYPE").setValue(symbol.stored_type);
                block.appendValueInput("LENGTH")
                     .appendField("Länge: ","LEN")
                     .setCheck("non_zero");
                block.appendix = true;
                var num = Blockly.Block.obtain(workspace, 'my_array_number');
                num.initSvg();
                num.getField("numb").setText(parseInt(symbol.max_length));
                block.getInput("LENGTH").connection.connect(num.outputConnection);
                block.getField("LEN").setText("Länge: ");
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
   * This function will resolve multiple names by adding a rising number at
   * the end of the name.
   * @param {block} the topBlock from the @decompose function
   */
  compose: function(block){
    block.deleteWarning();
    var current = block.getInputTargetBlock('VARS');
    var warned = false;
    this.symbols.reset();
    //create an entry in the SymbolDB for every block in the value @block
    //and set the parameters correctly.
    while(current){
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
       var isArray = current.getField("ARRAY").getValue();
       var type = current.getField("TYPE").getValue();
        if(isArray == "TRUE"){
            if(current.getInputTargetBlock("LENGTH")){
                this.symbols.addSymbol(name,"array",0,type,parseInt(current.getInputTargetBlock("LENGTH").getValue()));
            }else{
                this.symbols.addSymbol(name,"array",0,type,1);
            }
        }else{
            this.symbols.addSymbol(name,type,0,type);
        }
        current = current.nextConnection.targetBlock();       
    }  
    if(warned){
        block.setWarning();
    }
  },
  /*
   * This function drops the current stored function DB and creates a new one.
   * Used for deleting old entries after a block was deleted.
   * @return {undefined} no return
   */
  dropFuncs: function(){
      this.funcs.reset();
      var topBlocks = this.workspace.getTopBlocks();
      for(var i = 0; i < topBlocks.length; i++){
          var block = topBlocks[i];
          if(block.type == "function"){
              this.funcs.addFunction(block.getField("NAME").getValue(),"function",null);
          }
      }
  }
};

/*This block represents a standart String.
 * 
 * @type {Blockly.Block}
 */
Blockly.Blocks['my_text'] = {

init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("<default>"),"TEXT");
    this.setOutput(true,"string");
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

/*
 * This block will print the given value on the console.
 * @type {Blockly.Block}
 */
Blockly.Blocks['print'] = {
init: function() {
    this.appendValueInput("TEXT")
        .appendField("print");
    this.setTooltip('');
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setNextStatement(true,"STATMENT");
    this.setPreviousStatement(true,"STATMENT");
    this.setDeletable(true);
     this.setColour(290);
  },
  /*
   * This function reads the value givne to it and prints the result on the
   * console. Input will be casted to String.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {undefined} null
   */
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

/*
 * This block will print the text of its Field on the console and waits for
 * the user to make an input. 
 * @type {Blockly.Block}
 */
Blockly.Blocks['my_read'] = {

init: function() {
    this.appendDummyInput()
        .appendField("read from console")
        .appendField(new Blockly.FieldTextInput("<default>"),"PROMPT");
    this.setTooltip('');
    this.setOutput(true,"string");
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setDeletable(true);
     this.setColour(290);
  },
  /*
   * Give the promt on the console and wait for the use to make an input
   * @param {type} interpreter
   * @param {type} heapEntry
   * @return {String} The input of the user. Will be given to the calling block.
   */
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
/*
 * This block connects to given strings with a " ".
 * @type {Blockly.Block}
 */
Blockly.Blocks['my_concat'] = {

init: function() {
    this.appendValueInput("TEXT1")
        .setCheck("string")
        .appendField("concat(");
    this.appendDummyInput()
            .appendField(",");
    this.appendValueInput("TEXT2")
        .setCheck("string");
    this.appendDummyInput()
            .appendField(")");
    this.setInputsInline(true);
    this.setTooltip('');
    this.setOutput(true,"string");
    this.setHelpUrl('');
    this.setDeletable(true);
     this.setColour(120);
  },
  /*
   * Read the inputs of this block and connect them. 
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {String} the connected inputs.
   */
  execute: function(interpreter, heapEntry){
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
          heapEntry.result_ = null;
          var block = this.getInputTargetBlock("TEXT2");
          if ( block ) {
              // enqueue the subblock
              // the calling heapEntry is this blocks heapEntry
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 2;
    } else if ( heapEntry.step_ == 2) {
        heapEntry.finished_ = true;
        if(heapEntry.temp_&&heapEntry.result_){
            return heapEntry.temp_+" "+heapEntry.result_;
        }else if(!heapEntry.temp_&&heapEntry.result_){
            return heapEntry.result_;
        }else if(!heapEntry.result_&&heapEntry.temp_){
            return heapEntry.temp_;
        }else{
            return "";
        }
    }  
    return null;
  }

}
/*
 * This block is used for variable delcarement in the @test_main and
 * @function block.
 * @type {Blockly.Block}
 */
Blockly.Blocks['var_decl_in'] = { //inner variable declarement
  appendix: false,
   init: function() {
      var block = this;
    this.appendDummyInput()
        .appendField("Name: ")
        .appendField(new Blockly.FieldTextInput("Name"),"NAME")
        .appendField("Typ: ")
        .appendField(new Blockly.FieldDropdown([["string", "string"]
        , ["number", "number"], ["boolean", "boolean"]]), "TYPE");
    this.appendDummyInput()
        .appendField("Array ?")
        .appendField(new Blockly.FieldCheckbox("FALSE",function(value){
          if(value){ //this functions adds an input for the length
                    //if the user aktivated the checkbox
              if(!block.appendix){
                block.appendValueInput("LENGTH")
                    .setCheck("non_zero")
                    .appendField("Länge: ");             
                block.appendix = true;
              }
          }else if(block.appendix){ //or removes it if not
             block.removeInput("LENGTH");
             block.appendix = false;
          }          
          return value;
        }),"ARRAY");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(120);
  }
};

/*
 * This block is used by the @test_main block to declare the global variables.
 * @type {Blockly.Block}
 */
Blockly.Blocks['global_vars'] = { //declarement of global variables 
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
  /* This function sets a warning on this block. Triggered, if
   * the names of variables are doubled.
   * @return nothing
   */
  setWarning: function(){
      this.warning = new Blockly.Warning(this);
      this.warning.setText("Some name(s) are doubled.","WARN001");
      this.warning.updateColour();
      this.warning.createIcon();
  },
  /* If a warning is set on the block, remove it. Otherwise do nothing
   * 
   * @return {undefined}
   */
  deleteWarning: function(){
     if(this.warning){
         this.warning.dispose();
         this.warning = null;
     }
  }
};

/*
 * This block is used by the @function block to create local variables and
 * parameters.
 * @type {Blockly.Block}
 */
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
  /* This function sets a warning on this block. Triggered, if
   * the names of variables are doubled.
   * @return nothing
   */
  setWarning: function(){
      this.warning = new Blockly.Warning(this);
      this.warning.setText("Some name(s) are doubled.","WARN001");
      this.warning.updateColour();
      this.warning.createIcon();
  },
  /* If a warning is set on the block, remove it. Otherwise do nothing
   * 
   * @return {undefined}
   */
  deleteWarning: function(){
     if(this.warning){
         this.warning.dispose();
         this.warning = null;
     }
  }
};

/*
 * This block allows the user to use his declared variables. Based on the spot
 * this block is used on the programm different variables can be used. 
 * If a global and a local variable have the same name, the local one is 
 * available only. 
 * @type {type}
 */
Blockly.Blocks['use_vars'] = { 
  symbols: null, //The variables of this block. For generating only.
  appendix: false, 
  old_output: null, //The old output of this block. If it changes, the block
                    //will be disconnected automatically to make sure the 
                    //tpye safety is guaranteed.
  init: function() {
    var block = this;
    this.symbols = new SymbolDB(null);
    this.setOutput(true,null);
    this.setColour(330);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(function(){ 
            //This function generates the available variables
            var root = block.getRootBlock();
            var result = [["EMPTY","EMPTY"]];
            if(root==block){
                //if this block is the top most, then search the global 
                //variables of the @test_main block
                var topBlocks = block.workspace.getTopBlocks();
                for(var i = 0; i < topBlocks.length; i++){
                    
                    if(topBlocks[i].type=="test_main"){
                        block.symbols = topBlocks[i].symbols;
                        break;
                    }
                }
                

            }
            else{ 
                //Check if the root has a SymbolDB and use this one
                if(root.symbols){
                    block.symbols = root.symbols;
                }
            }
            var symbol = null;
            var first = true;
            if(!block.symbols){
                return result;
            }
            //For every available variable generate an entry (beginning with
            //the local ones).
            for(var i = 0; i < block.symbols.getLength(); i++){
                   symbol = block.symbols.getSymbol2(i);
                   if(symbol.kind == 0 || symbol.kind == 1){ 
                       if(first){
                           first = false;
                           result = [];
                       }
                   
                       
                       result.push([""+symbol.name,""+symbol.name]);
                       
                   }
                  
            }
            //If the SymbolDB has a parent entry go through their DB as well
            //but only add variables with different names than the local ones.
            var parent = block.symbols.getParent();
            while(parent){
                for(var i = 0; i < parent.getLength(); i++){
                   symbol = parent.getSymbol2(i);
                   
                   if(symbol.kind == 0 || symbol.kind == 1){
                       if(first){
                            first = false;
                            result = [];
                        }   
                        if(!block.symbols.checkUsed(symbol.name)){ 
                            //Local variables overwrite global ones
                            result.push([""+symbol.name,""+symbol.name]);
                        }
                   }
                }
                parent = parent.getParent();
            }
            return result;
            
            
        },
      /*
       * This function is used to update the blocks shape. If the used variable
       * is an array, an input will be added to the block. Otherwise this input
       * will be removed. 
       * @param {Array} value
       * @return {String or null} returns the new vlaue of the DropDown. If the
       *         return is null, abort changes.
       */  
      function(value){ 
            //No variables are available: Delete the info text and the appendix
            if(value == "EMPTY"){
                block.getField("INFO").setText("()");
                if(block.appendix){
                    block.appendix = false;
                    block.removeInput("NUMBER");
                }
                block.setOutput(true,null);
                block.old_output = null;
                return value;
            }
            var symbol = block.symbols.getSymbol(value);
            var info = block.getField("INFO");
           
            if(symbol.type == "array"){
                //If the used variable is an array, add some informations about 
                //to the block. 
                info.setText("(Array des Typs "+symbol.stored_type+" der Länge "+symbol.max_length+")");
                //Handle the appendix of the block.
                if(!block.appendix){
                    block.appendix = true;
                    
                    block.appendValueInput("NUMBER")
                         .setCheck("non_neg")
                         .appendField("an der Stelle (optional): ");
                 }  
            }else {
                //If the variable is not an array, remove the appendix (if it is
                //there) and give an info about the type of this variable.
                info.setText("(Typ "+symbol.type+")"); 
                if(block.appendix){
                    block.removeInput("NUMBER");
                    block.appendix = false;
                }
            }
            
            if(!block.old_output||block.old_output != symbol.type){
                //The output type of this block changes. To guarantee type 
                //security, disconnect it.
                block.setParent(null);
                block.bumpNeighbours_();
                if(symbol.type == "array"){
                    block.setOutput(true, [""+symbol.type,""+symbol.stored_type]);
                }else{
                    block.setOutput(true,""+symbol.type);
                }
            }
            block.old_output = symbol.type;
            return value;
        }),"VARS")
            .appendField("()","INFO"); //Typausgabe mit einfügen? -> validator umschreiben

    this.setTooltip('');
    this.setHelpUrl('');
  },
  /*
   * This function executes the block. 
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {unresolved}
   */
  execute: function(interpreter, heapEntry){
    if(heapEntry.step_ == 0){
        if(this.appendix){ //The variable is an array, so read the number given
            var block = this.getInputTargetBlock("NUMBER");
            if(block){
               interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);            
            }            
        }
      heapEntry.step_ = 1;
      
    }else if(heapEntry.step_ == 1){
       var name = this.getField('VARS').getValue();
       heapEntry.finished_ = true;
       //Lookup the value of the variable. If it is an array,@heapEntry.result_
       //can contain a number. For more infos see @SymbolDB.getValue().
       return heapEntry.symbols_.getValue(name,heapEntry.result_);
       
    }
    return null;
  }
};

/*
 * This block is used for setting values of declared variables. Based on the 
 * spot in the programm this block is used, different variables may be 
 * available.
 * @type {Blockly.Block}
 */
Blockly.Blocks['set_var'] = {
  symbols: null,
  root: null,
  appendix: false,
  topBlock: null,
  init: function() {
    var block = this;
    this.symbols = new SymbolDB(null);
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("Setze")
        .appendField(new Blockly.FieldDropdown(function(){
            //This function generates the available variables
            block.root = block.getRootBlock();
            var result = [["EMPTY","EMPTY"]];
            if(block.root==block){
                var topBlocks = block.workspace.getTopBlocks();    
                for(var i = 0; i < topBlocks.length; i++){
                    
                    if(topBlocks[i].name && topBlocks[i].name=="test_main"){
                        block.symbols = topBlocks[i].symbols;
                        block.topBlock = topBlocks[i];
                        break;
                    }
                }              
            }
            else{
                if(block.root.symbols){
                    block.symbols = block.root.symbols;
                }
                else{
                    return result;
                }
            }
            var symbol = null;
            var first = true;
            for(var i = 0; i < block.symbols.getLength(); i++){
                   symbol = block.symbols.getSymbol2(i);
                   if(symbol.kind == 0||symbol.kind==1){
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
                        if(!block.symbols.checkName(symbol.name));{
                            result.push([""+symbol.name,""+symbol.name]);
                        }
                    }
                }
                parent = parent.getParent();
            }  
            return result;
        },function(value){ 
            //This function updates the blocks shape.
            //If an array was selected, an appendix will be added to this block
            //so the user can give an index for the array.
            
            
            if(value == "EMPTY"){
                block.getField("INFO").setText("()");
                block.getInput("VALUE").setCheck(null);
                if(block.appendix){
                    block.removeInput("NUMBER");                   
                    block.appendix = false;
                }
                return value;
            }
            var symbol = block.symbols.getSymbol(value);
            var info = block.getField("INFO");
            if(symbol.type == "array"){
                //Type security first
                block.getInput("VALUE").setCheck([""+symbol.type,""+symbol.stored_type]);
                info.setText("(Array vom Typ "+symbol.stored_type+" der Länge "+symbol.max_length+")"); 
                if(!block.appendix){                  
                    block.appendix = true;                   
                    block.appendValueInput("NUMBER")
                         .setCheck("non_neg")
                         .appendField("an der Stelle (optional): ");
                }
                
            }else {
                //Type security first
                block.getInput("VALUE").setCheck(""+symbol.type);
                info.setText("(Typ "+symbol.type+")"); 
                if(block.appendix){
                    block.removeInput("NUMBER");                   
                    block.appendix = false;
                }
                
            }
            
            return value;
        }), "NAME")
        .appendField("()","INFO")
        .appendField("auf ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {undefined} null
   */
  execute: function(interpreter,heapEntry){ 
      if(heapEntry.step_ == 0){
        var block = this.getInputTargetBlock("VALUE");
        //Read the value to be used first
        if(block){
            interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
        }
        heapEntry.step_ = 1;
      } else if(heapEntry.step_ == 1){
          heapEntry.temp_ = heapEntry.result_;
          heapEntry.result_ = null;
          //If the block has an appendix (the variable is an array) read its 
          //number.
          if(this.appendix){
              var block = this.getInputTargetBlock("NUMBER");
              if(block){
                  interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
              }
          }
          heapEntry.step_ = 2;
      }
      else if(heapEntry.step_ == 2){         
          var name = this.getField("NAME").getValue(); 
          if(this.appendix){
              //If the variable is an array set it with the given parameters.
              //For more infos see @SymbolDB.setArray()
              heapEntry.symbols_.setArray(name,heapEntry.result_,heapEntry.temp_);             
          }else{
              //If not, set the value of the symbol
            heapEntry.symbols_.setSymbol(name,heapEntry.temp_);           
          }
          
        heapEntry.step_ = 3;
      }else if(heapEntry.step_ == 3){
          heapEntry.finished_ = true;
      }
      return null;
  }
};

/*
 * This block represents a function. Once it is generated, an optional return
 * value can be set. If two functions have the same name, the newer
 * functions' name will be modified (similar to the multiple variable names).
 * @type {Blockly.Block}
 */
Blockly.Blocks['function'] = { 
  clone: null, //this variable will contain a copy of this block (used for 
               //executing the block).
  warning: null,
  mainBlock: null, //the @test_main block of the workspace
  symbols: null, //the @SymbolDB of this block
  symbols_old : null, //The old symbols of the @heapEntry (used for executing
                      //only)
  appendix: false, //if this block has a return value or not
  name_old: null, //the old name of this function (used for renaming functions
                  //in the @test_main block's functions)
  name: null, //the current name of this block
  first_run: true, //used for initialising everything correctly
  parameters: 0, //the number of parameters this block has
  init: function() {
      var block = this;
      this.name_old = null;
    this.appendDummyInput()
        .appendField("Funktion");       
    this.appendDummyInput()
        .appendField("Name: ")
        .appendField(new Blockly.FieldTextInput("Name",function(value){
            //When the name of the function changes, register it at the 
            //@test_main block. For more infos see @function.register.
            return block.register(value); 
         
           
    }),"NAME");
    this.appendDummyInput()
        .appendField("Rückgabewert ?")
        .appendField(new Blockly.FieldCheckbox("FALSE",function(value){
           if(value){ //If the block returns something:
               //add a field for the return value and return type
                if(!block.appendix){
                    block.appendDummyInput("RETURN")
                        .appendField("Typ des Rückgabewertes: ")
                        .appendField(new Blockly.FieldDropdown([["string", "string"]
                        , ["number", "number"], ["boolean", "boolean"],
                        ["array","array"]],function(value){
                            if(block.getInput("VALUE")){
                                block.removeInput("VALUE");
                            }
                            block.appendValueInput("VALUE")
                                .setCheck(value) //Typesecurity
                                .appendField("Rückgabewert: ");
                            return value;
                        }),"TYPE");    
                        block.appendValueInput("VALUE")
                                .setCheck("string") //Typesecurity
                                .appendField("Rückgabewert: ");
                    block.appendix = true;
                }
           } else{
               //If not, remove the appendix.
               if(block.appendix){
                   block.appendix = false;
                   block.removeInput("RETURN");
                   block.removeInput("VALUE");
               }
           }
        }),"HAS_RETURN");
    this.appendStatementInput("STATEMENTS")
    .setCheck("STATMENT");
    this.setTooltip('');
    this.setHelpUrl('');
    this.setDeletable(true);
    this.setMutator(new Blockly.Mutator(['var_decl_in', 'my_array_number']));
    this.setColour(160);
    this.symbols = new SymbolDB(null);
  },
  /*
   * This function registers this block at the @test_main.
   * For more infos see @SymbolDB.addFunction.
   * @param {String} The name of the function (from the name field)
   * @return {String} The new name of the function
   */
  register: function(value){
    if(!this.mainBlock){
        var topBlocks = this.workspace.getTopBlocks();
        for(var i = 0; i < topBlocks.length; i++){ 
            var block = topBlocks[i];
            if( block.type == "test_main"){                      
                this.mainBlock = block;
                break;
            }
        }       
    }
    
        this.name = this.mainBlock.funcs.addFunction(value,"function",this.name_old);
        this.name_old = this.name;   
        console.log("registered: "+this.name);
        return this.name;
    
  },
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {value or null} Returns the return value of the function or null
   */
  execute: function(interpreter, heapEntry){
    if(heapEntry.step_== 0){ 
        console.log("Started function "+this.name+"...");
        //Save the global variables for later restoration
          this.symbols_old = heapEntry.symbols_;
          //Clone this block to correctly use the @SymbolsDB in recursion
          this.clone = Object.create(this);
         //give the @interpreter and the @heapEntry the local variables 
        heapEntry.setSymbols(this.clone.symbols);  
        interpreter.setDB(this.clone.symbols);
        console.log("Started funktion...");
        //Put the first block connected to this block on the Stack
        var block = this.clone.getInputTargetBlock("STATEMENTS");
         if(block){
            interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_); 
         }
         heapEntry.step_ = 1;
      }
   else if(heapEntry.step_ == 1){
       //Ignore returns from the blocks
        heapEntry.result_ = null;
        //If the block has a return, execute the block attached to it
        if(this.getField("HAS_RETURN").getValue()=="TRUE"){
            var block = this.getInputTargetBlock("VALUE");
            if(block){
                interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_); 
            }
        }
        heapEntry.step_ = 2;
       
       
       
   }else if(heapEntry.step_ == 2){
       //restore the global variables
      heapEntry.setSymbols(this.clone.symbols_old);  
      interpreter.setDB(this.clone.symbols_old); 
      heapEntry.finished_ = true;
      console.log("...finished");
      return heapEntry.result_;
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
      this.name = this.getField("NAME").getValue();
      this.getField("NAME").setText(this.register(this.name));
      console.log("Func dec: Name: "+this.name);
      var topBlocks = this.workspace.getTopBlocks();
      if(this.first_run){ //Initialise the parent correctly
          this.first_run = false;
                for(var i = 0; i < topBlocks.length; i++){                  
                    var block = topBlocks[i];
                    if(block.name && topBlocks[i].name=="test_main"){
                        this.symbols = new SymbolDB(block);
                        this.mainBlock = block;
                        if(!block.funcs){
                            block.funcs = new SymbolDB(null);
                        }

              
                        break;
                    }
                }                
      }else{ //Check if the function needs to be renamed
          if(this.name != this.name_old){
             this.name = this.mainBlock.funcs.addFunction(this.name,"function",this.name_old);
             this.name_old = this.name;
             this.getField("NAME").setValue(this.name);
          }
      }
      
      //Create the block based on SymbolDB
      topBlock.initSvg();
      var length = this.symbols.getLength();     
      var connection = topBlock.getInput("PARAMS").connection;
      var connection2 = topBlock.getInput("VARS").connection;
      for(var i = 0;i<length;i++){
          var block = Blockly.Block.obtain(workspace, 'var_decl_in');
          var symbol = this.symbols.getSymbol2(i);
          block.initSvg();
          block.getField("NAME").setText(""+symbol.name);
          switch(symbol.type){
              case 'string':
                  block.getField("TYPE").setValue("string");
                break;
              case 'number':
                  block.getField("TYPE").setValue("number");
                break;
              case 'boolean':
                  block.getField("TYPE").setValue("boolean");
                break;
            case "array":
                console.log("array");
                block.getField("ARRAY").setValue("TRUE");
                block.getField("TYPE").setValue(symbol.stored_type);
                block.appendValueInput("LENGTH")
                     .appendField("Länge: ")
                     .setCheck("non_zero");
                block.appendix = true;
                var num = Blockly.Block.obtain(workspace, 'my_array_number');
                num.initSvg();
                num.getField("numb").setText(parseInt(symbol.max_length));
                block.getInput("LENGTH").connection.connect(num.outputConnection);
                break;
          }
          if(symbol.kind == 0){ //Symbol was a variable
            connection2.connect(block.previousConnection);
            connection2 = block.nextConnection;
          }else if(symbol.kind == 1){ //Symbol was a parameter
            connection.connect(block.previousConnection);
            connection = block.nextConnection; 
          }         
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
        this.parameters = 0;
        var current = block.getInputTargetBlock('PARAMS');
        var warned = false;
        this.symbols.reset();
        while(current){
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
           if(current.getField("ARRAY").getValue()=="TRUE"){
               var len = current.getInputTargetBlock("LENGTH");
               if(len){
                   //If the user specified the length of the array, set it
                this.symbols.addSymbol(name,"array",1,type,parseInt(len.getValue())); 
               }
               else{
                   //otherwise make it 1
                this.symbols.addSymbol(name,"array",1,type,1);   
               }
           }else{
               this.symbols.addSymbol(name,type,1,type); 
           }    
           this.parameters++;
           current = current.nextConnection.targetBlock();
        }  
        current = block.getInputTargetBlock("VARS");
        while(current){
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
           if(current.getField("ARRAY").getValue()=="TRUE"){
               this.symbols.addSymbol(name,"array",0,type); 
           }else{
               this.symbols.addSymbol(name,type,0,type); 
           }    
           current = current.nextConnection.targetBlock();
        }  
        if(warned){
            block.setWarning();
        }
    },
    /*
     * This function cleares all values of this blocks SymbolDB.
     * For more infos see @SymbolDB.clearValues.
     * @return {undefined} nothing
     */
    clearValues: function(){
        this.symbols.clearValues();
    }
    
};

Blockly.Blocks['use_func'] = { //use of functions in the programm
  parameters: null, //the symbols of the used function
  name: "use",
  funcs: null, //the available functions 
  has_output: false, //if this block has an output or not
  old_output: null, //the old output type
  func_block: null, //a reference to the function selected
  pars : 0, //Counts the number of parameters
  count: 0, //Counts the current parameter to be readed in (used in execute)
  first : true, //used for correct initialising
  init: function() {
      var block = this;
      this.pars = 0;
      block.funcs = new SymbolDB(null);
    this.appendDummyInput()   
        .appendField("Rufe: ")
        .appendField(new Blockly.FieldDropdown(function(){
            //This function generates the available functions
            var result = [["EMPTY","EMPTY"]];
            block.first=true;
            var topBlocks = block.workspace.getTopBlocks();
            for(var i = 0; i < topBlocks.length; i++){
                if(topBlocks[i].type=="test_main"){
                    if(topBlocks[i].funcs){
                        block.funcs = topBlocks[i].funcs;
                        console.log(topBlocks[i].funcs);
                        break;
                    }   
                }
            }
           var symbol = null;
            for(var i = 0; i < block.funcs.getLength(); i++){
                   symbol = block.funcs.getSymbol2(i);  
                   console.log(symbol);
                   if(block.first){
                       result = [];
                       block.first=false;
                   }
                   
                   result.push([""+symbol.name,""+symbol.name]);
                   
            }
            return result;
            
        },function(value){
            //If the called function is changed, update this blocks shape
            block.update(value);
            return value;
        }),"FUNC")
        .appendField(" auf"); 
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip('');
  },
  /**
   * This function updates the blocks shape based on the function to be called.
   * @param {String} the name of the function selected in the DropDownMenu
   * @return {undefined} no return
   */
  
  update: function(value){ 
      if(value!="EMPTY"){
        var name = value; 
        var topBlocks = this.workspace.getTopBlocks();
        for(var i = 0; i < topBlocks.length; i++){
                if(topBlocks[i].name==name){
                    if(topBlocks[i].symbols){
                        this.parameters = topBlocks[i].symbols;
                        this.func_block = topBlocks[i];
                        break;
                    }   
                }
        }
        
        //remove all inputs
        for(var i = 0; i < this.pars; i++){
            this.removeInput("PAR"+i);
        }
        this.pars = 0;
       
        if(this.func_block.getField("HAS_RETURN").getValue()=="TRUE"){
             //If the function returns something, append an output on this block
            var val = this.func_block.getField("TYPE").getValue();
            if(!this.old_output || this.old_output != val){
                //if the old and new return type is not the same,
                //disconnect this block (type security)
               this.setParent(null);
               this.removeInput("RETURN");
               this.bumpNeighbours_();
               this.setOutput(true,val);
               this.appendDummyInput("RETURN")
                    .appendField("Liefert: "+val);
            }  
            this.old_output = val;
            this.has_output = true;
            
            
        }else{
            //remove the output, if the function returns nothing
            this.setOutput(false);
            this.removeInput("RETURN");
            this.has_output = false;
            this.old_output = null;
        }
        //Generate an input for every parameter of the function
        for(var i = 0; i< this.parameters.getLength(); i++){
            var symbol = this.parameters.getSymbol2(i);
           if(symbol.kind == 1){ //Check for parameters in the functions dictionary
               if(symbol.type == "array"){
                  this.appendValueInput("PAR"+this.pars)
                      .appendField("Parameter "+symbol.name+" (Array des Types "+symbol.stored_type+"): ")
                      .setCheck(symbol.type);
                      
               }else{
                this.appendValueInput("PAR"+this.pars)
                    .appendField("Parameter "+symbol.name+" (Typ " +symbol.type+"): ")
                    .setCheck(symbol.type);
                }
                this.pars++;
           }
        }       
    }
    else{
        //If no function is selected, remove all inputs
        for(var i = 0; i < this.pars; i++){
            this.removeInput("PAR"+i);
        }
        this.pars = 0;
    }
  },
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {value or null} Returns the return value of the called function or null
   */
  execute: function(interpreter,heapEntry){
    if(heapEntry.step_ == 0){
       if(this.count >= this.pars){ 
           //All parameters are there
           heapEntry.step_ = 2;
       } else{ 
           //Parameters need to be readed in
          interpreter.enqueueBlock(this.getInputTargetBlock("PAR"+this.count),heapEntry,heapEntry.symbols_);
          heapEntry.step_ = 1;

       }
    }
    else if(heapEntry.step_==1){ 
        //Add the value to the parameter list of the function block
        this.func_block.symbols.setSymboli(this.count,heapEntry.result_);
        this.count++;
        heapEntry.result_ = null;
        heapEntry.step_ = 0;
    }
    else if(heapEntry.step_==2){ 
        //All parameters are there, start executing the function
      var topBlocks = this.workspace.getTopBlocks();
      var name = this.getField("FUNC").getValue();
      if(name == "EMPTY"){
          heapEntry.finished_ = true;
          return null;
      }
      for(var i = 0; i < topBlocks.length; i++){
          //search the function
          if(topBlocks[i].type=='function' && topBlocks[i].getFieldValue("NAME")==name){

              interpreter.enqueueBlock(topBlocks[i],heapEntry,heapEntry.symbols_);
              heapEntry.step_ = 3;
              return null;

          }
      }
    }
    else if(heapEntry.step_==3){
        this.count = 0;
        heapEntry.finished_ = true; 

        if(this.has_output){
            return heapEntry.result_;
        }
    }
   return null;
  }
};
/**
 * This block represents an array with a defined length. Can be used to set a 
 * variable which is an array. 
 * @type {Blockly.Block}
 */
Blockly.Blocks["my_array"]={
    length : 1, //the length of this array
    count : 0, //used to check if all parameters are there (used in execute only)
    first: true,
    first_init: true,
    result : new Array(),
    prev_blocks : [],
    init :function(){
        var block = this;
        this.setColour(240);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["string", "string"]
        , ["number", "number"], ["boolean", "boolean"],["array","array"]],function(value){
              //this method updates this block's shape
              //remove the old inputs first
               for(var i = 0; i < block.length; i++){
                   block.removeInput("PAR"+i);
               }
               //and add the new ones (Type security guaranteed)
               for(var i = 0; i < block.length;i++){
                   block.appendValueInput("PAR"+i)
                        .appendField("Stelle "+i+": ")
                        .setCheck(value);
               }
               return value;
            
        }), "TYPE")
            .appendField(" Länge: ")
            .appendField(new Blockly.FieldTextInput("1",function(value){
               if(value < 1){
                   value = 1;
               } 
               //If the value changes, remove all inputs
               for(var i = 0; i < block.length; i++){
                   block.removeInput("PAR"+i);
               }
               block.length = value;
               var type = block.getField("TYPE").getValue();
               //and add enw ones
               for(var i = 0; i < value;i++){
                   block.appendValueInput("PAR"+i)
                        .appendField("Stelle "+i+": ")
                        .setCheck(type); //Type security
               }
               return value;
            }),"numb");
            if(this.first_init){
                //This is optics only
                this.first_init = false;
                this.appendValueInput("PAR0")
                    .appendField("Stelle 0:")
                    .setCheck("string");
            }
            this.setOutput(true,null);
            this.first = true;
    },
    
   /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {Array} Returns an array out of the parameters given
   */
    execute(interpreter, heapEntry){
        if(heapEntry.step_ == 0){
            if(this.first){
                //Used for correct initialisation
                this.first = false;
                this.count = 0;
                this.result = []; 
            }
            if(this.count < this.length ){
                //There are still parameters left
                var block = this.getInputTargetBlock("PAR"+this.count);
                if(block){
                    interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
                }
                this.count++;
                heapEntry.step_ = 1;
            }else{
                //everything is ready
                heapEntry.step_ = 2;
            }
        }else if(heapEntry.step_ == 1){
            //Append the parameter to the result
            this.result.push(heapEntry.result_); 
            heapEntry.result_ = null;
            heapEntry.step_ = 0;
        }else if(heapEntry.step_ == 2){
            this.first = true;
            heapEntry.finished_ = true;            
            return this.result;
        }
        return null;
    }
};
/**
 * This block returns the length of the choosen array.
 * @type {Blockly.Block}
 */
Blockly.Blocks["array_getLength"] ={
    root : null, //the top most block compared to this
    symbols: null, //a copy of the @test_main.symbols. Used for
                                 //creating the DropDownMenu
    init: function(){
        var block = this;
        this.appendDummyInput()
            .appendField("Länge des Arrays ");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(function(){
                //This function generates the available arrays
                var root = block.getRootBlock();
                var result = [["EMPTY","EMPTY"]];
                if(root==block){
                    //Search the mainblock
                    var topBlocks = block.workspace.getTopBlocks();
                    for(var i = 0; i < topBlocks.length; i++){
                        if(topBlocks[i].type=="test_main"){
                            block.symbols = topBlocks[i].symbols;
                            block.root = topBlocks[i];
                            break;
                        }
                    }
                }
                else{
                    if(root.symbols){
                        block.symbols = root.symbols;
                    }
                    block.root = root;
                }
                if(!block.symbols){
                    return result;
                }
                var symbol = null;
                var first = true;
                for(var i = 0; i < block.symbols.getLength(); i++){
                       symbol = block.symbols.getSymbol2(i);
                       //Search all arrays
                       if(symbol.kind == 0 || symbol.kind == 1&&symbol.type == "array"){ 
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

                       if(symbol.kind == 0 || symbol.kind == 1&&symbol.type == "array"){
                           if(first){
                                first = false;
                                result = [];
                            }   
                            if(!block.symbols.checkUsed(symbol.name)){ 
                                //Local variables overwrite global ones
                                result.push([""+symbol.name,""+symbol.name]);
                            }
                       }
                    }
                    parent = parent.getParent();
                }
                return result;
            
            },function(value){
                //Add a bit onformation about the array to the block
                if(value == "EMPTY"){
                    block.getField("INFO").setText("()");
                }else{
                    var symbol = block.symbols.getSymbol(value);
                    block.getField("INFO").setText("(Typ "+symbol.stored_type+")")
                }
                return value;
            }),"NAME")
            .appendField("()","INFO");
        this.setOutput(true,["non_zero","number"]);
        this.setColour(240);
        this.setTooltip("Returns the length of the given array");
    },
    
   /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {non_zero number} Returns the length of the given array or null
   */
    execute: function(interpreter,heapEntry){
        if(heapEntry.step_ == 0){
            var name = this.getField("NAME").getValue();
            heapEntry.finished_ = true;
            var symbol = heapEntry.symbols_.getSymbol(name);
            if(symbol&&symbol.max_length){
                return symbol.max_length;
            }
        }
        
       return null;
    }
};

/**
 * This block is used to set the length of an array (variable) to a new value.
 * Used for creating arrays of dynamic length.
 * @type {Blockly.Block}
 */
Blockly.Blocks["array_setLength"] ={
    symbols: null, //the available arrays
    root: null, //the top most block relative to this
    init: function(){
        var block = this;
        this.appendDummyInput()
            .appendField("Setze Länge des Arrays"); 
        this.appendValueInput("ARRAY")
            .appendField(new Blockly.FieldDropdown(function(){
                var root = block.getRootBlock();
                //generate the available arrays
                var result = [["EMPTY","EMPTY"]];
                if(root==block){
                    var topBlocks = block.workspace.getTopBlocks();
                    for(var i = 0; i < topBlocks.length; i++){
                        if(topBlocks[i].type=="test_main"){
                            block.symbols = topBlocks[i].symbols;
                            block.root = topBlocks[i];
                            break;
                        }
                    }
                }
                else{
                    if(root.symbols){
                        block.symbols = root.symbols;
                    }
                    block.root = root;
                }
                if(!block.symbols){
                    return result;
                }
                var symbol = null;
                var first = true;
                //Search all arrays
                for(var i = 0; i < block.symbols.getLength(); i++){
                       symbol = block.symbols.getSymbol2(i);
                       if(symbol.kind == 0 || symbol.kind == 1&&symbol.type == "array"){ 
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

                       if(symbol.kind == 0 || symbol.kind == 1&&symbol.type == "array"){
                           if(first){
                                first = false;
                                result = [];
                            }   
                            if(!block.symbols.checkUsed(symbol.name)){ 
                                //Local arrays overwrite global ones
                                result.push([""+symbol.name,""+symbol.name]);
                            }
                       }
                    }
                    parent = parent.getParent();
                }
                return result;
            
            },function(value){
                //set some informaitons about the choosen array
                if(value == "EMPTY"){
                    block.getField("INFO").setText("()");
                }
                else{
                    var symbol = block.symbols.getSymbol(value);
                    block.getField("INFO").setText("(Typ "+symbol.stored_type+")");
                }
                return value;
            }),"NAME")
            .setCheck("number")
            .appendField("()","INFO")
            .appendField("auf ");
        
        this.setOutput(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("Sets the length of the given array");
    },
    
   /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {undefined} null
   */
    execute: function(interpreter,heapEntry){
        if(heapEntry.step_ == 0){
            //Read the new length
            var block = this.getInputTargetBlock("ARRAY");
            if(block){
                interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
            }
            heapEntry.step_ = 1;
        }else if(heapEntry.step_ == 1){
            heapEntry.finished_ = true;
            
            if(heapEntry.result <= 0){
                //Ignore the change and dont do anything
            }else{
                //Change the length. See @SymbolDB.setMaxLength for more details
                heapEntry.symbols_.setMaxLength(heapEntry.result_,this.getField("NAME").getValue());
            }
        }
        
        return null;
    }
};
  