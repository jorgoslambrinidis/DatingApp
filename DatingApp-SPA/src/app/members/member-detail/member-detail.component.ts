import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  // here we have to get the our detailed user from our api
  // *
  user: User;

  // add gallery here
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  // - we have to bring our UserService in the constructor, and also AlertifyService
  // - if we want to use and get access to the user id in the loadUser method,
  //   we have to include our router service "ActivatedRoute"
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) { }


  // here we have to load our data throgh the route
  // and we have to change our logic here

  ngOnInit() {
    // call the loadUser() method here in ngOnInit
    // this.loadUser();  // -> insted of this, we have to get our data from the route itself
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    // here we have to define to configure the galleryOptions
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    // here we have to get galleryImages
    // this.galleryImages = [];
    this.galleryImages = this.getImages();
  }

    getImages() {
      const imageUrls = [];
      for (let i = 0; i < this.user.photos.length; i++) {
        imageUrls.push({
          small: this.user.photos[i].url,
          medium: this.user.photos[i].url,
          big: this.user.photos[i].url,
          description: this.user.photos[i].description
        });
      }
      return imageUrls;
    }


  // ****** this loadUser() method is no longer required
  // // ex: members/4
  // loadUser() {
  //   // get route -> snapshot -> params -> and specify id parameter
  //   // but url is a string, and we want this "id" to be a number
  //   // we have to add "+" to the front of "this"
  //   // the id will be retrieved from the url as a string and then
  //   // convert into a number, and that is what we need to pass to our getUser method
  //   // -> because getUser method returns an "Observable", we have to subscribe to our method
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
  //     this.user = user; // to assign "user: User" to our user property //* "user: User;" inside this component
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }

}
