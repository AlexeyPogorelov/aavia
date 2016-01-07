$('#main-overlay').on('click', function () {
    $('.main-overlay').toggleClass('hidden');
});
$('#grid-overlay').on('click', function () {
    $('.grid-overlay').toggleClass('hidden');
});
$('.main-input-holder').each(function (i) {
	$(this)
		.one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
			$(this).removeClass('scaleYIn');
		})
		.addClass('scaleYIn anim-delay-' + (i + 1));
});
$('intro-animation').one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
	$(this).removeClass('scaleYIn');
});