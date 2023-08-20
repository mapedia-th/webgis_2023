var x = "sakda";
var lat = 18.123456;
var lng = 100.23456;
// array
var arr = [18.123456, 100.23456, "พิษณุโลก"];

// object
var obj = {
    fname: "sakda",
    lname: "homhuan",
    lat: 18.123456,
    lng: 100.23456
}

// console.log(obj["fname"]);
/* console.log(obj.fname);
console.log(obj.lat); */


// function
function plusOne(a) {
    let x = a + 1;
    return x
}

var plusOne = (a) => { a + 1 }

let res = plusOne(3);
// console.log(res)

// if
var score = 60;

if (score >= 80) {
    console.log("A")
} else if (score >= 70) {
    console.log("B")
} else {
    console.log("C")
}

// loop
for (var i = 0; i <= 5; i++) {
    console.log(i);
}