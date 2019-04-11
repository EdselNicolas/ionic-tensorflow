import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  capturedImg: string = '';
  recognizedResults: Array<any> = []
  constructor(public navCtrl: NavController, private camera: Camera, private loadingCtrl: LoadingController) {

  }

  ngOnInit() {

  }

  captureImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then(base64 => {

      let loader = this.loadingCtrl.create({
        content: 'Processing Image...'
      })
      loader.present()

      let tf = new (<any>window).TensorFlow('inception-v1')
      this.capturedImg = `data:image/jpeg;base64,${base64}`;
      tf.classify(base64).then(results => {
        this.recognizedResults = results
        // results.forEach(result => {
        //   console.log(result.title + " " + result.confidence);
        // });
      })


      tf.load().then(function() {
        loader.dismiss()
      })

   
  }, (err) => {
    console.log(err);
  })
  }
}
