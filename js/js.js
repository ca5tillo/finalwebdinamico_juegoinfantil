window.addEventListener('load',init);
var obj_en_movimiento = null;// esto es para poder eliminar el objeto despue de moverlo
var ANIMALESxCATEGORIA = 8;// EL # DE ANIMALES QUE DEVUELVE POR CATEGORIA

function init(){
	cargarControles();
	
}
/*
 * CARGAR CONTROLES Y LLAMAS A CRAR ENTORNO
*/

function cargarControles(){
	var selector      = document.getElementById('selectClasificacion');
	var btn_jugar     = document.getElementById('btn-jugar');
	var btn_reiniciar = document.getElementById('btn-reiniciar');
	var btn_calificar = document.getElementById('btn-calificar');

	selector.innerHTML = getItemsClasificar();
	btn_jugar.addEventListener('click',crearEntornoDeJuego);
	btn_reiniciar.addEventListener('click',reiniciarJuego);
	btn_calificar.addEventListener('click',calificar);
}
function reiniciarJuego(){
	if(confirm("¿Desear Resetear el juego?")){
		location.reload();
	}
}
function limpiarPizarron(){
	document.getElementById('categorias').innerHTML = "";
	document.getElementById('aside').innerHTML = "";
}
function crearEntornoDeJuego(){
	// CREAR SECCIONES DE CATEGORIAS
	var lst_categorias = Array();
	var val_select =document.getElementById('selectClasificacion').value;
	var area_categorias = document.getElementById('categorias');
	var aside = document.getElementById('aside');
	document.getElementById('btn-jugar').style.display = 'none';
	document.getElementById('btn-reiniciar').style.display = 'inline';

	limpiarPizarron();

	lst_categorias = getCategorias(val_select);

	pintarCategorias(lst_categorias, area_categorias);

	pintarAnimales(lst_categorias, aside);

	lst_categorias = [];

	dragAndDrop(); // vueve a cargar las llavadas a eventos
}
function pintarAnimales(lst_categorias, aside){
	var array = new Array();
	for(var i = 0 ; i < lst_categorias.length; i++){
		if(i == 0)
			array = getAnimales(ANIMALESxCATEGORIA, lst_categorias[i].nombre);
		else
			array = array.concat(getAnimales(ANIMALESxCATEGORIA, lst_categorias[i].nombre));
	}
	// Desordeno el array para que salgan aleatorios
	array = array.sort(function() {return Math.random() - 0.5});

	for(var i = 0 ; i < array.length; i++){
		aside.innerHTML += plantillaanimal(
			array[i].nombre, 
			array[i].src, 
			array[i].categoria, 
			array[i].descripcion, 
			i);
	}
}
function pintarCategorias(lst_categorias, area_categorias){
	[].forEach.call(lst_categorias, function(obj_categoria) {
		area_categorias.innerHTML += 
			plantillacaregorias(obj_categoria.nombre, obj_categoria.descripcion);
	});
}

/*
 * FUNCION PARA CALIFICAR 
*/

function activarCalificar(){
	if(0 == document.querySelectorAll('aside .obj-animal').length){
		document.getElementById('btn-calificar').disabled=false;
	}else{
		document.getElementById('btn-calificar').disabled=true;
	}
}
function calificar(){
	var categorias = document.querySelectorAll('#categorias .categoria');
	//CADA BLOQUE DE CATEGORIA 	
	[].forEach.call(categorias, function(categoria) {
		var categoria_del_contenedor = categoria.getAttribute("data-categoria");
		var categoria_del_animal = "";
		var after_id = "";
		
		//LOS OBJ ANIMALES  
	  	[].forEach.call(categoria.querySelectorAll('.obj-animal'), function(obj_animal) {
			
			categoria_del_animal = 
				obj_animal.querySelector('.img-animal').getAttribute('data-categoria-nimal');
			after_id =	
				obj_animal.querySelector('.img-animal').getAttribute('data-after-id');
			if(categoria_del_contenedor == categoria_del_animal){
				document.getElementById("img-acierto-"+after_id).classList.remove('oculto');
			}else{
				document.getElementById("img-error-"+after_id).classList.remove('oculto');
			}
			
			
		});
		
	});
	//mostrar respuesta 
	
	var todoslosanimales = document.getElementsByClassName("mostrar-verificar"); 

	for (i = 0; i < todoslosanimales.length; i++) { 
	    todoslosanimales[i].classList.remove('oculto');
	}
}

/*
 * CONSULTAS A obj.js
*/
function getItemsClasificar () {
	var string = "";
	for (var i = 0 ; i < obj.Clasificar_por.length; i++) {
		var nombre = obj.Clasificar_por[i].nombre;
		string += '<option value="'+nombre+'">'+nombre+'</option>';
	}
	return string;
}

function getCategorias(val_select){
	var categorias = Array();
	var obj_nombre = "";
	for(var i = 0 ; i < obj.Clasificar_por.length; i++){
		obj_nombre = obj.Clasificar_por[i].nombre;
		if(obj_nombre == val_select){
			for(var j = 0 ; j < obj.Clasificar_por[i].categorias.length; j++){
				categorias.push(obj.Clasificar_por[i].categorias[j]);
			}
		}
	}
	return categorias;
}

function getAnimales(numAnimales, categoria){
	var array = new Array();
	var array2 = new Array();
	var s_animales = "";
	//Recorro todos los animales y de cada uno recorro sus categorias
	for (var i = 0 ; i < obj.Animales.length; i++) {
		for(var j = 0; j < obj.Animales[i].categorias.length; j++ ){

			// Todo animal que coincida con la categoria es anadido al array	
			if(categoria == obj.Animales[i].categorias[j]){
				array.push(obj.Animales[i]);
			}

		}
	}

	// Desordeno el array para que salgan aleatorios
	array = array.sort(function() {return Math.random() - 0.5});

	// Recorro la array desordenado para obtener solo la cantidad que se pidio 
	if(array.length >= numAnimales){
		for(var i = 0 ; i < numAnimales ; i++){
			var JSON = {
				"nombre":array[i].nombre,
				"src":array[i].src,
				"descripcion":array[i].descripcion,
				"categoria":categoria
			};
			array2.push(JSON);
		}
	}

	return array2;
}

/*
 * PLANTILLAS
*/
function plantillaanimal(nombre, src, categoria, descripcion, i){
	var id = nombre+'-'+categoria+'-'+i;
	var s_animal = ''

		+'<div class="obj-animal drag" draggable="true">'
			+'<div class="imagenes" onclick="mostrarModal(\'modal-'+id+'\');">'
				+'<img '
					 +'class="img-post_it" '
					 +'src="img/post_it.png" alt="">'
				+'<img '
					 +'class="img-animal" '
					 +'data-categoria-nimal="'+categoria+'" '
					 +'data-after-id="'+id+'" '
					 +'src="'+src+'" '
					 +'alt="">'

				+'<img id="img-error-'+id+'" '
					 +'src="img/error.jpg" '
					 +'alt="" ' 
					 +'class="img-error oculto">'

				+'<img id="img-acierto-'+id+'" '
					 +'class="img-acierto oculto" '
					 +'src="img/acierto.png" '
					 +'alt="">'
			+'</div>'
			+'<div id="modal-'+id+'" class="modal oculto">'
				
				+'<img src="'+src+'">'
			
				+'<h2>'+nombre+'</h2>'
				+'<h3 class="mostrar-verificar oculto">'
				+'Este Animal Pertenece a la categoria <big><u>'+categoria+'</u></big>.'
				+'</h3><br><br>'
				+'<p>'
					+descripcion
				+'</p>'
				+'<div class="cerrarModal">'
					+'<a href="javascript:cerrarModal(\'modal-'+id+'\');">'
						+'<img src="img/cerrar.png" alt="">'
					+'</a>'
				+'</div>'
			+'</div>'
		+'</div>';
	return s_animal;
}

function plantillacaregorias(categoria, descripcion){
	var string = ''
	+'<div class="categoria" data-categoria="'+categoria+'" >'
		+'<a href="javascript:onclick=mostrarModal(\'modal-des-cat-'+categoria+'\');">'
			+'<header>'
				+'<img src="img/categoria-header.png" class="fondo">'
				+'<p class="nombreCategoria">'+categoria+'</p>'
			+'</header>'
		+'</a>'
		+'<div class="categoria-area-post-it"></div>'

		+'<div id="modal-des-cat-'+categoria+'" class="modal oculto">'
					
			+'<h1>'+categoria+'</h1>'
			
			+'<p>'
				+descripcion
			+'</p>'
			+'<div class="cerrarModal">'
				+'<a href="javascript:cerrarModal(\'modal-des-cat-'+categoria+'\');">'
					+'<img src="img/cerrar.png" alt="">'
				+'</a>'
			+'</div>'
		+'</div>'

	+'</div>';
	return string;
}

/*
 * MOSTRAR LAS VENTANAS MODALES 
*/
function cerrarModal(id){
	//
	document.getElementById(id).classList.add('oculto');
}
function mostrarModal(id){
	//
	document.getElementById(id).classList.remove('oculto');
}

/*
 *  FUNCIONES DE DRAG AND DROP
*/
function dragAndDrop () {
	obj_animal = document.getElementsByClassName('drag');
	areaSoltar = document.querySelectorAll('.categoria-area-post-it, aside');

	[].forEach.call(obj_animal, function(animal) {

	  animal.addEventListener('dragstart', arrastrarInicio, false);
	  animal.addEventListener('dragend', arrastrarFin, false);
	  
	});

	[].forEach.call(areaSoltar, function(a){
		a.addEventListener('dragenter', soltarEntro, false);
	    a.addEventListener('dragover', soltarNavegando, false);
		a.addEventListener('drop', soltar, false);
		a.addEventListener('dragleave', soltarSale, false);
	});
}
function arrastrarInicio(e){
	this.classList.add('opaco');
	obj_en_movimiento = this; // esto es para poder eliminar el objeto despue de moverlo 
	animal = '<div class="obj-animal drag" draggable="true">'+this.innerHTML+"</div>";
	e.dataTransfer.setData('text/html', animal);
}
function arrastrarFin(e){
	this.classList.remove('opaco');
	//
}
function soltarEntro(e){
	e.preventDefault();
	this.classList.add('over');	
}
function soltarNavegando(e){
	e.preventDefault();
	this.classList.add('over');	
}
function soltar(e){
	e.preventDefault();
	id_caja = this.parentNode.getAttribute('data-categoria');
	id_padre_animal = obj_en_movimiento.parentNode.parentNode.getAttribute('data-categoria');

	if(id_caja != id_padre_animal){
	    this.innerHTML += e.dataTransfer.getData('text/html');
		obj_en_movimiento.parentNode.removeChild(obj_en_movimiento);
		
	 	dragAndDrop (); // Recargar los disparadores ya que los elementos cambian de lugar
	 	activarCalificar();
	 	
 	}
 	this.classList.remove('over');
}
function soltarSale(e){
	e.preventDefault();
	this.classList.remove('over');
}
