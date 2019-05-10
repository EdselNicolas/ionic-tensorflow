import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as mobilenet from '@tensorflow-models/mobilenet';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  @ViewChild('imgEl') imgEl: ElementRef
  modelType: string = 'inception';
  capturedImg = {
    base64: '',
    raw: ''
  };
  recognizedResults: Array<any> = [];

  mnetModel: mobilenet.MobileNet;
  constructor(public navCtrl: NavController, private camera: Camera, private loadingCtrl: LoadingController) {

  }

  ngOnInit() {

  }

  onModelChange(ev) {
    console.log(ev);
    if (this.capturedImg.raw.length) {
      this.processImage()
    }
  }

  captureImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType[sourceType]
    }

    this.camera.getPicture(options).then(async base64 => {
      this.capturedImg.raw = base64
      this.capturedImg.base64 = `data:image/jpeg;base64,${base64}`;
      this.processImage()

    }, (err) => {
      console.log(err);
    })
  }

  async processImage() {

    const loader = this.loadingCtrl.create({
      content: 'Processing Image...'
    })
    loader.present()

    if (this.modelType == 'mobilenet') {
      // downloading models (internet connection required!)
      this.mnetModel = await mobilenet.load()
      // using pre trained model
      this.mnetModel.classify(this.imgEl.nativeElement).then(results => {
        this.recognizedResults = results
        loader.dismiss()
      }).catch(err => {
        console.log(err);
        loader.dismiss()
      })

    } else {
      // using default model by tensorflow
      let tf = new (<any>window).TensorFlow('inception-v1')

      tf.classify(this.capturedImg.raw).then(results => {
        this.recognizedResults = results
      })

      tf.load().then(function () {
        loader.dismiss()
      })
    }

  }

}
