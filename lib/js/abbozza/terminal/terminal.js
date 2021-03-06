/* 
 * Copyright 2015 michael.
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

Terminal = function() {
}

Terminal.prototype = Context;

Terminal.prototype.initView = function (view) {
    this._terminal = $('#context_panel').terminal(
       function(command,term) {},
       {
           prompt: "",
           name: ""
       }
    );
    $('#context_panel').css("overflow","scroll");
    // this._terminal.pause(); test
    this.refit();
}

Terminal.prototype.refit = function() {
    this._terminal.resize($('#context_panel').width(),$('#context_panel').height());    
}

Terminal.prototype.reset = function() {
     this._terminal.clear();
}

Terminal.prototype.getBlocks = function() {
    return null;
}

Terminal.prototype.getToolbox = function() {
    console.log("Terminal.getToolbox()");
}