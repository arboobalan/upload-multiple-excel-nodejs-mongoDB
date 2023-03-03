const mongoose = require("mongoose");

const excelSchema = new mongoose.Schema({
  
    path1: {
        type: Object,
        required: true
    },
    path2: {
        type: Object,
        required: true
    },
    path3: {
        type: Object,
        required: true
    }
});

const excelModel = mongoose.model('fileUpload', excelSchema, 'fileUpload');
module.exports = excelModel;