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

/**
 * This function creates a symbols to be used as entry in the SymbolDB
 * @param {String} _name the smybols name
 * @param {String} _type the symbols type
 * @param {number} _kind the symbols kind
 * @param {boolean} _global if the symbol is global or not
 * @return {Symbol} An entry in the SymbolDB
 */
function Symbol(_name,_type,_kind,_global) {
    this.name = _name;
    this.max_length = 1;
    this.type = _type;
    this.stored_type = _type; //will be used for arrays
    this.kind = _kind;
    this.value = null;
    this.global = _global;
    this.count = 0;
}

/**
 * 
 * @return {string} the type of this symbol
 */
Symbol.prototype.getType = function(){
    return this.type;
}
/**
 * 
 * @return {String} A printable version of this symbol
 */
Symbol.prototype.toString = function(){
    return "Name: "+this.name+"\n Typ: "+this.type+"\n Art: "+this.kind + " \n max_length "+this.max_length +"\n value: "+this.value;
}
Symbol.prototype.VARIABLE = 0;
Symbol.prototype.PARAMETER = 1;
Symbol.prototype.OPERATION = 2;


/**
 * This function creates a new SymbolDB for storing symbols.
 * @param {Block} _parent The parent block of this SymbolDB (null if no parent)
 * @return {SymbolDB} A new SymbolDB
 */
function SymbolDB(_parent) {
    this.parent = _parent;
    this.symbols = new Array();
    this.count = 0;
}

/**
 * This function sets the length of a stored array. If the new length
 * is < 1 or if no @name is given, nothing happens.
 * @param {non zero, positive number} value The new array length
 * @param {String} name The name of the array in the SymbolDB
 * @return {undefined}
 */
SymbolDB.prototype.setMaxLength = function(value, name){
    value = parseInt(value);
    if(value < 1||!name||isNaN(value)){
        console.log("nothing changed");
        return;
    }
    //Search the array
    for(var i = 0; i< this.symbols.length;i++){
        var symbol = this.symbols[i];
        if(symbol.name == name){
            this.symbols[i].max_length = value;
            var result = new Array(value);
            //Copy as many 'old' values of the array to the new one as possible
            for(var j = 0; j < symbol.value.length && j < result.length; j++){
                result[j] = symbol.value[j];
            }
            this.symbols[i].value = result;
        }
    }    
}

/**
 * Checks if a name contains forbidden symbols.
 * @param {String} name The name to be checked
 * @return {boolean} If the name is valid or not
 */
SymbolDB.prototype.checkName = function(name) {
    return name.match(/.[_a-zA-Z]*[^\s]/);
}

/**
 * Returns the symbol in this SymbolDB at the postion @pos
 * @param {number} pos The position
 * @return {value} value The symbol in this SymbolDB at the position @pos or null,
 *                 if the position is invalid.
 */
SymbolDB.prototype.getSymbol2 = function(pos){
    if(this.symbols.length-1 < pos|| pos < 0){return null;}
    return this.symbols[pos];
}

/**
 * Sets the @pos's symbol's value of this SymbolDB to @value
 * @param {number} pos the position
 * @param {value} value The new value
 * @return {unresolved} null, if the position is invalid or nothing
 */
SymbolDB.prototype.setSymboli = function(pos,value){
    if(this.symbols.length-1 < pos||pos < 0){
        return null;
    }
    this.symbols[pos].value = value;
    
}

/**
 * 
 * @return {number} The length of this SymbolDB
 */
SymbolDB.prototype.getLength = function(){
    return this.symbols.length;
}

/*
 * This function looks up a symbol in this SymbolDB
 * @param {String} name The name of the symbol to be found
 * @return {Symbol} The symbol with the name @name
 */
SymbolDB.prototype.getSymbol = function(name) {
    var i = 0;
    while ( i < this.symbols.length ) {
           if ( this.symbols[i].name == name ) {
              return  this.symbols[i];
           }
        i = i+1;
    }
    
    if ( this.parent && this.parent.symbols) {
        return this.parent.symbols.getSymbol(name);
    }
    
    return null;
}

/**
 * This method adds a function to the dictionary or renames it.
 * @param {String} name_new The new name of the function
 * @param {String} type The type of the function (removable?)
 * @param {String} name_old The old name of the function
 * @return {String} The name of the registered function
 */
SymbolDB.prototype.addFunction = function(name_new,type,name_old) {
    var name = name_new;
    var count = 0;
    if(!name_old){
        //If old name is null, the function can not be in the SymbolDB
        while(this.checkUsed(name)){
            name = name_new + count;
            count++;
        }
        var sym = new Symbol(name,type,2);
        this.symbols.push(sym);
    }else if(name_new != name_old){
        //If names aren't the same, rename the funciton in the dictionary
        for(var i = 0; i < this.symbols.length;i++){
            var symbol = this.symbols[i];
            if(symbol.name == name_old){
                while(this.checkUsed(name,name_old)){
                    name = name_new + count;
                    count++;
                }
                symbol.name = name;
                
            }
        }
    }else if(!this.checkUsed(name_new)){
        //If names are the same and it isn't inside the dictionary, so add it
        var sym = new Symbol(name,type,2);
        this.symbols.push(sym);
    }
    
    return name;
}

/**
 * Adds a symbol to this SymbolDB
 * @param {String} name The name of the new symbol
 * @param {String} type The type of the new symbol
 * @param {number} kind The kind of the new symbol
 * @param {String} storedType The stored_type of the new symbol
 * @param {number} max_length The length of the new symbol
 * @return {Symbol} The new symbol or an old one with the same name
 */
SymbolDB.prototype.addSymbol = function(name,type,kind,storedType,max_length) {
    if (!this.checkName(name)) return null;
    
    var i = 0;
    while ( i < this.symbols.length ) {
           if ( this.symbols[i].name == name ) {
              return  this.symbols[i];
           }
        i = i+1;
    }
    
    var sym = new Symbol(name,type,kind);
    if(sym.type == "array"){
        sym.stored_type = storedType;
        sym.value = new Array(parseInt(max_length));
        sym.max_length = max_length;
        console.log(max_length);
    }
    this.symbols.push(sym);
    return null;
}

/**
 * Adds a new symbol to the DB and set it's value. (Unused)
 * @param {String} name The name of the new symbol
 * @param {String} type The type of the new symbol
 * @param {number} kind the kind of the new symbol
 * @param {vlaue} value the value of the new symbol
 * @param {boolean} global if the new symbol is a global one or not
 * @return {Symbol} The new symbol or an old one with the name @name
 */
SymbolDB.prototype.addSymbol2 = function(name,type,kind,value,global) {
    if (!this.checkName(name)) return null;
    
    var i = 0;
    while ( i < this.symbols.length ) {
           if ( this.symbols[i].name == name ) {
              return  this.symbols[i];
           }
        i = i+1;
    }
    
    var sym = new Symbol(name,type,kind);
    sym.value = value;
    sym.global = global;
    this.symbols.push(sym);
    console.log(sym);
    return null;
}

/**
 * This function drops the old SymbolDB and creates a new one.
 * @return {undefined} no return
 */
SymbolDB.prototype.reset = function(){
    this.symbols = new Array();
    this.count = 0;
}

/**
 * 
 * @return {String} A printable version of this SymbolDB
 */
SymbolDB.prototype.toString = function(){
    var result = "\n";
    if(this.getLength()==0){return "Empty";}
    for(var i = 0; i < this.getLength() ; i++){
        result = result + this.symbols[i].toString()+"\n";
    }
    result = result + "\n parent " + this.parent;
    return result;
}

/**
 * This function tries to get its parents SymbolDB
 * @return {SymbolDB} This SymbolDB's parent's SymbolDB or null
 */
SymbolDB.prototype.getParent = function(){
    if(this.parent&&this.parent.symbols){
        return this.parent.symbols;
    }
    return null;
}

/**
 * This method ckecks, wheather a name is in use or not.
 * @param {String} name - The name of the Variable to be checked
 * @return {Boolean} - If the name is already in use (true) or not (false)
 */
SymbolDB.prototype.checkUsed = function(name,name_old){
    for(var i = 0; i < this.getLength(); i++){
        if(this.symbols[i].name == name&&this.symbols[i].name != name_old){
            return true;
        }
    }
    return false;
}

/**
 * This method deletes an Element from the SymbolDB. (Unused)
 * @param {String} name - The name of the variable to be deleted
 * @return {Boolean} - If the delete was succesfull or not
 */
SymbolDB.prototype.delete = function(name){
    for(var i = 0; i < this.getLength(); i++){
        if(this.symbols[i].name == name){
            this.symbols = this.symbols.splice(i,1);
            return true;
        }
    }
    return false;
}

/**
 * This method sets a Symbol to a given value.
 * @param {String} name - the name of the symbol
 * @param {value} value - The new value of the symbol
 * @return {undefined} no return
 */
SymbolDB.prototype.setSymbol = function(name,value){
    var set = false;
    for(var i = 0; i < this.getLength();i++){
        if(this.symbols[i].name == name&&(this.symbols[i].kind==0||this.symbols[i].kind==1)){
            set = true;
            if(this.symbols[i].type == "number"){
                if(!isNaN(parseFloat(value))){
                    this.symbols[i].value= value;
                }
                else{
                    //Do nothing
                }
            }else
            if(this.symbols[i].type == typeof value){
                this.symbols[i].value = value;               
            }       
        }
    }
    
    if(!set){
        //If the symbol could not be set, try and look for it in this parents
        //SymbolDB
        if(this.parent){
            this.parent.symbols.setSymbol(name,value); 
        }
    }
}

/**
 * This method sets an array as value for a symbol.
 * @param {String} name - The name of the symbol
 * @param {number} pos - The position of the symbol
 * @param {value} value - The new value of the symbol
 * @return {undefined} no return
 */
SymbolDB.prototype.setArray = function(name,pos,value){
  
    var set = false;
    if(pos < 0){
        //Invalid position
        return null;
    }
    
    for(var i = 0; i < this.getLength(); i++){
        
        var symbol = this.symbols[i];
        if(symbol.name == name && symbol.type == "array"){
            //Searching the rigth symbol
            if(value.length && !pos){ //If the value is an array and no postion is
                // given, check if the length match. If yes, set the whole array at once.
                if(symbol.max_length == value.length){
                    symbol.value = value;
                }
            }            
            else if(symbol.stored_type == typeof value && !(pos >= symbol.max_length)){           
                this.symbols[i].value[pos] = value;   
                set = true;
            }        
        }
    }
    
    if(!set){
        //If the symbol could not be set, try and look for it in this parents
        //SymbolDB
        if(this.parent&&this.parent.symbols){
            this.parent.symbols.setArray(name,pos,value);
        }
    }
    console.log("finished setting");
}

/**
 * This function clears all values of this SymbolDB. Used at the beginning
 * of each new run of the programm to make sure, that old values will be dropped.
 * @return {undefined} no return
 */
SymbolDB.prototype.clearValues = function(){
    for(var i = 0; i < this.symbols.length; i++){
        if(this.symbols[i].type != "array"){
            this.symbols[i].value = null;
        } else{
            this.symbols[i].valule = new Array(parseInt(this.symbols[i].max_length));
        }  
        this.symbols[i].count = 0;
    }
}

/**
 * 
 * @param {String} name - The name of the symbol
 * @param {number} pos - The position
 * @return {Array.value|@this;.symbols@call;splice.value}
 */
SymbolDB.prototype.getValue = function(name,pos){
    for(var i = 0; i < this.symbols.length; i++){
        var symbol = this.symbols[i];
        if(symbol && symbol.name == name){
            //Search the symbol
            if(symbol.type == "array"){
                if(pos<0||pos>symbol.max_length||pos==null||pos==undefined){
                    //!pos is not working here, because 0 is a valiad argument
                    return symbol.value;
                    //if it is an array, and no position is given, return the 
                    //while thing
                }else{
                    //Otherwise look up the position
                    return symbol.value[pos];
                }
                 
            }else{
                //If the value is no array, just return it
                return symbol.value;
            }
        }
    }if(this.parent && this.parent.symbols){
        //If no symbol was found, check the parents DB
        return this.parent.symbols.getValue(name,pos);
    }
    return null;
}