///<reference path="../../../typings/tsd.d.ts"/>
import infra  = require("./infra-module");
import schemas  = require("schemas");
let app = infra.app;
class ImageMaintenance{
	static $inject = ["Upload","toastr","imageResource"];	
	public files;
    public images : schemas.Image[];
    
	constructor(private Upload,private toastr : infra.Toaster,private imageResource){
        this.loadImages();       
    }
    
    private loadImages(){
        this.images = this.imageResource.getAll();
    }
	
    uploadFiles() {
      if (this.files && this.files.length) {
        // for (var i = 0; i < this.files.length; i++) {
        //   this.Upload.upload({..., data: {file: files[i]}, ...})...;
        // }
        // or send them all together for HTML5 browsers:
        this.Upload.upload({url :"/api/images", data: {file: this.files}}).then(()=>{
			this.toastr.success("התמונות נשמרו");
            this.loadImages();
		});
      }
    }
    
    deleteImage(image : schemas.Image){
        this.imageResource.delete(image._id).then(()=>{
            this.loadImages();    
        });
    }
}


app.controller("imageMaintenance",ImageMaintenance);

app.factory('imageResource', ['peamitResource', function (peamitResource) {
    return peamitResource("images");
} ]);