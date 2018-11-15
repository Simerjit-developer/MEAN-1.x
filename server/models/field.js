var mongoose = require('mongoose');

var childSchema = new mongoose.Schema({
   title:{type:String},
   type:{type:String},
   value:{type:String},
   required:{type:Boolean}
});

var FieldType = new mongoose.Schema({
   title:{type:String},
   type:{type:String},
   value:{type:String},
   required:{type:Boolean},
   child:[childSchema]
});

var Field = new mongoose.Schema({
    vendortype_id:{
        type: mongoose.Schema.Types.ObjectId
    },
    service_id:{
        type: mongoose.Schema.Types.ObjectId
    },
    fields: [FieldType],
    status:{type:Boolean,default:true},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Field', Field);