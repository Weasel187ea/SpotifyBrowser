import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistData } from '../../data/artist-data';
import { TrackData } from '../../data/track-data';
import { AlbumData } from '../../data/album-data';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css']
})
export class ArtistPageComponent implements OnInit {
	artistId:string;
	artist:ArtistData;
	relatedArtists:ArtistData[];
	topTracks:TrackData[];
	albums:AlbumData[];

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit() {
  	this.artistId = this.route.snapshot.paramMap.get('id');
    //TODO: Inject the spotifyService and use it to get the artist data, related artists, top tracks for the artist, and the artist's albums
    Promise.all([
      this.spotifyService.getArtist(this.artistId),
      this.spotifyService.getRelatedArtists(this.artistId),
      this.spotifyService.getTopTracksForArtist(this.artistId),
      this.spotifyService.getAlbumsForArtist(this.artistId)
    ]).then(([artist, relatedArtists, topTracks, albums]) => {
      this.artist = artist;
      this.relatedArtists = relatedArtists;
      this.topTracks = topTracks;
      this.albums = albums;
      console.log("ARTIST:", this.artist);
      console.log("RELATED ARTISTS:", this.relatedArtists);
      console.log("TOP TRACKS:", this.topTracks);
      console.log("ALBUMS:", this.albums);
    });
  }

}