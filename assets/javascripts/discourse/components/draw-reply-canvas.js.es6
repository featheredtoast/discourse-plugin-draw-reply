

export default Ember.View.extend({
tagName: 'canvas',
quader: function () {
    return this.get('controller.model');
}.property('controller.model'),
didInsertElement: function(){


  var canvas = this.get('element');
  var ctx = canvas.getContext('2d');


  // Filled triangle
  ctx.beginPath();
  ctx.moveTo(25,25);
  ctx.lineTo(105,25);
  ctx.lineTo(25,105);
  ctx.fill();




  // Stroked triangle
  ctx.beginPath();
  ctx.moveTo(125,125);
  ctx.lineTo(125,45);
  ctx.lineTo(45,125);
  ctx.closePath();
  ctx.stroke();
}
});
