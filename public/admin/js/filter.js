// Range filter, starts from 0
adminApp.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
// get object length
adminApp.filter('ObjectLength',function(){
    return function(input) {
        if(typeof input !='undefined'){
            return false;
        }else{
            return Object.keys(input).length;
        }
    }
})