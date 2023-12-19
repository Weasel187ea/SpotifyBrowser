import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    // TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    // the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    // update the return to instead return a Promise with the data from the Express server
    // Note: toPromise() is a deprecated function that will be removed in the future.
    // It's possible to do the assignment using lastValueFrom, but we recommend using toPromise() for now as we haven't
    // yet talked about Observables. https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    const url = this.expressBaseUrl + endpoint;
    
    
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .toPromise()
        .then((response: any) => {
          resolve(response); // Resolve the promise with the response data
        })
        .catch((error: any) => {
          reject(error); // Reject the promise with the error
        });
    });
  }
 
  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }
 
  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.

    let uri = encodeURIComponent(resource);
    let endpoint = '/search/' + category + '/' + uri;
    let response_array: ResourceData[] = [];
    return this.sendRequestToExpress(endpoint).then((data) => {
      console.log(category);
      if (data['artists'] != null) {
        response_array = data['artists']['items'].map((artist) => {
          return new ArtistData(artist);
        });
      } else if (data['albums'] != null) {
        response_array = data['albums']['items'].map((album) => {
          return new AlbumData(album);
        })
      } else if (data['tracks'] != null) {
        response_array = data['tracks']['items'].map((track) => {
          return new TrackData(track);
        })
      }
      return response_array;
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    let artistID = encodeURIComponent(artistId);
    let endpoint = '/artist/' + artistID;

    return this.sendRequestToExpress(endpoint)
      .then((data) => {
        return new ArtistData(data);
      })
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    console.log("inside get related Artists");
    let artistID = encodeURIComponent(artistId);
    let endpoint = '/artist-related-artists/' + artistID;
    let related_artist_data: ArtistData[] = [];
    console.log(endpoint);

    return this.sendRequestToExpress(endpoint).then((data) => {
      // console.log("requiested data", data["artists"]);

      related_artist_data = data["artists"].map((artist) =>{
        return new ArtistData(artist);
      });
      return related_artist_data;

    });

  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    let artistID = encodeURIComponent(artistId);
    let endpoint = '/artist-top-tracks/' + artistID;
    let top_tracks: TrackData[] = [];

    return this.sendRequestToExpress(endpoint).then((data) => {
      // console.log("top tracks", data);
      top_tracks = data["tracks"].map((track) => {
        return new TrackData(track);
      })

      return top_tracks;
    });

  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    let artistID = encodeURIComponent(artistId);
    let endpoint = '/artist-albums/' + artistID;
    let albums: AlbumData[] = [];

    return this.sendRequestToExpress(endpoint).then((data) => {
      console.log("album_data", data);
      albums = data["items"].map((track) => {
        return new AlbumData(track);
      })

      return albums;
    });

  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    let artistID = encodeURIComponent(albumId);
    let endpoint = '/album/' + albumId;

    return this.sendRequestToExpress(endpoint).then((data) => {
      // console.log("inside get album",data);
      return new AlbumData(data);
    })

  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    let artistID = encodeURIComponent(albumId);
    let endpoint = '/album-tracks/' + albumId;
    let album_tracks: TrackData[] = [];

    return this.sendRequestToExpress(endpoint).then((data) => {
      // console.log("inside Get tracks", data);
      album_tracks = data["items"].map((track) => {
        return new TrackData(track);
      })

      return album_tracks;
    });

  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    let artistID = encodeURIComponent(trackId);
    let endpoint = '/track/' + trackId;
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new TrackData(data);
    })

  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    let artistID = encodeURIComponent(trackId);
    let endpoint = '/track-audio-features/' + artistID;
    let track_features: TrackFeature[] = [];

    return this.sendRequestToExpress(endpoint).then((data) => {
      console.log("this is inside audio track", data);
      // track_features = TrackFeature(data)
      track_features.push(new TrackFeature('danceability', data['danceability']));
      track_features.push(new TrackFeature('acousticness', data['acousticness']));
      track_features.push(new TrackFeature('instrumentalness', data['instrumentalness']));
      track_features.push(new TrackFeature('liveness', data['liveness']));
      track_features.push(new TrackFeature('speechiness', data['speechiness']));
      track_features.push(new TrackFeature('valence', data['valence']));
      track_features.push(new TrackFeature('energy', data['energy']));

      return track_features
    })

  }
}
