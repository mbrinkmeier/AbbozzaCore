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

var Sliders = {
    _hslider : null,
    _vslider : null,
    _dragStartX : 0,
    _dragStartY : 0,
    _dragOriginX : 0,
    _dragOriginY : 0    
}


Sliders.init = function() {
    this._hslider = $('#hslider_panel');
    this._vslider = $('#vslider_panel');
    
    this._hslider.attr("draggable","true");
    this._hslider.on("mouseenter",Sliders.onMouseEnter);
    this._hslider.on("mouseleave",Sliders.onMouseLeave);
    this._hslider.on("dragstart",Sliders.hDragStart);
    this._hslider.on("drag",Sliders.hDrag);
    this._hslider.on("dragend",Sliders.hDrag);

    this._vslider.attr("draggable","true");
    this._vslider.on("mouseenter",Sliders.onMouseEnter);
    this._vslider.on("mouseleave",Sliders.onMouseLeave);
    this._vslider.on("dragstart",Sliders.vDragStart);
    this._vslider.on("drag",Sliders.vDrag);
    this._vslider.on("dragend",Sliders.vDrag);
    
    Abbozza.refit();   
}


Sliders.onMouseEnter = function(event) {
    var slider = event.delegateTarget;
    slider.style.backgroundColor = Abbozza._darkColor;
    slider.style.cursor = "pointer";
}

Sliders.onMouseLeave = function(event) {
    var slider = event.delegateTarget;
    slider.style.backgroundColor = Abbozza._mainColor;
    slider.style.cursor = "default";
}

Sliders.hDragStart = function(event) {
    Sliders._dragStartX = event.originalEvent.screenX;
    Sliders._dragStartY = event.originalEvent.screenY;
    Sliders._vOriginX = Sliders._hslider.position().left;
    Sliders._vOriginY = Sliders._hslider.position().top;
}
    
Sliders.hDrag = function(event) {
    if (event.originalEvent.x == 0) return;

    var relX = event.originalEvent.screenX - Sliders._dragStartX; 
    var relY = event.originalEvent.screenY - Sliders._dragStartY;

    var pos = Sliders._vOriginX + relX;
    var width = screen.width;
            
    if ( pos < Abbozza._minContextWidth ) pos = Abbozza._minContextWidth;
    if ( pos > screen.width - Abbozza._minWorkspaceWidth ) pos = screen.width - Abbozza._minWorkspaceWidth;
    
    $('#hslider_panel').css("left",pos);
    $('#left_panel').css('width',pos)
    $('#context_panel').css('width',pos);
    $('#workspace_panel').css('left',pos+10);    
    $('#workspace_panel').css('right',0);
    
    Abbozza.refit();
}

Sliders.vDragStart = function(event) {
    Sliders._dragStartX = event.originalEvent.screenX;
    Sliders._dragStartY = event.originalEvent.screenY;
    Sliders._vOriginX = Sliders._vslider.position().left;
    Sliders._vOriginY = Sliders._vslider.position().top;
}
    
Sliders.vDrag = function(event) {
    if (event.originalEvent.x == 0) return;

    var relX = event.originalEvent.screenX - Sliders._dragStartX; 
    var relY = event.originalEvent.screenY - Sliders._dragStartY;

    var pos = Sliders._vOriginY + relY;
    var height = $('#main_panel').height();
    
    if ( pos < Abbozza._minContextHeight+50 ) pos = Abbozza._minContextHeight+50;
    if ( pos > height - Abbozza._minMiscHeight -20 ) pos = height - Abbozza._minMiscHeight - 20;
    
    $('#context_panel').css('height',pos-50);

    $('#control_panel').css('height', 50);
    $('#control_panel').css('top', pos-50);
    
    $('#vslider_panel').css("top",pos);
    $('#misc_panel').css('top',pos+10);    
    
    Abbozza.refit();
}