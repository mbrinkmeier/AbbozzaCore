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

/**
 * This block represents a do-while-loop.
 * @type {Blockly.Block}
 */
Blockly.Blocks['do_while'] = {

  init: function() {
    this.appendDummyInput()
        .appendField("do");
    this.appendStatementInput("loop")
        .setCheck(null)
    this.appendValueInput("condition")
        .setCheck("boolean")
        .appendField("while");
    this.appendDummyInput()
        .appendField(" is true");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('A simple do-while loop');
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
          //Execute the blocks
          var block = this.getInputTargetBlock("loop");

          if(block){
            interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 1;
      } else if(heapEntry.step_ == 1){
          //Read in the condition
          block = this.getInputTargetBlock("condition");
          if(block){
            interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 2;
          
      }else if(heapEntry.step_ == 2){
          //Repeat everything, if the condition is true
         if(heapEntry.result_){
            heapEntry.step_ = 0;
         }
         else{
            heapEntry.step_ = 3;
         }
      }else if(heapEntry.step_ == 3){
          heapEntry.finished_ = true;

      }
          
      return null;
      
      
      
      
    }
};

/**
 * This block represents a while-loop.
 * @type {Blockly.Block}
 */
Blockly.Blocks['conditional_while'] = {

  init: function() {
    this.appendValueInput("condition")
        .setCheck("boolean")
        .appendField("while");
    this.appendDummyInput()
        .appendField("is true");
    this.appendStatementInput("loop")
        .setCheck(null)
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('A simple while loop');
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
          var block = this.getInputTargetBlock("condition");
          //execute the condition
          if(block){
            interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 1;
      } else if(heapEntry.step_ == 1){
          //If the condition is true, execute the blocks
          if(heapEntry.result_ == true){
              block = this.getInputTargetBlock("loop");
              if(block){
                interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
              }
              heapEntry.step_ = 0;

          }
          //otherwise everything is done
          else{
              heapEntry.finished_ = true;
          }
      }         
      return null;     
    }
};

/**
 * Waits for a user's input and executes the blocks based on it.
 * @type {Blockly.Block}
 */
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
    this.setColour(290);
    this.setTooltip('Type yes or no on console for desicions');
    this.setHelpUrl('');
  },
  
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {undefined} null
   */
  execute: function(interpreter,heapEntry){
   var context = interpreter.context_;
 
    if ( heapEntry.step_ == 0 ) {
        heapEntry.step_ = 1;
        heapEntry.stalled_ = true;
        context.myread("Bitte ja oder nein eingeben: ", function(entered) { 
            heapEntry.temp = entered;
            heapEntry.stalled_ = false;
            heapEntry.step_ = 2; 
            heapEntry.interpreter_.continue();
        } );    
        context.focus();
    } else if ( heapEntry.step_ == 1 ) {
        // Do nothing. Just wait 
    } else if (heapEntry.step_==2){
         heapEntry.step_ = 3;
        //If the input is given, continue
        if(heapEntry.temp.match(/yes/i)||heapEntry.temp.match(/ja+/i)){
            var block = this.getInputTargetBlock("yes");
            if(block){
                interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
            }
        }
        else if(heapEntry.temp.match(/no+/i)||heapEntry.temp.match(/nein/i)){
            block = this.getInputTargetBlock("no");
            if(block){
                interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
            }
        }else{
            //If the input could not be matched, ask for another one
           context.echo("Eingabe nicht erkannt"); 
           heapEntry.step_ = 0;
        }
       
    } else if ( heapEntry.step_ == 3) {
        heapEntry.finished_ = true;
    }  
    return null;
   }
};

/**
 * This block represents a natural number grater 0. Used for defining the length
 * of arrays.
 * @type {Blockly.Block}
 */
Blockly.Blocks['my_array_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("1",function(value){
            value = parseInt(value);
            //Check if the value is >=1
            if(!value||value < 1||isNaN(value)){
                value = 1;
            }
            return value;
        }), "numb");
    this.setOutput(true, ["non_zero","number"]);
    this.setColour(240);
    this.setTooltip('A positive, non zero number');
    this.setHelpUrl('');
  },
  /**
   * 
   * @return {positive, non zero number} The number in this block
   */
  getValue: function(){
    return this.getFieldValue("numb");  
  },
  /**
   * 
   * @param {number} The new number of this field
   * @return {undefined} no return
   */
  setValue: function(value){
      value = parseInt(value);
      if(!value||value<1||isNaN(value)){
          value = 1;
      }
      this.getField("numb").setValue(value);
  },
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {positive, non zero number} The number of this block
   */
  execute: function(interpreter,heapEntry){
      var numb = parseInt(this.getFieldValue("numb"));
      heapEntry.finished_ = true;
      return numb;
  }
};

/**
 * This block represents a general float number
 * @type {Blockly.Block}
 */
Blockly.Blocks['my_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("0",function(value){
            value = parseFloat(value);
            if(!value||isNaN(value)){
                //If no input is given or it can not be parsed to a float
                return 0;
            }
            return value;
    }), "numb");
    this.setOutput(true, "number");
    this.setColour(65);
    this.setTooltip('A float number');
    this.setHelpUrl('');
  },
  /**
   * 
   * @return {float} the number of this field
   */
  getValue: function(){
    return this.getFieldValue("numb");  
  },
  /**
   * 
   * @param {type} value
   * @return {undefined}
   */
  setValue: function(value){
    value = parseFloa(value);
    if(!value||isNaN(value)){
        //If no input is given or it can not be parsed to a float
        value = 0;
    }
    this.getField("numb").setValue(value);
  },
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {float} The number of this block
   */
  execute: function(interpreter,heapEntry){
      var numb = parseFloat(this.getFieldValue("numb"));
      heapEntry.finished_ = true;
      return numb;
  }
};

/**
 * This block represents the boolean value true
 * @type {Blockly.Block}
 */
Blockly.Blocks['my_true'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("true");
    this.setOutput(true, "boolean");
    this.setColour(260);
    this.setTooltip('true');
    this.setHelpUrl('');
  },
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {boolean} true
   */
  execute:function(interpreter,heapEntry){
     
      heapEntry.finished_ = true;
      return true;
  }
};

/**
 * This block represents null
 * @type {Blockly.Block}
 */
Blockly.Blocks['my_null'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("null");
    this.setOutput(true, null);
    this.setTooltip('null');
    this.setHelpUrl('');
  },
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {undefined} null
   */
  execute:function(interpreter,heapEntry){
     
      heapEntry.finished_ = true;
      return null;
  }
};

/**
 * This block represents a positive number >=0
 * @type {Blockly.Block}
 */
Blockly.Blocks["my_non_negative"]= {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("0",function(value){
                value = parseInt(value);
                if(!value||value < 0||isNaN(value)){
                    value = 0;
                }
                return value;
            }), "numb");
        this.setOutput(true, ["non_neg","number"]);
        this.setColour(240);
        this.setTooltip('A non negative, natural number');
        this.setHelpUrl('');
    },
    /**
     * 
     * @return {non negaitve number} the value of this block
     */
    getValue: function(){
      return this.getFieldValue("numb");  
    },
    /**
     * 
     * @param {number} The new value of the field
     * @return {undefined} no return
     */
    setValue: function(value){
          value = parseInt(value);
          if(!value||value < 0||isNaN(value)){
              value = 0;
          }
          this.getField("numb").setValue(value);
    },
   /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {non negative, natural number} the value of this block
   */
    execute: function(interpreter,heapEntry){
        var numb = parseInt(this.getFieldValue("numb"));
        heapEntry.finished_ = true;
        return numb;
    }
};

/**
 * This block represents the boolean value false
 * @type {Blockly.Block}
 */
Blockly.Blocks['my_false'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("false");
    this.setOutput(true, "boolean");
    this.setColour(260);
    this.setTooltip('false');
    this.setHelpUrl('');
  },
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {boolean} false
   */
  execute:function(interpreter,heapEntry){
      
      heapEntry.finished_ = true;
      return false;
  }
};

/**
 * This block represents an if-else-construct
 * @type {Blocly.Block}
 */
Blockly.Blocks['cond_if'] = {
  init: function() {
    this.appendValueInput("condition")
        .setCheck("boolean")
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
    this.setColour(260);
    this.setTooltip('If-else construct');
  },
  
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {undefined} null
   */
  execute: function(interpreter,heapEntry){
      //Parse the condition
      if(heapEntry.step_ == 0){
         var block = this.getInputTargetBlock("condition");
         if(block){
             interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
         }
         heapEntry.step_ = 1;
          
      }else if(heapEntry.step_ == 1){
          var block = null;
          //execute the correct part of the block
          if(heapEntry.result_ == true){
              block = this.getInputTargetBlock("then");
          } else if(heapEntry.result_ == false){
              block = this.getInputTargetBlock("else");
          } else{
              interpreter.context_.echo("ERROR!");
              heapEntry.step_ = 2;
              return null;
          }
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 2;
      } else if(heapEntry.step_ == 2){
          heapEntry.finished_ = true;
      }
      
      return null;
  }     
};

/**
 * This block represents a counting loop.
 * @type {Blockly.Block}
 */
Blockly.Blocks['repeat'] = {
    goal: 0, //the amount of repeats of this block
    count: 0, //the current reached amount of repeats
  init: function() {
    this.appendValueInput("times")
        .setCheck("number")
        .appendField("repeat");
    this.appendDummyInput()
        .appendField("times");
    this.appendStatementInput("loop")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('Repead this block x times');
    this.setHelpUrl('');
  },
  
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {undefined} null
   */
  execute :function(interpreter,heapEntry){
      if(heapEntry.step_ == 0){
          //Get the amount of repeats
          block = this.getInputTargetBlock("times");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 1;
      } else if(heapEntry.step_ == 1||heapEntry.step_==2){
          if(heapEntry.step_ == 1){
              //Initialise everyting correctly
              if(heapEntry.result_ <= 0){
                  heapEntry.finished_ = true;
                  return null;
              }
              this.goal = heapEntry.result_;
              heapEntry.step_ = 2;
          }


          var block = this.getInputTargetBlock("loop");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          this.count++;
          if(this.count == this.goal){
              heapEntry.step_ = 3;            
          }
         
      }else if(heapEntry.step_ == 3){
             heapEntry.finished_ = true;
         }
      return null;
  }
};

/**
 * This block compares its input with each other based on the chosen operation
 * @type {Blockly.Block}
 */
Blockly.Blocks['logical_compare'] = {
  init: function() {
    this.appendValueInput("val_one");
    this.appendValueInput("val_two")
        .appendField(new Blockly.FieldDropdown([["==", "equals"], ["!=", "non_equals"], ["<", "less"], ["<=", "less_equal"], [">", "greater"], [">=", "greater_equal"]]), "OPTIONS");
    this.setOutput(true, "boolean");
    this.setColour(260);
    this.setTooltip('Compare the inputs with each other');
    this.setHelpUrl('');
    this.prevBlocks_ = [null, null]; // used for type security of the parameters
  },
  /**
   * If an input is changed, check both inputs' types. If they missmatch, 
   * disconnect the older one
   * @return {undefined}
   */
  onchange: function() {
    var blockA = this.getInputTargetBlock('val_one');
    var blockB = this.getInputTargetBlock('val_two');
    // Disconnect blocks that existed prior to this change if they don't match.
    if (blockA && blockB &&
        !blockA.outputConnection.checkType_(blockB.outputConnection)) {
      // Mismatch between two inputs.  Disconnect previous and bump it away.
      for (var i = 0; i < this.prevBlocks_.length; i++) {
        var block = this.prevBlocks_[i];
        if (block === blockA || block === blockB) {
          block.setParent(null);
          block.bumpNeighbours_();
        }
      }
    }
    this.prevBlocks_[0] = blockA;
    this.prevBlocks_[1] = blockB;
  },
  
  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {boolean} The result of the compare
   */
  execute: function(interpreter,heapEntry){
      if(heapEntry.step_ == 0){        
         var block = this.getInputTargetBlock("val_one");
         if(block){
             interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
         }else{
             heapEntry.finished_ = true;
             return false;
         }
         heapEntry.step_ = 1;
      } else if(heapEntry.step_ == 1){
         heapEntry.temp_ = heapEntry.result_;
         var block = this.getInputTargetBlock("val_two");
         if(block){
             interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
         }else{
             heapEntry.finished_ = true;
             return false;
         }
         heapEntry.step_ = 2;
      } else if(heapEntry.step_ == 2){
            var mode = this.getFieldValue("OPTIONS");
            heapEntry.finished_ = true;
            if(heapEntry.temp_.length && heapEntry.result_.length){
                //If both inputs are arrays of the same length
                //compare each value individually
                if(heapEntry.temp_.length == heapEntry.result_.length){
                    for(var i = 0; i < heapEntry.temp_.length;i++){
                        switch(mode){
                            case "equals": 
                                if(heapEntry.temp_[i] != heapEntry.result_[i]){
                                    return false;
                                }
                                break;
                            case "non_equals":
                                if(heapEntry.temp_[i] == heapEntry.result_[i]){
                                    return false;
                                }
                                break;
                            case "less":
                                if(heapEntry.temp_[i] >= heapEntry.result_[i]){
                                    return false;
                                }
                                break;
                            case "less_equal":
                                if(heapEntry.temp_[i] > heapEntry.result_[i]){
                                    return false;
                                }
                                break;
                            case "greater":
                                if(heapEntry.temp_[i] <= heapEntry.result_[i]){
                                    return false;
                                }
                                break;
                            case "greater_equal":
                                if(heapEntry.temp_[i] > heapEntry.result_[i]){
                                    return false;
                                }
                                break;
                        }
                    }
                    return true;
                }
            }else if(heapEntry.temp_.length&&!heapEntry.result_.length){
                //If one is an array and the other one not
                //compare the values of the array with the single value
                //one by one
                for(var i = 0; i < heapEntry.temp_.length;i++){
                    switch(mode){
                        case "equals": 
                            if(heapEntry.temp_[i] != heapEntry.result_){
                                return false;
                            }
                            break;
                        case "non_equals":
                            if(heapEntry.temp_[i] == heapEntry.result_){
                                return false;
                            }
                            break;
                        case "less":
                            if(heapEntry.temp_[i] >= heapEntry.result_){
                                return false;
                            }
                            break;
                        case "less_equal":
                            if(heapEntry.temp_[i] > heapEntry.result_){
                                return false;
                            }
                            break;
                        case "greater":
                            if(heapEntry.temp_[i] <= heapEntry.result_){
                                return false;
                            }
                            break;
                        case "greater_equal":
                            if(heapEntry.temp_[i] > heapEntry.result_){
                                return false;
                            }
                            break;
                    }
                }
                return true;
            }else if(!heapEntry.temp_.length&&heapEntry.result_.length){
                for(var i = 0; i < heapEntry.result_.length;i++){
                    switch(mode){
                        case "equals": 
                            if(heapEntry.temp_ != heapEntry.result_[i]){
                                return false;
                            }
                            break;
                        case "non_equals":
                            if(heapEntry.temp_ == heapEntry.result_[i]){
                                return false;
                            }
                            break;
                        case "less":
                            if(heapEntry.temp_ >= heapEntry.result_[i]){
                                return false;
                            }
                            break;
                        case "less_equal":
                            if(heapEntry.temp_ > heapEntry.result_[i]){
                                return false;
                            }
                            break;
                        case "greater":
                            if(heapEntry.temp_ <= heapEntry.result_[i]){
                                return false;
                            }
                            break;
                        case "greater_equal":
                            if(heapEntry.temp_ > heapEntry.result_[i]){
                                return false;
                            }
                            break;
                    }
                }
                return true; 
            }else{             
                //both inputs are no arrays, so jsut compare them
                switch(mode){
                    case "equals": 
                        return (heapEntry.temp_ == heapEntry.result_);
                        break;
                    case "non_equals":
                        return (heapEntry.temp_ != heapEntry.result_);
                        break;
                    case "less":
                        return (heapEntry.temp_ < heapEntry.result_);
                        break;
                    case "less_equal":
                        return (heapEntry.temp_ <= heapEntry.result_);
                        break;
                    case "greater":
                        return (heapEntry.temp_ > heapEntry.result_);
                        break;
                    case "greater_equal":
                        return (heapEntry.temp_ >= heapEntry.result_);
                        break;
              
                 
                  
                }
            }
        }
      return null;
  }
};

/**
 * This block does mathematics with the given inputs.
 * @type {Blockly.BLock}
 */
Blockly.Blocks['math_operators'] = {
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.MATH_ADDITION_SYMBOL, 'ADD'],
         [Blockly.Msg.MATH_SUBTRACTION_SYMBOL, 'MINUS'],
         [Blockly.Msg.MATH_MULTIPLICATION_SYMBOL, 'MULTIPLY'],
         [Blockly.Msg.MATH_DIVISION_SYMBOL, 'DIVIDE'],
         [Blockly.Msg.MATH_POWER_SYMBOL, 'POWER'],
         ["%","MOD"]];
    this.setHelpUrl(Blockly.Msg.MATH_ARITHMETIC_HELPURL);
    this.setColour(65);
    this.setOutput(true, 'number');
    this.appendValueInput('A')
        .setCheck('number');
    this.appendValueInput('B')
        .setCheck('number')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'ADD': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
        'MINUS': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
        'MULTIPLY': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
        'DIVIDE': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE,
        'POWER': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER,
        "MOD": "Modulo"
      };
      return TOOLTIPS[mode];
    });
  },

  /*
   * This function executes the block.
   * @param {interpreter} the interpreter running the block
   * @param {heapEntry} the heapEntry of this block
   * @return {number} The result of the operation
   */
  execute: function(interpreter,heapEntry){
      if(heapEntry.step_==0){
         var block = this.getInputTargetBlock("A");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_=1;
      } else if(heapEntry.step_==1){
          heapEntry.temp_ = heapEntry.result_;
          var block = this.getInputTargetBlock("B");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_=2;
      } else if(heapEntry.step_==2){
          var mode = this.getFieldValue("OP");
          heapEntry.finished_ = true;
          //Based on the operation selected, do the mathematics
          switch(mode){
              case "ADD":
                  return parseFloat(heapEntry.temp_) + parseFloat(heapEntry.result_);
                  break;
              case "MINUS":
                  return heapEntry.temp_ - heapEntry.result_;
                  break;
              case "MULTIPLY":
                  return heapEntry.temp_ * heapEntry.result_;
                  break;
              case "DIVIDE":
                  if(heapEntry.result_ != 0){
                    return heapEntry.temp_ / heapEntry.result_;
                  }else{
                      interpreter.context_.echo("Division mit Null!");
                      interpreter.error_ = true;
                      return 0;
                  }
                  break;
              case "POWER":
                  return Math.pow(heapEntry.temp_,heapEntry.result_);
                  break;
              case "MOD":
                  return parseFloat(heapEntry.temp_) % parseFloat(heapEntry.result_);
                  break;
          }
      }
      return null;
  }
};