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


function Symbol(_name,_type,_kind) {
    this.name = _name;
    this.type = _type;
    this.kind = _kind;
    this.value = null;
    this.global = true;
}

Symbol.prototype.VARIABLE = 0;
Symbol.prototype.PARAMETER = 1;
Symbol.prototype.OPERATION = 2;



function SymbolDB(_parent) {
    this.parent = _parent;
    this.symbols = new Array();
}



SymbolDB.prototype.checkName = function(name) {
    return name.match(/.[_a-zA-Z]*[^\s]/);
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
    return sym;
}

SymbolDB.prototype.addSymbol2 = function(name,type,kind,value,global) {
    if (!this.checkName(name)) return null;
    
    var i = 0;
    while ( i < this.symbols.length ) {
           if ( this.symbols[i].name == name ) {
              console.log("Bereits vorhanden");
              return  this.symbols[i];
           }
        i = i+1;
    }
    
    var sym = new Symbol(name,type,kind);
    sym.value = value;
    sym.global = global;
    this.symbols.push(sym);
    console.log(sym);
    return sym;
}

