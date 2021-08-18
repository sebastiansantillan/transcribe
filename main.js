const video = document.getElementById("video");
const guardar = document.getElementById("guardar");
const word = document.getElementById("word");
const playbackrate = document.getElementById("playbackrate");

var transcripcion = [];
var filename = '';
var texto = '';
var posicion = 0;

function export2Word(nombrearchivo, html) {
    var html, link, blob, url, css;

    css = (
        '<style>' +
        '@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
        'div.WordSection1 {page: WordSection1;}' +
        '</style>'
    );
    
    blob = new Blob(['\ufeff', css + html], {
        type: 'application/msword'
    });
    url = URL.createObjectURL(blob);
    link = document.createElement('A');
    link.href = url;
    link.download = nombrearchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function playSelectedFile() {
    let file = $("#file")[0].files[0];
    filename = file['name'];
    document.getElementById('archivonombre').innerHTML = filename;
    let videoNode = document.querySelector('video');
    let fileURL = URL.createObjectURL(file);
    videoNode.src = fileURL;

    // Buscar en el localStorage
    let dvtranscripcion = window.localStorage.getItem('dvtranscripcion');
    transcripcion = JSON.parse(dvtranscripcion);
    let resultado = undefined;
    if (transcripcion != null) {
        resultado = transcripcion.find(elemento => elemento.filename === filename)
    }

    if (resultado != undefined) {
        texto = resultado.texto;
        posicion = resultado.posicion;
        video.currentTime = posicion;
    } else {
        texto = '';
    }

    $('#summernote').summernote('code', texto);
    playbackrate.innerHTML = '1.0';

};

function reproducir() {
    if (video.paused)
        video.play();
    else
        video.pause();
};

function atras() {
    video.currentTime = video.currentTime - 1;
};

function adelante() {
    video.currentTime = video.currentTime + 1;
};

function lento() {
    let velocidad = video.playbackRate - 0.25;
    if (velocidad < 0.25)
        velocidad = 0.25;
    video.playbackRate = velocidad;
    playbackrate.innerHTML = velocidad;
};

function rapido() {					
    let velocidad = video.playbackRate + 0.25;
    if (velocidad > 10)
        velocidad = 10;
    video.playbackRate = velocidad;			
    playbackrate.innerHTML = velocidad;
};



function save() {
    texto = $('#summernote').summernote('code');
    let posicion = video.currentTime;
    let a = {
        'filename': filename,
        'texto': texto,
        'posicion': posicion
    }

    if (transcripcion === null)
        transcripcion = [a];
    else {
        let index = transcripcion.findIndex(elemento => elemento.filename === filename);
        if (index != -1)
            transcripcion[index] = a;
        else
            transcripcion.push(a)
    }

    let jsonificado = JSON.stringify(transcripcion);
    window.localStorage.setItem('dvtranscripcion', jsonificado);
    guardar.classList.remove('btn-danger');
    guardar.classList.add('btn-secondary');
    document.getElementById('summernote').focus();
    
};


$('#botonplay').click(function () {
    reproducir();
});
$('#botonpause').click(function () {
    video.pause();
    alert(video.playbackRate);
});

shortcut.add("F1", function () {
    atras();
});
shortcut.add("F2", function () {
    adelante();
});
shortcut.add("F3", function () {
    lento();
});
shortcut.add("F4", function () {
    rapido();
});

shortcut.add("F6", function () {
    save();
});

shortcut.add("F7", function () {
    html = $('#summernote').summernote('code');
    export2Word(filename+'.doc', html);
});

shortcut.add("Esc", function () {
    reproducir();
});


$('#file').change(function () {
    var URL = window.URL || window.webkitURL;
    playSelectedFile();
});

guardar.addEventListener('click', () => {
    save();
});

word.addEventListener('click', () => {
    html = $('#summernote').summernote('code');
    export2Word(filename+'.doc', html);
})	



$(document).ready(function () {		
    $('#summernote').summernote({
        callbacks: {
            onChange: function (contents) {
                guardar.classList.remove('btn-secondary');
                guardar.classList.add('btn-danger');
            }
        }
    });
});