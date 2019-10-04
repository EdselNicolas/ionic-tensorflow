import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { ObjectDetectionPage } from './object-detection';

@NgModule({
  declarations: [
    ObjectDetectionPage,
  ],
  imports: [
    IonicPageModule.forChild(ObjectDetectionPage),
  ],
})
export class ObjectDetectionPageModule {}
