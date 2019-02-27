<?php 
	require_once ('./styles/colour/color.php');
	use Mexitek\PHPColors\Color;
	
	if ($page->template == 'list') {
	$listCat = $page->categories->first();
	$listCatWithColour = findCatAncestorWithColour($listCat);
	$listCatColour = $listCatWithColour->cat_colour;	
	$ccolour_base = $listCatColour;
	}
	else if ($page->template == 'category') {
	$listCat = $page;
	$listCatWithColour = findCatAncestorWithColour($listCat);
	$listCatColour = $listCatWithColour->cat_colour;	
	$ccolour_base = $listCatColour;
	}
	else {
	$ccolour_base = '437AA5';//'0cce91'//
	//primomoGreen '0cce91'//
	//primomoBLUE  '368EDB'//'4889F4'//'286f9d'//
	}

	$ccolour_init = new Color($ccolour_base);	
	
	$ccolour_d1 = $ccolour_init->darken(4);
	$ccolour_d2 = $ccolour_init->darken(8);
	$ccolour_d3 = $ccolour_init->darken(12);
	$ccolour_l1 = $ccolour_init->lighten(6);
	
	$mobilebreakpoint = 719;
	$mobilebreakpointUnit = 'px';
?>
<style class="game-colour">
/* ccolour_base - base */
.ccolour_base { background: #<?php echo $ccolour_base ?>}
.ccolour_base-border { border-color: #<?php echo $ccolour_base ?>}
.ccolour_base-text { color: #<?php echo $ccolour_base ?>}
/* ccolour_d1 - darker 1 */
.ccolour_d1 { background: #<?php echo $ccolour_d1 ?>}
.ccolour_d1-border { border-color: #<?php echo $ccolour_d1 ?>}
.ccolour_d1-text { color: #<?php echo $ccolour_d1 ?>}
/* ccolour_d2 - darker 2 */
.ccolour_d2 { background: #<?php echo $ccolour_d2 ?>}
.ccolour_d2-border { border-color: #<?php echo $ccolour_d2 ?>}
.ccolour_d2-text { color: #<?php echo $ccolour_d2 ?>}
/* ccolour_d3 - darker 3 */
.ccolour_d3 { background: #<?php echo $ccolour_d3 ?>}
.ccolour_d3-border { border-color: #<?php echo $ccolour_d3 ?>}
.ccolour_d3-text { color: #<?php echo $ccolour_d3 ?>}
/* ccolour_l1 - lighter 1 */
.ccolour_l1, {background: #<?php echo $ccolour_l1 ?>}
.ccolour_l1-border { border-color: #<?php echo $ccolour_l1 ?>}
.ccolour_l1-text { color: #<?php echo $ccolour_l1 ?>}
/* Colour Styles */
body, #viewport, .page-wrap:before {
	background: #<?php echo $ccolour_base ?>
	}
.top-bar-section ul li, .top-bar-section li:not(.has-form) a:not(.button), .top-bar-section .has-form {
	background: none;
	}
.top-bar-section li:not(.has-form) a:not(.button):hover, .top-bar-section ul li:hover:not(.has-form) > a, .top-bar-section .dropdown li:not(.has-form):not(.active) > a:not(.button) {
	background: #<?php echo $ccolour_d2 ?>
	}
html.touch .top-bar-section li.has-dropdown a:hover {
	background:none;
	}
html.touch .top-bar-section li.has-dropdown.not-click a:hover {
	background:#<?php echo $ccolour_d2 ?>;
	}
.top-bar-section .dropdown li:not(.has-form):not(.active):hover > a:not(.button) {
	background: #<?php echo $ccolour_d3 ?>
	}
.top-bar, .fixednav, .top-bar .title-area, .top-bar.expanded .title-area {
	background: #<?php echo $ccolour_d1 ?>
	}	
.top-bar input[type="text"] {
	border-color: #<?php echo $ccolour_d1 ?>
	}
.accordian-percent {
	background: #<?php echo $ccolour_d2 ?>
	}
.results-header h3 {
    color: #<?php echo $ccolour_d2 ?>
	}
.sidebar-tags h4, .sidebar-cats h4 {
    color: #<?php echo $ccolour_d2 ?>
	}	
h3.section-header, h3.section-header a  {
    color: #<?php echo $ccolour_d3 ?>
	}	
h3.section-header a:hover  {
    color: #<?php echo $ccolour_d2 ?>
	}		
/* Medium and Up Only */	
@media only screen and (min-width: <?php echo $mobilebreakpoint+1 . $mobilebreakpointUnit ?>) {
	.top-bar-section li.active:not(.has-form) a:not(.button) {
		background: #<?php echo $ccolour_d1 ?>
		}
	.top-bar-section li.active:not(.has-form) a:not(.button):hover {
		background: #<?php echo $ccolour_d2 ?>
		}
	.top-bar-section .dropdown li.active:not(.has-form) a:not(.button) {
		background: #<?php echo $ccolour_d2 ?>
		}
	.top-bar-section .dropdown li.active:not(.has-form) a:not(.button):hover {
		background: #<?php echo $ccolour_d3 ?>
		}		
	}
/* Small Only */	
@media only screen and (max-width: <?php echo $mobilebreakpoint . $mobilebreakpointUnit ?>) {
	.top-bar-section ul li, .top-bar-section .has-form {
		background: #<?php echo $ccolour_d2 ?>
		}
	.top-bar-section li:not(.has-form) a:not(.button):hover, .top-bar-section ul li:hover:not(.has-form) > a {
		background: #<?php echo $ccolour_d3 ?>
		}
	}
</style>
<style class="cat-colours">
<?php 
$catsWithColour = $pages->find("template=category, cat_colour!=''");
foreach($catsWithColour as $catWithColour) {
	echo ".catcolour_" . $catWithColour->name . "_standard{";
	echo "background:#" . $catWithColour->cat_colour . ";}";
	echo ".catcolour_" . $catWithColour->name . "_inverted *{";
	echo "color:#" . $catWithColour->cat_colour . " !important;}";
	}
?>	
</style>