import ModalFunctionality from 'discourse/mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
    pictureData: "test",

    actions: {
        apply: function() {
            var output = this.get("pictureData"), self = this;

            //TODO: do something here to send canvas data
            if (self.composerViewOld)
                self.composerViewOld.addMarkdown(output);
            else if (self.composerView)
                self.composerView._addText(self.composerView._getSelected(), output);

            this.send('closeModal');
        }
    },

    onShow: function() {
        
        // get references to the canvas element as well as the 2D drawing context
        var sigCanvas = document.getElementById("reply-draw-canvas");
        var context = sigCanvas.getContext("2d");
        context.strokeStyle = 'Black';
        return;
 
         // This will be defined on a TOUCH device such as iPad or Android, etc.
         var is_touch_device = 'ontouchstart' in document.documentElement;
 
         if (is_touch_device) {
            // create a drawer which tracks touch movements
            var drawer = {
               isDrawing: false,
               touchstart: function (coors) {
                  context.beginPath();
                  context.moveTo(coors.x, coors.y);
                  this.isDrawing = true;
               },
               touchmove: function (coors) {
                  if (this.isDrawing) {
                     context.lineTo(coors.x, coors.y);
                     context.stroke();
                  }
               },
               touchend: function (coors) {
                  if (this.isDrawing) {
                     this.touchmove(coors);
                     this.isDrawing = false;
                  }
               }
            };
 
            // attach the touchstart, touchmove, touchend event listeners.
            sigCanvas.addEventListener('touchstart', this.draw, false);
            sigCanvas.addEventListener('touchmove', this.draw, false);
            sigCanvas.addEventListener('touchend', this.draw, false);
 
            // prevent elastic scrolling
            sigCanvas.addEventListener('touchmove', function (event) {
               event.preventDefault();
            }, false); 
         }
         else {
 
            // start drawing when the mousedown event fires, and attach handlers to
            // draw a line to wherever the mouse moves to
            $("#reply-draw-canvas").mousedown(function (mouseEvent) {
               var position = this.getPosition(mouseEvent, sigCanvas);
 
               context.moveTo(position.X, position.Y);
               context.beginPath();
 
               // attach event handlers
               $(this).mousemove(function (mouseEvent) {
                  this.drawLine(mouseEvent, sigCanvas, context);
               }).mouseup(function (mouseEvent) {
                  this.finishDrawing(mouseEvent, sigCanvas, context);
               }).mouseout(function (mouseEvent) {
                   this.finishDrawing(mouseEvent, sigCanvas, context);
               });
            });
 
         }
    },

    draw: function(event) {
          var sigCanvas = document.getElementById("reply-draw-canvas");
               // get the touch coordinates.  Using the first touch in case of multi-touch
               var coors = {
                  x: event.targetTouches[0].pageX,
                  y: event.targetTouches[0].pageY
               };
 
               // Now we need to get the offset of the canvas location
               var obj = sigCanvas;
 
               if (obj.offsetParent) {
                  // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
                  do {
                     coors.x -= obj.offsetLeft;
                     coors.y -= obj.offsetTop;
                  }
				  // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
				  // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
                  while ((obj = obj.offsetParent) != null);
               }
 
               // pass the coordinates to the appropriate handler
               drawer[event.type](coors);
    },

    getPosition: function(mouseEvent, sigCanvas) {
        var x, y;
         if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
            x = mouseEvent.pageX;
            y = mouseEvent.pageY;
         } else {
            x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
         }
 
         return { X: x - sigCanvas.offsetLeft, Y: y - sigCanvas.offsetTop };
    },

    drawLine: function(mouseEvent, sigCanvas, context) {
 
         var position = getPosition(mouseEvent, sigCanvas);
 
         context.lineTo(position.X, position.Y);
         context.stroke();
    },

    finishDrawing: function(mouseEvent, sigCanvas, context) {
         // draw the line to the finishing coordinates
         drawLine(mouseEvent, sigCanvas, context);
 
         context.closePath();
 
         // unbind any events which could draw
         $(sigCanvas).unbind("mousemove")
                     .unbind("mouseup")
                     .unbind("mouseout");
    },

    init: function () {
        this._super();

    }
});
