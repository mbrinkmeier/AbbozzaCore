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

Abbozza.makeButtons = function() {

  this._stopButton = document.getElementById('button_stop');
  Abbozza.drawStop(this._stopButton,'white');
  this._stopButton.onmouseenter = function() { Abbozza.drawStop(Abbozza._stopButton,Abbozza._hoverColor) };
  this._stopButton.onmouseleave = function() { Abbozza.drawStop(Abbozza._stopButton,'white') };

  this._playButton = document.getElementById('button_play');
  Abbozza.drawPlay(this._playButton,'white');
  this._playButton.onmouseenter = function() { Abbozza.drawPlay(Abbozza._playButton,Abbozza._hoverColor) };
  this._playButton.onmouseleave = function() { Abbozza.drawPlay(Abbozza._playButton,'white') };
  
  this._stepButton = document.getElementById('button_step');
  Abbozza.drawStep(this._stepButton,'white');
  this._stepButton.onmouseenter = function() { Abbozza.drawStep(Abbozza._stepButton,Abbozza._hoverColor) };
  this._stepButton.onmouseleave = function() { Abbozza.drawStep(Abbozza._stepButton,'white') };

  this._loadButton = document.getElementById('button_load');
  Abbozza.drawLoad(this._loadButton,'white');
  this._loadButton.onmouseenter = function() { Abbozza.drawLoad(Abbozza._loadButton,Abbozza._hoverColor) };
  this._loadButton.onmouseleave = function() { Abbozza.drawLoad(Abbozza._loadButton,'white') };

  this._saveButton = document.getElementById('button_save');
  Abbozza.drawSave(this._saveButton,'white');
  this._saveButton.onmouseenter = function() { Abbozza.drawSave(Abbozza._saveButton,Abbozza._hoverColor) };
  this._saveButton.onmouseleave = function() { Abbozza.drawSave(Abbozza._saveButton,'white') };

  this._newButton = document.getElementById('button_new');
  Abbozza.drawNew(this._newButton,'white');
  this._newButton.onmouseenter = function() { Abbozza.drawNew(Abbozza._newButton,Abbozza._hoverColor) };
  this._newButton.onmouseleave = function() { Abbozza.drawNew(Abbozza._newButton,'white') };

  this._settingsButton = document.getElementById('button_settings');
  Abbozza.drawSettings(this._settingsButton,'white');
  this._settingsButton.onmouseenter = function() { Abbozza.drawSettings(Abbozza._settingsButton,Abbozza._hoverColor) };
  this._settingsButton.onmouseleave = function() { Abbozza.drawSettings(Abbozza._settingsButton,'white') };
  
  this._infoButton = document.getElementById('button_info');
  Abbozza.drawInfo(this._infoButton,'white');
  this._infoButton.onmouseenter = function() { Abbozza.drawInfo(Abbozza._infoButton,Abbozza._hoverColor) };
  this._infoButton.onmouseleave = function() { Abbozza.drawInfo(Abbozza._infoButton,'white') };

}

Abbozza.drawLoad = function(button,color) {
  var context = button.getContext("2d");
  context.clearRect(0,0,32,32);
  context.fillStyle = color;
  context.beginPath();
  context.arc(16,16,16,0,2*Math.PI);
  context.fill();
  context.fillStyle = Abbozza._darkColor;
  context.font='bold 30px Arial';
  context.textAlign='center';
  context.textBaseline='middle';
  context.fillText("",16,16);
  context.lineWidth=4;
  context.lineCap="round";
  context.strokeStyle = Abbozza._darkColor;
  context.beginPath();
  context.moveTo(16,6);
  context.lineTo(16,19);
  context.moveTo(12,10)
  context.lineTo(16,6)
  context.lineTo(20,10)
  context.moveTo(8,20);
  context.lineTo(8,24);
  context.lineTo(24,24);
  context.lineTo(24,20);
  context.stroke();
}

Abbozza.drawSave = function(button,color) {
  var context = button.getContext("2d");
  context.clearRect(0,0,32,32);
  context.fillStyle = color;
  context.beginPath();
  context.arc(16,16,16,0,2*Math.PI);
  context.fill();
  context.fillStyle = Abbozza._darkColor;
  context.lineWidth=4;
  context.lineCap="round";
  context.strokeStyle = Abbozza._darkColor;
  context.beginPath();
  context.moveTo(16,6);
  context.lineTo(16,19);
  context.moveTo(12,15)
  context.lineTo(16,19)
  context.lineTo(20,15)
  context.moveTo(8,20);
  context.lineTo(8,24);
  context.lineTo(24,24);
  context.lineTo(24,20);
  context.stroke();
}

Abbozza.drawNew = function(button,color) {
  var context = button.getContext("2d");
  context.clearRect(0,0,32,32);
  context.fillStyle = color;
  context.beginPath();
  context.arc(16,16,16,0,2*Math.PI);
  context.fill();
  context.lineWidth=4;
  context.lineCap="round";
  context.strokeStyle = Abbozza._darkColor;
  context.beginPath();
  context.moveTo(8,8);
  context.lineTo(24,24);
  context.moveTo(24,8)
  context.lineTo(8,24)
  context.stroke();
}

Abbozza.drawSettings = function(button,color) {
  var context = button.getContext("2d");
  context.clearRect(0,0,32,32);
  context.fillStyle = color;
  context.beginPath();
  context.arc(16,16,16,0,2*Math.PI);
  context.fill();
  context.lineWidth=2;
  context.strokeStyle = Abbozza._darkColor;
  context.beginPath();
  context.moveTo(16,6);
  context.lineTo(16,26);
  context.moveTo(8,6);
  context.lineTo(8,26);
  context.moveTo(24,6);
  context.lineTo(24,26);
  context.stroke();
  context.fillStyle = Abbozza._darkColor;
  context.fillRect(13,9,6,6);
  context.fillRect(5,17,6,6);
  context.fillRect(21,17,6,6);
}

Abbozza.drawInfo = function(button,color) {
  var context = button.getContext("2d");
  context.clearRect(0,0,32,32);
  context.fillStyle = color;
  context.beginPath();
  context.arc(16,16,16,0,2*Math.PI);
  context.fill();
  context.fillStyle = Abbozza._darkColor;
  context.font='bold 30px Arial';
  context.textAlign='center';
  context.textBaseline='middle';
  context.fillText('?',16,16);
}


Abbozza.drawStop = function(button,color) {
  var context = button.getContext("2d");
  context.clearRect(0,0,32,32);
  context.fillStyle = color;
  context.beginPath();
  context.arc(16,16,16,0,2*Math.PI);
  context.fill();
  context.fillStyle=Abbozza._darkColor;
  context.fillRect(8,8,16,16);        
}

Abbozza.drawStep = function(button,color) {
  var context = button.getContext("2d");
  context.clearRect(0,0,32,32);
  context.fillStyle = color;
  context.beginPath();
  context.arc(16,16,16,0,2*Math.PI);
  context.fill();
  
  context.fillStyle=Abbozza._darkColor;
  context.fillRect(20,9,4,14);
  context.beginPath();
  context.moveTo(8,8);
  context.lineTo(20,16);
  context.lineTo(8,24);
  context.closePath();
  context.fill();
}

Abbozza.drawPlay = function(button,color) {
  var context = button.getContext("2d");
  context.clearRect(0,0,32,32);
  context.fillStyle = color;
  context.beginPath();
  context.arc(16,16,16,0,2*Math.PI);
  context.fill();
  
  context.fillStyle=Abbozza._darkColor;
  context.beginPath();
  context.moveTo(10,6);
  context.lineTo(26,16);
  context.lineTo(10,26);
  context.closePath();
  context.fill();
}
