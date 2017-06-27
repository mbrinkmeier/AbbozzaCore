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


Blockly.Blocks['do_while'] = {

  init: function() {

    this.appendDummyInput()
        .appendField("do");
    this.appendStatementInput("loop")
        .setCheck(null)
    this.appendValueInput("condition")
        .setCheck("Boolean")
        .appendField("while");
    this.appendDummyInput()
        .appendField(" is true");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute: function(interpreter,heapEntry){
      if(heapEntry.step_ == 0){
          block = this.getInputTargetBlock("loop");

          if(block){
            interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 1;
      } else if(heapEntry.step_ == 1){
          block = this.getInputTargetBlock("condition");
          if(block){
            interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 2;
          
      }else if(heapEntry.step_ == 2){
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
  
  execute: function(interpreter,heapEntry){
      if(heapEntry.step_ == 0){
          block = this.getInputTargetBlock("condition");

          if(block){
            interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 1;
      } else if(heapEntry.step_ == 1){
          
          console.log(heapEntry.result_);
          if(heapEntry.result_ == true){
              block = this.getInputTargetBlock("loop");
              if(block){
                interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
              }
              heapEntry.step_ = 0;

          }
          else{
              heapEntry.step_ = 2;
          }
      }else if(heapEntry.step_ == 2){
          heapEntry.finished_ = true;
      }
          
      return null;
      
      
      
      
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
    this.setHelpUrl('');
    },
    
    execute: function(interpreter,heapEntry){
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
          // If the input was evaluated, continue
          // The result of the subblock is in wrpper.result_
          interpreter.context_.echo(heapEntry.result_);
          heapEntry.finished_ = true;
      }
      return null;
  }

    
};

Blockly.Blocks['read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("read")
        .appendField(new Blockly.FieldTextInput("<default>"),"PROMPT");
    this.setTooltip('');
    this.setOutput(true,"STRING");
    this.setHelpUrl('Abbozza.HELP_URL');
    this.setDeletable(true);
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
    this.setTooltip('Type yes or no on console for desicions');
    this.setHelpUrl('http://www.example.com/');
  },
  
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
        
        if(heapEntry.temp.match(/yes/i)||heapEntry.temp.match(/ja+/i)){
            block = this.getInputTargetBlock("yes");
            console.log(block);
            console.log(typeof block);
            if(block){
                interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
                console.log("ja");
            }
        }
        else if(heapEntry.temp.match(/no+/i)||heapEntry.temp.match(/nein/i)){
            block = this.getInputTargetBlock("no");
            if(block){
                interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
                console.log("nein");
            }
        }else{
           context.echo("Eingabe nicht erkannt"); 
        }
        heapEntry.step_ = 3;
    } else if ( heapEntry.step_ == 3) {
        console.log("finished reading");
        heapEntry.finished_ = true;
    }
   
    return null;
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
  
  execute: function(interpreter,heapEntry){
      numb = this.getFieldValue("numb");
      heapEntry.finished_ = true;
      return numb;
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
  
  execute:function(interpreter,heapEntry){
     
      heapEntry.finished_ = true;
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
  
  execute:function(interpreter,heapEntry){
      
      heapEntry.finished_ = true;
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
  
  execute: function(interpreter,heapEntry){
      
      if(heapEntry.step_ == 0){
         block = this.getInputTargetBlock("condition");
         if(block){
             interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
         }
         heapEntry.step_ = 1;
          
      }else if(heapEntry.step_ == 1){
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

Blockly.Blocks['repeat'] = {
    goal: 0,
    count: 0,
  init: function() {
    this.appendValueInput("times")
        .setCheck("Number")
        .appendField("repeat");
    this.appendDummyInput()
        .appendField("times");
    this.appendStatementInput("loop")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute :function(interpreter,heapEntry){
      if(heapEntry.step_ == 0){
          block = this.getInputTargetBlock("times");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 1;
      } else if(heapEntry.step_ == 1||heapEntry.step_==2){
          if(heapEntry.step_ == 1){
              if(heapEntry.result_ <= 0){
                  heapEntry.finished_ = true;
                  return null;
              }
              this.goal = heapEntry.result_;
              console.log("Result: "+heapEntry.result_);
              heapEntry.step_ = 2;
          }


          block = this.getInputTargetBlock("loop");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          this.count++;
          if(this.count == this.goal){
              heapEntry.step_ = 3;
              return null;
          }


          
      } else if (heapEntry.step_ == 3){

          heapEntry.finished_ = true;
      }
      return null;
  }
};
/*
Blockly.Blocks['create_var'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Variable erzeugen:");
    this.appendValueInput("name")
        .setCheck("STRING")
        .appendField("Name");
    this.appendValueInput("input")
        .setCheck(null)
        .appendField("Input");
    this.appendValueInput("type")
        .setCheck("STRING")
        .appendField("Typ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute: function(interpreter, heapEntry){
      if(heapEntry.step_==0){
          block = this.getInputTargetBlock("name");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 1;
      }else if(heapEntry.step_==1){
          heapEntry.temp = heapEntry.result_;
           block = this.getInputTargetBlock("input");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 2;
      }else if(heapEntry.step_==2){
          heapEntry.temp_ = heapEntry.result_;
           block = this.getInputTargetBlock("type");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_ = 3;
      }else if(heapEntry.step_==3){
        var name = heapEntry.temp, input = heapEntry.temp_, type = heapEntry.result_;
        if(!type){
            if((typeof input) != "object"&& (typeof input) != "undefined"){
                type = typeof input;
            }
        }
        heapEntry.symbols_.addSymbol2(name,type,0,input,true);
        heapEntry.finished_ = true;
      }
      
      return null;
  }
};

Blockly.Blocks['use_var'] = {
  init: function() {
    this.appendValueInput("name")
        .setCheck("STRING")
        .appendField("Variable ");
    this.setOutput(true, null);
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  
  execute: function(interpreter,heapEntry){
      if(heapEntry.step_==0){
          block = this.getInputTargetBlock("name");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_=1;
      }else if(heapEntry.step_==1){
          var name = heapEntry.result_;
          var sym = heapEntry.symbols_.getSymbol(name);
          heapEntry.finished_ = true;
          if(sym){
            return sym.value;
          }
           
      }
      return null;
  }
};
*/
Blockly.Blocks['logical_compare'] = {
  init: function() {
    this.appendValueInput("val_one")
        .setCheck(null);
   this.appendValueInput("val_two")
        .setCheck(null)
        .appendField(new Blockly.FieldDropdown([["==", "equals"], ["!=", "non_equals"], ["<", "less"], ["<=", "less_equal"], [">", "greater"], [">=", "greater_equal"]]), "OPTIONS");
    this.setOutput(true, "Boolean");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  execute: function(interpreter,heapEntry){
      if(heapEntry.step_ == 0){
         block = this.getInputTargetBlock("val_one");
         if(block){
             interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
         }
         heapEntry.step_ = 1;
      } else if(heapEntry.step_ == 1){
         heapEntry.temp_ = heapEntry.result_;
         block = this.getInputTargetBlock("val_two");
         if(block){
             interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
         }
         heapEntry.step_ = 2;
      } else if(heapEntry.step_ == 2){
          mode = this.getFieldValue("OPTIONS");
          console.log(mode);
          heapEntry.finished_ = true;
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
      return null;
  }
};
Blockly.Blocks['math_operators'] = {
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.MATH_ADDITION_SYMBOL, 'ADD'],
         [Blockly.Msg.MATH_SUBTRACTION_SYMBOL, 'MINUS'],
         [Blockly.Msg.MATH_MULTIPLICATION_SYMBOL, 'MULTIPLY'],
         [Blockly.Msg.MATH_DIVISION_SYMBOL, 'DIVIDE'],
         [Blockly.Msg.MATH_POWER_SYMBOL, 'POWER']];
    this.setHelpUrl(Blockly.Msg.MATH_ARITHMETIC_HELPURL);
    this.setColour(Blockly.Blocks.math.HUE);
    this.setOutput(true, 'Number');
    this.appendValueInput('A')
        .setCheck('Number');
    this.appendValueInput('B')
        .setCheck('Number')
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
        'POWER': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER
      };
      return TOOLTIPS[mode];
    });
  },

  execute: function(interpreter,heapEntry){
      if(heapEntry.step_==0){
          block = this.getInputTargetBlocks("A");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_=1;
      } else if(heapEntry.step_==1){
          heapEntry.temp_ = heapEntry.result_;
          block = this.getInputTargetBlocks("B");
          if(block){
              interpreter.enqueueBlock(block,heapEntry,heapEntry.symbols_);
          }
          heapEntry.step_=2;
      } else if(heapEntry.step_==2){
          mode = this.getFieldValue("OP");
          console.log(mode);
          heapEntry.finished_ = true;
          switch(mode){
              case "ADD":
                  return heapEntry.temp_ + heapEntry.result_;
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
          }
      }
      return null;
  }
};