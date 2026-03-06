document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.wind img');
    images.forEach(img => {
        img.addEventListener('click', function() {
            alert('You clicked on: ' + this.alt);
        });
    });
});
var a=img
if("Touch a"){
alert("Ты гей")
}
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});