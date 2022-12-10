// Helper functions

const {ObjectId} = require('mongodb');

function checkIsProperString(string,variableName){
    if(typeof string=== "undefined"){
        throw `${variableName} is undefined`
    }
    if(typeof string!== "string"){
        throw `${variableName} is not a string, it must be a string`
    }
    if(string.length=== 0){
        throw `${variableName} is an empty string`
    }
    if(string.trim().length=== 0){
        throw `${variableName} is a string with only empty spaces`
    }
    string = string.trim();
    return string;
}

function checkIsProperArray(array,variableName){
    if(typeof array=== "undefined"){
        throw `${variableName} is undefined`
    }
    if(typeof array!== 'object'){
        throw `${variableName} is not an array, it must be an array`
    }
    if(!Array.isArray(array)){
        throw `${variableName} is not an array, it must be an array`
    }
    if(array.length=== 0){
        throw `${variableName} is an empty array`
    }

}

function validateEmail(string,variableName){
    string = string.trim();
    string = string.toLowerCase();
    let re = /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
    result = re.test(string);
    if(!result){
        throw [400,`${variableName} is not valid`]
    }
    return string;
}

function validatePhoneNumber(string,variableName){
    string = string.trim();
    let re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    result = re.test(string);
    if(!result){
        throw [400,`${variableName} is not valid`]
    }
    return string;
}

function validateNumber(string,variableName){
    let result = Number(string);
    if(isNaN(result)){
        throw [400,`${variableName} is not a valid number`]
    }
    return string;
}

function checkPassword(string,variableName){
    let scFlag = 0
    let capsFlag = 0
    let numsFlag = 0
    const specialCharacters = `\`!@#$%^&*()_+={};':"\\|<>\/?~`
    const r1 = specialCharacters.split('').some(sCh => {
        if (string.includes(sCh)) {
          scFlag = 1;
          return true;
        }
        else{
          return false
        }
    });
    const alphabets = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
    const r2 = alphabets.split('').some(sCh => {
        if (string.includes(sCh)) {
          capsFlag = 1
          return true;
        }
        else{
          return false
        }
    });
    const numbers = `0123456789`
    const r3 = numbers.split('').some(sCh => {
        if (string.includes(sCh)) {
          numsFlag = 1
          return true;
        }
        else{
          return false
        }
    });
    if(!((r1&&r2&&r3)||(scFlag===1 && capsFlag===1 &&numsFlag===1))){
        throw [400, `Error: Password should have atleast one special charcter, one capital letter, one number`]
    }
    else{
        return string;
    }
}

function checkIsProperId(id){
    if(!ObjectId.isValid(id)){
        throw [400,`Invalid Object ID`]
    }
    return id;
}

function validateLatitudeLongitude(string,variableName){
    string = string.trim();
    let re = /^((\-?|\+?)?\d+(\.\d+)?)$/gi;
    result = re.test(string);
    if(!result){
        throw [400,`${variableName} is not valid`]
    }
    return string;
}
function timeLogic(openingTime,closingTime){
    // UNFINISHED
    let openingTime2 = "0800"
    let closingTime2 = "0200"

    if(Number(openingTime2)>Number(closingTime2)){
        closingTime2 = Number(closingTime2) +2400;
    }
    else{
        closingTime2 = Number(closingTime2)
    }

    let timeDiff = closingTime2-openingTime2;
    console.log(timeDiff)
}
module.exports = {
    checkIsProperString,
    checkIsProperArray,
    validateEmail,
    validatePhoneNumber,
    validateNumber,
    checkPassword,
    checkIsProperId,
    validateLatitudeLongitude
}
