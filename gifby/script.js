function change() {
  var elem = document.getElementById("example_button");
  if(elem.innerHTML == "IT DIDN'T WORK") {
    elem.innerHTML = "IT WORKED";
  }
  else {
    elem.innerHTML = "IT DIDN'T WORK";
  }
}
