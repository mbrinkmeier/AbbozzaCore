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

ToolboxMgr = {
    
    rebuild: function(init) {
        var xml = this.getXML("js/abbozza/core/toolbox.xml");
        toolbox = xml.getElementsByTagName("toolbox")[0];
        
        // var toolbox = Abbozza._context.getToolbox();
        if (init) {
            Blockly.inject(document.getElementById('blocklyDiv'), {
                toolbox: toolbox,
                trashcan: true,
                scrollbars: true
            });
        } else {
            Blockly.mainWorkspace.updateToolbox(toolbox);
        }
    },
    
    getXML: function(file) {
        var xml = Connection.getXMLSynced(file);
        return xml;
    }
}
