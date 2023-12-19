import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistData } from '../../data/artist-data';
import { TrackData } from '../../data/track-data';
import { AlbumData } from '../../data/album-data';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css']
})
export class AlbumPageComponent implements OnInit {
	albumId:string;
	album:AlbumData;
	tracks:TrackData[];


  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit() {
    
  	this.albumId = this.route.snapshot.paramMap.get('id');
    Promise.all([
      this.spotifyService.getAlbum(this.albumId),
      this.spotifyService.getTracksForAlbum(this.albumId)
    ]).then(([album, tracks]) => {
      this.album = album;
      this.tracks = tracks;
      console.log("ALBUM:", this.album);
      console.log("TRACKS:", this.tracks);
    });
    // this.spotifyService.getAlbum(this.albumId)
    //   .then(result => {
    //     this.album = result;
    //     console.log("ALBUM:", this.album);
    //   })
    // this.spotifyService.getTracksForAlbum(this.albumId)
    //   .then(trackData => {
    //     this.tracks = trackData;
    //     console.log("TRACKS Album page:", this.tracks);
    //   })
  	//TODO: inject spotifyService and use it to get the album data and the tracks for the album
  }
    getUniqueArtists() {
      let uniqueArtists = [];
      let artistIds = new Set();
      
      this.tracks.forEach(track => {
        track.artists.forEach(artist => {
          if (!artistIds.has(artist.id)) {
            artistIds.add(artist.id);
            uniqueArtists.push(artist);
          }
        });
      });

      return uniqueArtists;
    }

}
