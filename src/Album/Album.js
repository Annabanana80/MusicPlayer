import React, {Component} from 'react';
import './Album.css';
import albumData from './../data/albums';
import PlayerBar from '../PlayerBar/PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });
    
    this.state = { 
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration, 
      isPlaying: false,
      hover: false,
      volume: 0.8
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  formatTime(time) {
    return time ? `${Math.floor(time / 60)}:${Number(time % 60 / 100).toFixed(2).substr(2,3)}` : '-:--'
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    this.audioElement.volume = e.target.value;
    this.setState({ volume: e.target.value });
  }

   hoverOn (song) {
     this.setState ({hover:song});
   }

   hoverOff (song) {
     this.setState ({hover:null});
   }
   displaySongNumber (song, index) {
     if (this.state.currentSong === song && this.state.isPlaying){
       return <span className="ion-pause"></span>
    }
    else if (this.state.hover === song) {
       return <span className="ion-play"></span>
        }
     else {
       return (index + 1 + ".")
        }
    }

  songClass(song) {
    if (this.state.currentSong === song) { 
      if (this.state.isPlaying) { 
        return 'song playing';
      } else { 
        return 'song'; 
      }
    }
    return 'song';
  }

  render() {
    return (
      <div>
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt="Album Cover" />
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.year} {this.state.album.label}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>  
          <tbody>
            {this.state.album.songs.map( (song, index) => 
              <tr className={this.songClass(song)} key={index} onClick={() => this.handleSongClick(song)} >
                <td className="song-actions">
                	<span
                	    onMouseEnter={() => this.hoverOn(song)}
          				onMouseLeave={() => this.hoverOff(song)}
                	>{this.displaySongNumber(song, index)}</span>
                  	    
                </td>
                <td className="song-title">{song.title}</td>
                <td className="song-duration">{this.formatTime(song.duration)}</td>
              </tr>
            )}
          </tbody>
        </table>
        <PlayerBar 
          isPlaying={this.state.isPlaying} 
          currentSong={this.state.currentSong} 
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          volume={this.state.volume}
          formatTime={(t) => this.formatTime(t)}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
        />
      </div>
    );
  }
}

export default Album;