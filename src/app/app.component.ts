import { Component } from '@angular/core';
import {SAMPLE_TREE} from "./data/sample-tree";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected readonly SAMPLE_TREE = SAMPLE_TREE;
}
