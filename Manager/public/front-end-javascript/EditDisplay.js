Dropzone.options.myAwesomeDropzone = {
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 5, // MB
    parallelUploads: 10,
    maxFiles: 10,
    acceptedFiles: "image/jpeg,image/png,image/bmp,image/gif",
    init: function () {
        this.on("queuecomplete", function () {
            if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                location.reload();
            }
        });
    }
};
