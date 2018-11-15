// Range filter, starts from 0
app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
// get nickname of a user, lets say username is Simerjit Kaur, then it will return SK
app.filter('nickname', function() {
    return function(input, splitChar) {
        var nick='';
        if(typeof(input) !='undefined'){
            for(var i=0;i<input.split(splitChar).length;i++){
                var a=input.split(splitChar)[i];
                if(typeof(a)  !='undefined'){
                    if(input.split(splitChar).length==1){
                        var b=a.substr(0,2);
                        nick=nick+b
                    }else{
                        var b=a.substr(0,1);
                        nick=nick+b
                    }    
                }
            }
            // do some bounds checking here to ensure it has that index
            return nick;
        }
        return false;
    }
});
// Get days difference
app.filter('datediff', function() {
    return function(input) {
        var days_format='';
        var today =new Date();
        var second_date =new Date(input);
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
        
        var diffDays = Math.round(Math.abs((second_date.getTime() - today.getTime())/(oneDay)));
        if(diffDays==0){
            return 'Today';
        }else{
            if(diffDays>7){
                var month = new Array();
                month[0] = "January";
                month[1] = "February";
                month[2] = "March";
                month[3] = "April";
                month[4] = "May";
                month[5] = "June";
                month[6] = "July";
                month[7] = "August";
                month[8] = "September";
                month[9] = "October";
                month[10] = "November";
                month[11] = "December";
                var todayTime = new Date(input);
                days_format = month[todayTime .getMonth()]+" "+todayTime.getDate();
                //days_format =new Date(input);
            }else{
                if(today.getTime()>second_date.getTime()){
                    days_format = diffDays+" Day(s) ago"
                }else{
                    days_format = "In "+diffDays+" days"
                }
            }
            
            return days_format;
        }
    }
});

app.filter('typeOf',function(){
    return function(input) {
        return typeof input;
    }
})
//
app.filter('changeToDate',function(){
    return function(input){
        if(typeof input!='undefined'){
            console.log(new Date(input))
            return new Date(input);
        }
    }
})
// get object length
app.filter('length',function(){
    return function(input) {
        if(typeof input !='undefined'){
            return false;
        }else{
            return Object.keys(input).length;
        }
    }
})
// Split a string by comma and return as array
app.filter('splitByComma', function() {
        return function(input) {
            if(typeof(input) != "undefined" ){
                if(input.indexOf(', ') > -1){
                    var arr = input.split(', ');
                    return arr;
                }
            }
    }
})
//Obj each and catcat by comma
app.filter('concatByComma', function() {
        return function(input) {
            if(typeof(input) != "undefined" &&  typeof(input) == "object"){
                var size = Object.keys(input).length;
                var str='';
                Object.keys(input).map(function(objectKey, index) {
                    if(size==index+1){
                        str =str+objectKey
                    }else{
                        str =str+objectKey+","
                    }
                });
                return str;
            }
    }
})
// Check value exists in an array of objects
app.filter('valueExists', function() {
        return function(input,key_to_test) {
            if(typeof(input) != "undefined" ){
                var found = input.some(function (el) {
                    return el.event_id === key_to_test;
                  });
                return found;
            }
    }
})

//Check Accepted and read invitations
app.filter('unreadInvitations',function(){
        return function(input,response_bit) {
            if(typeof(input) != "undefined" ){
                var found = input.some(function (el) {
                    return el.event_data.guest_response === response_bit;
                  });
                return found;
            }
    }
})
// Invitation Status
app.filter('inv_status',function(){
    return function(guest_events , event_id, type){
        if(typeof(guest_events) != "undefined" ){
            var response = ''
            guest_events.forEach(function(element) {
                if(element.event_id == event_id){
                    if(type=='status_label'){
                        if(element.guest_response==1){
                            response =  'Awaiting guest response'
                        }else if(element.guest_response==2){
                            response= 'Guest declined invite'
                        }else if(element.guest_response==3){
                            response= 'Guest accepted invite'
                        }
                    }else if(type =='req_status'){
                        if(element.guest_response==1){
                            response =  1
                        }else if(element.guest_response==2){
                            response= 2
                        }else if(element.guest_response==3){
                            response= 3
                        }
                    }else if(type == 'guest_food_popup'){
                        response = element.food_restrictions
                    }
                } 
            });
            return response
        }
    }
})
// Get ACcomodation Status 
app.filter('accomodation_status',function(){
    return function(guest_events , event_id, type){
        if(typeof(guest_events) != "undefined" ){
            var response = ''
            guest_events.forEach(function(element) {
                if(element.event_id == event_id){
                    if(type=='acc_status'){
                        if(element.accomodation_request==true){
                            if(element.accomodation.length==0){
                                response =  'No Response'
                            }else{
                                response= 'Required'
                            }
                        }else{
                            response= 'Not Sent'
                        }
                    }else if(type =='req_status'){
                        if(element.accomodation_request==true){
                            if(element.accomodation.length==0){
                                response =  2
                            }else{
                                if(typeof element.accomodation[0].locked_details == 'undefined'){
                                    response= 3
                                }else{
                                    if(element.accomodation[0].locked_details==false){
                                        response =4
                                    }else{
                                        response =5
                                    }
                                }
                            }
                        }else{
                            response= 1
                        }
                    }else if(type == 'guest_acc_popup'){
                        response = element.accomodation[0]
                    }
                } 
            });
            return response
        }
    }
})
// Get Food Restrictions
app.filter('food_status',function(){
    return function(guest_events , event_id, type){
        if(typeof(guest_events) != "undefined" ){
            var response = ''
            guest_events.forEach(function(element) {
                if(element.event_id == event_id){
                    if(type=='status'){
                        if(element.food_restrictions_request==true){
                            if(element.food_restrictions.length==0){
                                response =  'No Response'
                            }else{
                                response= 'Present'
                            }
                        }else{
                            response= 'Not Sent'
                        }
                    }else if(type =='req_status'){
                        if(element.food_restrictions_request==true){
                            if(element.food_restrictions.length==0){
                                response =  2
                            }else{
                                response=3
                            }
                        }else{
                            response= 1
                        }
                    }else if(type == 'guest_food_popup'){
                        response = element.food_restrictions
                    }
                } 
            });
            return response
        }
    }
})
// Fetch vendor from selected event id
app.filter('fetchVendor',function(){
    return function(project_events , event_id){
        var keepGoing = true;
        if(typeof(project_events) != "undefined" ){
            if(typeof(event_id)!="undefined"){
                var response = ''
                
                project_events.forEach(function(element) {
                    if(keepGoing){
                        console.log(element._id+" "+event_id)
                        if(element._id == event_id){
                            console.log(event_id)
                            response = element.vendors;
                            console.log(response)
                            keepGoing = false;
                            return response;
                        } 
                    }
                });
            }
        }
    }
})
app.filter('past_dates',function(){
    return function(records){ 
    var output = [];
        if (records) { 
            records.forEach(function (item) { 
                if (new Date(item.due_date) < new Date()) { 
                    output.push(item)
                }
            });
        }
        return output;
    }
})
app.filter('upcoming_dates',function(){
    return function(records){ 
        var output = [];
            if (records) { 
                records.forEach(function (item) { 
                    if (new Date(item.due_date) > new Date()) { 
                        output.push(item)
                    }
                });
            }
            return output;
        }
})