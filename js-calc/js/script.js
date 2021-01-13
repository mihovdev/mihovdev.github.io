function calc(){
    var firstNum = parseFloat(document.getElementById("first_num").value);
    var secondNum = parseFloat(document.getElementById("sec_num").value);
    var result = document.getElementById("result");

    var plus = document.getElementById("plus");
    var minus = document.getElementById("minus");
    var divide = document.getElementById("divide");
    var multiply = document.getElementById("multiply");


    result = firstNum + secondNum;

    document.getElementById("result").value = result;

}