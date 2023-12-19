import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ProfileData } from 'src/app/data/profile-data';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  name:string = null;
  profile_pic:string = "../../../assets/unknown.jpg";
  profile_link:string = null;

  //TODO: inject the Spotify service
  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
  }
   
  /*TODO: create a function which gets the "about me" information from Spotify when the button in the view is clicked.
  In that function, update the name, profile_pic, and profile_link fields */
  aboutMeInformation(){
    // console.log(this.spotifyService.aboutMe());
    this.spotifyService.aboutMe()
    .then(result => {(
        this.name = result.name,
        this.profile_link = result.spotifyProfile,
        this.profile_pic = result.imageURL,
        console.log(this.profile_link)
        );
  })
    .catch(error => console.log(error));


    
  }


}
