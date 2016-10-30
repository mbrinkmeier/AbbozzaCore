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

HeapEntry = function(block, callingHeapEntry, symbols, interpreter) {
    // The block executed by this heap entry
    this.block_ = block;
    
    // The interpreter executing this heap entry
    this.interpreter_ = interpreter;
    
    // The symbols for the execution
    this.symbols_ = symbols;
    
    // The heapEntry causing this heap entry to added to the stack
    this.callingHeapEntry_ = callingHeapEntry;
    
    // The last result by a called heapEntry
    this.result_ = null;
    
    // A step counter for multi-step blocks
    this.step_ = 0;
    
    // A flag to stall the execution
    this.stalled_ = false;
}

/**
 * This function constructs an Interpreter-Object used for the excution of 
 * the blocks on the workspace.
 * 
 * @returns {undefined}
 */
Interpreter = function() {
    
    // The blockHeapEntry Stack used to control the execution.
    // It is initialized as an epty array.
    this.heap_ = []; 
    this.eventQueue_ = [];
    
    this.context_ = null;
    this.workspace_ = null;
    this.element_ = null;
    this.finished_ = false;
    this.paused_ = false;
    this.stepwise_ = false;
    this.handler_ = null;
    this.lastBlock_ = null;
}

/**
 * This peration starts the execution of the given workspace, starting with
 * the first block. The issued events are dispatched by the element.
 * 
 * @param {type} context The context manipulated by the execution.
 * @param {type} workspace The workspace to be executed.
 * @param {type} firstBlock The block to start with.
 * @param {type} element The element which issues the events.
 * @returns {undefined}
 */
Interpreter.prototype.start = function( context, workspace, firstBlock, element ) {
    // context.read("test", function(str) {} );
    this.context_ = context;
    this.element_ = element;
    this.workspace_ = workspace;
    this.eventQueue_ = [];
    this.paused_ = false;
    
    // Register the event handler
    this.handler_ = function(event) {
        event.detail.interpreter.nextBlockHandler(event);
    };
    
    this.element_.addEventListener("nextBlock", this.handler_);
        
    
    // Empty the blockStack
    this.heap_ = [];
    var symbols = new SymbolDB(null);
    // Put the firstBlock onto the blockStack
    // @TODO The symbols have to be added
    this.enqueueBlock(firstBlock,null,symbols);
}

Interpreter.prototype.pause = function() {
    this.paused_ = true;
}

Interpreter.prototype.resume = function() {
    this.paused_ = false;
    this.continue();
}

Interpreter.prototype.stop = function() {
    this.finished_ = true;
    this.element_.removeEventListener("nextBlock", this.handler_);    
        this.lastBlock_.unselect();
    this.handler_ = null;
}

/**
 * Handle nextBlock CustomEvents
 * 
 * @param {type} event
 * @returns {undefined}
 */
Interpreter.prototype.nextBlockHandler = function(event) {
    event.stopPropagation();
    
    // If not the correct interpreter
    if (event.detail.interpreter != this) return;
    
    // Ignore event if paused.
    if (this.paused_) return;
    
    // If the execution is finished
    if (this.heap_.length == 0) {
        this.stop();
        return;
    }
    
    // Get top heapEntry from stack
    var heapEntry = this.heap_[this.heap_.length -1];
    
    // Execute the block
    if (heapEntry.block_ && !heapEntry.stalled_) {
        // The execution returns the result of the blocks evaluation.
        // It is stored in the calling heapEntry.
        
        // Store the block, so that i can be unselected if the execution ends.
        this.lastBlock_ = heapEntry.block_;
        
        // select the running block
        heapEntry.block_.select();
        
        // Execute the block
        var result = heapEntry.block_.execute(this,heapEntry);
        // Retrieve result
        if ( heapEntry.callingHeapEntry_) heapEntry.callingHeapEntry_.result_ = result;
        
        // Check if the current block finished
        if ( heapEntry.finished_) {
            // Remove finished heapEntry
            this.heap_.pop();
            
            var nextBlock = heapEntry.block_.getNextBlock();
            if ( nextBlock ) {
                // enque and execute the next block with the same calling heapEntry.
                this.enqueueBlock(nextBlock,heapEntry.callingHeapEntry_,heapEntry.symbols_);
            } else {
                // next step in calling HeapEntry
                this.continue();
            }
        } else {
            // If heapEntry isn't finished continue
            this.continue();
        }
    } else if ( !heapEntry.block_ ) {
        this.heap_.pop();
    }
    
    // Check if block stack is empty
    if ( this.heap_.length == 0) {
        // Stop the execution
        this.stop();
    }
    
}

/**
 * Put a block on the execution stack.
 * 
 * @param {type} block The block
 * @param {type} symbols The symbols
 * @returns {undefined}
 */
Interpreter.prototype.enqueueBlock = function(block, callingHeapEntry, symbols) {
    // Generate a heapEntry
    var heapEntry = new HeapEntry(block, callingHeapEntry, symbols, this);
    this.heap_.push(heapEntry);

    this.continue();    
}

Interpreter.prototype.continue = function() {
    if (!this.stepwise_) this.step();
}

Interpreter.prototype.step = function() {
    // Dispatch event
    var event = new CustomEvent("nextBlock", {
        detail : {
            interpreter: this
        }
    });
    // this.eventQueue_.push(event);
    // console.log(this.eventQueue_.length);
    var interpreter = this;
    setTimeout( function() {
        // var event = interpreter.eventQueue_[interpreter.eventQueue_.length-1];
        // interpreter.eventQueue_.pop();
        interpreter.element_.dispatchEvent(event);
    },0);
}
