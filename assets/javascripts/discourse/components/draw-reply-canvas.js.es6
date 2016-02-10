export default Ember.View.extend({
    tagName: 'canvas',
    mouseUp: function(event) {
        var canvas = this.get('element'), self = this;
        canvas.toBlob(blob => this.get('controller').send('draw',blob));
    },
    mouseLeave: function(event) {
        var canvas = this.get('element');
        canvas.toBlob(blob => this.get('controller').send('draw',blob));
    },
    touchEnd: function(event) {
        var canvas = this.get('element');
        canvas.toBlob(blob => this.get('controller').send('draw',blob));
    },
    didInsertElement: function(){

        // works out the X, Y position of the click inside the canvas from the X, Y position on the page
        function getPosition(mouseEvent, sigCanvas) {
            var x, y;
            if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
                x = mouseEvent.pageX;
                y = mouseEvent.pageY;
            } else {
                x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            
            return { X: x - sigCanvas.offsetLeft, Y: y - sigCanvas.offsetTop };
        }

        function initialize(sigCanvas) {

            // create a function to pass touch events and coordinates to drawer
            function draw(event) {
                
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
            }
            
            var context = sigCanvas.getContext("2d");
            context.strokeStyle = 'Black';
            
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
                sigCanvas.addEventListener('touchstart', draw, false);
                sigCanvas.addEventListener('touchmove', draw, false);
                sigCanvas.addEventListener('touchend', draw, false);
                
                // prevent elastic scrolling
                sigCanvas.addEventListener('touchmove', function (event) {
                    event.preventDefault();
                }, false); 
            }
            else {
                
                // start drawing when the mousedown event fires, and attach handlers to
                // draw a line to wherever the mouse moves to
                sigCanvas.addEventListener('mousedown', function(mouseEvent) {
                    var position = getPosition(mouseEvent, sigCanvas);
                    
                    context.moveTo(position.X, position.Y);
                    context.beginPath();
                    
                    // attach event handlers
                    $(this).mousemove(function (mouseEvent) {
                        drawLine(mouseEvent, sigCanvas, context);
                    }).mouseup(function (mouseEvent) {
                        finishDrawing(mouseEvent, sigCanvas, context);
                    }).mouseout(function (mouseEvent) {
                        finishDrawing(mouseEvent, sigCanvas, context);
                    });
                }, false);
            }
        }
        
        // draws a line to the x and y coordinates of the mouse event inside
        // the specified element using the specified context
        function drawLine(mouseEvent, sigCanvas, context) {
            
            var position = getPosition(mouseEvent, sigCanvas);
            
            context.lineTo(position.X, position.Y);
            context.stroke();
        }
        
        // draws a line from the last coordiantes in the path to the finishing
        // coordinates and unbind any event handlers which need to be preceded
        // by the mouse down event
        function finishDrawing(mouseEvent, sigCanvas, context) {
            // draw the line to the finishing coordinates
            drawLine(mouseEvent, sigCanvas, context);
            
            context.closePath();
            
            // unbind any events which could draw
            $(sigCanvas).unbind("mousemove")
                .unbind("mouseup")
                .unbind("mouseout");

        }

        var canvas = this.get('element');
        initialize(canvas);
    }
});
