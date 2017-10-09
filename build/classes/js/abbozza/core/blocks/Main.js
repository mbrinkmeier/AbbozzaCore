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

Abbozza.Main = {
	symbols : null,
	name: "main",
	
  	init: function() {
	    this.setHelpUrl(Abbozza.HELP_URL);
    	    this.setColour(Abbozza.FUNC_COLOR);
    	    this.appendDummyInput()
        	.appendField(_("MAIN"));
    	    this.appendStatementInput("STATEMENTS")
	        .setCheck("STATEMENT");
	    this.setTooltip('');
            this.setMutator(new Blockly.Mutator());
//		this.setMutator(new DynamicMutator( function() {
//			if ( Configuration.getParameter("option.noArrays") == "true") {
//				return ['devices_num_noconn', 'devices_string_noconn','devices_decimal_noconn', 'devices_boolean_noconn'];			
//			} else if ( Configuration.getParameter("option.linArrays") == "true" ) {
//				return ['devices_num', 'devices_string','devices_decimal', 'devices_boolean','arr_dimension_noconn'];			
//			} else {
//				return ['devices_num', 'devices_string','devices_decimal', 'devices_boolean','arr_dimension'];
//			}
//		}));
    	this.setDeletable(false);
  	},
  
  	setSymbolDB : function(db) {
		this.symbols = db;
	},

	generateCode : function(generator) {
 		
 		var statements = generator.statementToCode(this, 'STATEMENTS', "   ");
 		
 		var code = "";

 		code = code + "void setup() {\n";
 		code = code + this.symbols.toCode("   ");
                code = code + "###setuphook###\n";
 		code = code + Abbozza.blockMain.generateSetupCode(generator);
 		code = code + statements;
 		code = code + "\n}\n";
 		return code;
 	},
 	
 	/*
 	check : function(block) {
 		return "Test";
 	},
 	
 	
 	compose : function(topBlock) {
 		Abbozza.composeSymbols(topBlock,this);
 	},

 	decompose : function(workspace) {
 		return Abbozza.decomposeSymbols(workspace,this,_("LOCALVARS"),false);
 	},
 	
 	mutationToDom: function() {
 		// Abbozza.log("variables to Dom")
 		var mutation = document.createElement('mutation');
 		if (this.symbols != null) mutation.appendChild(this.symbols.toDOM());
 		// Abbozza.log(mutation);
 		return mutation;
	},


	domToMutation: function(xmlElement) {
		var child;
 		// Abbozza.log("variables from Dom")
 		for ( var i = 0; i < xmlElement.childNodes.length; i++) {
 			child = xmlElement.childNodes[i];
 			// Abbozza.log(child);
 			if ( child.tagName == 'symbols') {
 				if ( this.symbols == null ) {
 					this.setSymbolDB(new SymbolDB(null));
 				}
 				this.symbols.fromDOM(child);
 				// Abbozza.log(this.symbols);
 			}
 		}
	},
	
	
	updateLook: function() {
		
		var no = 0;
		while ( this.getInput("VAR"+no) ) {
			this.removeInput("VAR"+no);
			no = no+1;
		}
 		no = 0;
		while ( this.getInput("PAR"+no) ) {
			this.removeInput("PAR"+no);
			no = no+1;
		}

		var entry;
		var variables = this.symbols.getVariables(true);
 		for ( var i = 0; i < variables.length; i++ ) {
 			entry = variables[i];
   			this.appendDummyInput("VAR"+i).appendField(_(entry[1]) + " " + entry[0] + Abbozza.lenAsString(entry[2]));
   			if ( this.getInput("STATEMENTS")) this.moveInputBefore("VAR"+i,"STATEMENTS");
 		}		
	}


};
*/
/*
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
    var envir = new Environment();
    context.echo("Started...");
    exec = function(){
        
        if(envir.ready!=0 && block){
            envir.setReady(0);
            block.execute(context,envir);
            block = block.nextConnection && block.nextConnection.targetBlock();
        }
        else{
            if(!block){
                clearInterval(interval);
                context.echo('Play succesfull!');
            }
            else{
                context.echo("Waiting...");
            }
        }
    };
    var interval = setInterval(exec,100);
   
  }
};*/
