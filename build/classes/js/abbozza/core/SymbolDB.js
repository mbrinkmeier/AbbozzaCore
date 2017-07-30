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


function Symbol(_name,_type,_kind,_global) {
    this.name = _name;
    this.type = _type;
    this.kind = _kind;
    this.value = null;
    this.global = _global;
    this.count = null;
}
Symbol.prototype.getType = function(){
    return this.type;
}
Symbol.prototype.toString = function(){
    return "Name: "+this.name+"\n Typ: "+this.type+"\n Art: "+this.kind;
}
Symbol.prototype.VARIABLE = 0;
Symbol.prototype.PARAMETER = 1;
Symbol.prototype.OPERATION = 2;



function SymbolDB(_parent) {
    this.parent = _parent;
    this.symbols = new Array();
    this.count = 0;
}


SymbolDB.prototype.checkName = function(name) {
    return name.match(/.[_a-zA-Z]*[^\s]/);
}


SymbolDB.prototype.getSymbol2 = function(pos){
    if(this.symbols.length-1 < pos|| pos < 0){return null;}
    return this.symbols[pos];
}


SymbolDB.prototype.getLength = function(){
    return this.symbols.length;
}


SymbolDB.prototype.getSymbol = function(name) {
    var i = 0;
    while ( i < this.symbols.length ) {
           if ( this.symbols[i].name == name ) {
              return  this.symbols[i];
           }
        i = i+1;
    }
    
    if ( this.parent ) {
        return this.parent.getSymbol(name);
    }
    
    return null;
}



SymbolDB.prototype.addSymbol = function(name,type,kind) {
    if (!this.checkName(name)) return null;
    
    var i = 0;
    while ( i < this.symbols.length ) {
           if ( this.symbols[i].name == name ) {
              return  this.symbols[i];
           }
        i = i+1;
    }
    
    var sym = new Symbol(name,type,kind);
    this.symbols.push(sym);
    console.log(sym);
    return null;
}

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

SymbolDB.prototype.reset = function(){
    this.symbols = new Array();
    this.count = 0;
}

SymbolDB.prototype.toString = function(){
    var result = "\n";
    if(this.getLength()==0){return "Empty";}
    for(var i = 0; i < this.getLength() ; i++){
        result = result + "Name: "+this.getSymbol2(i).name + " Typ: "+ this.getSymbol2(i).type+"\n";
    }
    return result
}

SymbolDB.prototype.getParent = function(){
    return this.parent;
}
/**
 * This method ckecks, wheather a name is in use or not.
 * @param {String} name - The name of the Variable to be checked
 * @return {Boolean} - If the name is already in use or not
 */
SymbolDB.prototype.checkUsed = function(name){
    for(var i = 0; i < this.getLength(); i++){
        if(this.symbols[i].name == name){
            return true;
        }
    }
    return false;
}

/**
 * This method deletes an Element from the SymbolDB.
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
 * Thsi methods sets a Symbol to a given value.
 * @param {String} name - the name of the symbol
 * @return {undefined}
 */
SymbolDB.prototype.setSymbol = function(name,value){
    console.log("Suche: "+name);
    var set = false;
    for(var i = 0; i < this.getLength();i++){
        console.log("Gefunden: "+this.symbols[i].name);
        if(this.symbols[i].name == name){
            set = true;
            console.log("Type: "+this.symbols[i].type);           
            console.log("Type of variable: "+this.symbols[i].type+"\n Typeof value: "+ typeof value); //Entscheidung
            if(this.symbols[i].type == "number"){
                if(!isNaN(parseInt(value))){
                    this.symbols[i].value= value;
                }
                else{
                    this.symbols[i].value = 0;
                    console.log("Konnte übergebenen String nicht parsen");
                }
            }else
            if(this.symbols[i].type == typeof value){
                this.symbols[i].value = value;
                
            }
            else{
                console.log("Typen stimmen nicht überein! Defaults werden gesetzt!"); //Entscheidung
                
                switch (this.symbols[i].type){
                    case "string":
                        this.symbols[i].value = '';
                        break;
                    case "int":
                        this.symbols[i].value = 0;
                        break;
                    case "boolean":
                        this.symbols[i].value = false;
                        break;
                    case "function":
                        this.symbols[i].value = function(){};
                        break;
                    default:
                        this.symbols[i].value = null;
                }
         
            }
            
            
        }
    }
    if(!set){
        console.log("Keine übereinstimmende Variable gefunden"); //Entscheidung
    }
}