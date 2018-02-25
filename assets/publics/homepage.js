$(document).ready(function() {
	var device = $( window ).width();
	if(device >= "768") {
		$('#home').fullpage({
			paddingTop: "60px",
			sectionsColor : ['rgb(47, 161, 37)', 'rgb(65, 140, 252)', '#d94e4e', 'rgb(162, 84, 163)'],
			navigation: true,
			navigationPosition: 'right',
		});
	}
});