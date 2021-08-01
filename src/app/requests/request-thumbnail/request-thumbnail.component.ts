import { Component, Input, OnInit } from '@angular/core';
import { Requests } from '../requests.service';

@Component({
  selector: 'app-request-thumbnail',
  templateUrl: './request-thumbnail.component.html',
  styleUrls: ['./request-thumbnail.component.scss'],
})
export class RequestThumbnailComponent implements OnInit {
  @Input() item: Requests;
  constructor() { }

  ngOnInit() { }

}
