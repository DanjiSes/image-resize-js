document.addEventListener('DOMContentLoaded', function() {
  // Script

  var input =         document.getElementById('imageInput');
  var resizedImgEl =    document.getElementById('rsized');

  input.addEventListener('change', function(e) {
    var files = e.target.files;
    
    /**
     * Work
     */
    var file = files[0];

    console.log();
    
    resizeImage(file).then(function(obj) {
      resizedImgEl.src = obj.base64
    })
  })
});

function resizeImage(file, max_size = 544) {
  return new Promise(function(resolve, reject) {
    try {
      var reader = new FileReader();
      reader.onload = function (readerEvent) {
          var image = new Image();
          image.onload = function () {

              // Resize the image
              var canvas = document.createElement('canvas'),
                  width = image.width,
                  height = image.height;
              if (width > height) {
                  if (width > max_size) {
                      height *= max_size / width;
                      width = max_size;
                  }
              } else {
                  if (height > max_size) {
                      width *= max_size / height;
                      height = max_size;
                  }
              }
              canvas.width = width;
              canvas.height = height;
              canvas.getContext('2d').drawImage(image, 0, 0, width, height);
              var dataUrl = canvas.toDataURL('image/jpeg');
              var resizedImage = dataURLToBlob(dataUrl);
              
              resolve({file: resizedImage, base64: dataUrl })
          }
          image.src = readerEvent.target.result;
      }
      reader.readAsDataURL(file);
    } catch (e) {
      reject(e)
    }
  })
}

/* Utility function to convert a canvas to a BLOB */
var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}