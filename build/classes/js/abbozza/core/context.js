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

var Context = function() {
    this._view = null;
}


Context.prototype.initView = function(view) {
    console.log("da");
    this._view = view;
}

Context.prototype.refit = function() {}

Context.prototype.reset = function() {
    console.log("reset");
}

Context.prototype.getBlocks = function() {
    return null;
}

