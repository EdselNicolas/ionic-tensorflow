import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

@IonicPage()
@Component({
  selector: 'page-object-detection',
  templateUrl: 'object-detection.html',
})
export class ObjectDetectionPage {
  @ViewChild('imgEl') imgEl: ElementRef
  @ViewChild('canvasEl') canvasEl: ElementRef
  capturedImg: string = ''
  recognizedResults: Array<any> = [];
  loader: any
  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObjectDetectionPage');
  }

  captureImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType[sourceType],
      correctOrientation: true
    }

    this.camera.getPicture(options).then(async base64 => {
      this.capturedImg = `data:image/jpeg;base64,${base64}`;

      this.loader = this.loadingCtrl.create({
        content: 'Processing Image...'
      })
      this.loader.present()
      // let img = new Image();
      // img.src = this.capturedImg
      // img.onload = () => {


      // }

    }, (err) => {
      console.log(err);
    })
  }

  async imageLoadEvent() {
    let canvas = this.canvasEl.nativeElement
    let context = canvas.getContext('2d');
    const img = this.imgEl.nativeElement
    console.log(this.imgEl);
    
    // let imgWidth = img.naturalWidth;
    // let screenWidth = canvas.width;
    // let scaleX = 1;
    // if (imgWidth > screenWidth)
    //   scaleX = screenWidth / imgWidth;
    // let imgHeight = img.naturalHeight;
    // let screenHeight = canvas.height;
    // let scaleY = 1;
    // if (imgHeight > screenHeight)
    //   scaleY = screenHeight / imgHeight;
    // let scale = scaleY;
    // if (scaleX < scaleY)
    //   scale = scaleX;
    // if (scale < 1) {
    //   imgHeight = imgHeight * scale;
    //   imgWidth = imgWidth * scale;
    // }

    canvas.height = img.clientHeight;
    canvas.width = img.clientWidth;

    const font = "16px sans-serif";
    context.font = font;
    context.baseline = "top";
    // context.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
    canvas.style.backgroundImage = `url(\'${img.src}\')`;
    canvas.style.backgroundSize = `${img.clientWidth}px ${img.clientHeight}px`;
    canvas.style.backgroundRepeat = 'no-repeat';
    
    let model = await cocoSsd.load()
    this.recognizedResults = await model.detect(this.imgEl.nativeElement)

    this.recognizedResults.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];

      //bounding box
      context.strokeStyle = "#00FFFF"
      context.lineWidth = 2;
      context.strokeRect(x, y, width, height);

      // object text
      context.fillStyle = "#000000";
      context.fillText(prediction.class, x, y);
    })

    console.log(this.recognizedResults);
    this.loader.dismiss()
  }

}
