var map;
$(document).ready(function(){
    window.setInterval(getAndDraw, 3000);
});

/*
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBjE9Cr6iuDbG8x57_CcJ-9WDcheYmV62Q",
    authDomain: "mapas-50514.firebaseapp.com",
    databaseURL: "https://mapas-50514.firebaseio.com",
    projectId: "mapas-50514",
    storageBucket: "mapas-50514.appspot.com",
    messagingSenderId: "65462666897"
  };
  firebase.initializeApp(config);
*/

var url = "https://pcubicacion.firebaseio.com/usuarios.json";
var usuarios = {};
var arrayUsrs = new Array();
var markers = new Array();

function getAndDraw(){

    $.when(

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: url,
            async: false,
            dataType: "json",
            success: function (data){
                //console.log(data);
                usuarios = data;
            },
        })

    ).then(function( usuarios, textStatus, jqXHR ) {

        console.log('usuarios'+usuarios);
        console.log('textStatus'+textStatus);
        console.log('jqXHR'+jqXHR);
        console.log('jqXHR.status'+jqXHR.status);

        // Deserealizar data
        $.each( usuarios, function( usuari, objCoordenadas ) {

            // Limpiamos
            var usr = {};
            deleteMarkers();
            console.log(arrayUsrs);

            // Imprimimos con que USUARIO estamos trabajando
            usr.id = usuari;
            console.log("Usuario: "+usr);
            console.log(arrayUsrs);

            // Pasamos Obj_RECORRIDO a Cadena
            var strObjCoor = JSON.stringify(objCoordenadas);
            console.log(strObjCoor);

            // Contamos número de SUB_OBJETOS_RECORRIDO
            var arrStrCoordenadas = strObjCoor.split('}');
            var noCoordenadas = arrStrCoordenadas.length;

            // Obtenemos mi última ubicación
            var miUltimaUbicacion = arrStrCoordenadas[noCoordenadas-3];
            console.log(miUltimaUbicacion);

            /* Obtenemos la LATI y la LONGI*/

            // Como está en cadena dividimos por comillas
            var arrSubPorComillas = miUltimaUbicacion.split("\"");
            console.log(arrSubPorComillas);

            // Obtenemos la llave conformada por fecha con hora, que contiene mi última ubicación
            /*
            * "08-08-2017,12:34":{
            *       lat: "13.90334",
            *       lng: "15.23442"
            * }
            * */
            var miLlave = arrSubPorComillas[1];
            console.log(miLlave);

            // De todas nuestras coordenadas obtenemos la última
            var myObj = objCoordenadas[miLlave];
            console.log(myObj);

            // Obtenemos la Latitud
            usr.lat = myObj.lat;
            console.log(usr.lat);

            // Obtenemos la Longitud
            usr.lng = myObj.lng;
            console.log(usr.lng);

            // Almacenamos Usuarios en un Array
            console.log(usr);
            arrayUsrs.push(usr);
            console.log(arrayUsrs);

        });

        console.log(arrayUsrs);
        updateMapa(arrayUsrs);

        // Limpiamos
        arrayUsrs = [];
    });


}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}

async function updateMapa(usrsArray){
    console.log('usrsArray: '+usrsArray);

    var bounds = new google.maps.LatLngBounds();

    for( var i = 0; i < usrsArray.length; i++ ) {
        console.log(usrsArray[i].lat);
        console.log(usrsArray[i].lng);
        console.log(usrsArray[i].id);

        var position = new google.maps.LatLng(usrsArray[i].lat, usrsArray[i].lng);
        bounds.extend(position);
        markers[i] = new google.maps.Marker({
            position: position,
            map: map,
            title: usrsArray[i].id
        });
        map.fitBounds(bounds);
    }
}

function initMap(){

    var uluru = {lat: 15.3000, lng: 101.044};
        map = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: uluru
    });

    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });

}