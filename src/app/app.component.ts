import { Component } from '@angular/core';
// import { environment } from 'src/environments/environment';
import { MusicService } from './services/music.service';
import { Music } from './models/music.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-api-rest';

  musicas$ = new Observable<Music[]>();

  // form
  id = '';
  musica = '';
  author = '';

  constructor(private musicService: MusicService) {
    this.obterMusicasCadastradas();
  }

  obterMusicasCadastradas() {
    this.musicas$ = this.musicService.obterMusicas();
  }

  buttonClick() {
    if (!this.musica || !this.author)
      return;

    if (this.id) {
      this.atualizar()
      return;
    }

    this.musicService.cadastrarMusica({ author: this.author, text: this.musica })
      .subscribe(() => this.obterMusicasCadastradas())
  }

  atualizar() {
    this.musicService.editarMusica({ 
      id: parseInt(this.id), 
      author: this.author, 
      text: this.musica
    })
      .subscribe(() => this.obterMusicasCadastradas())
  }

  preencherCampos(musica: Music) {
    this.id = musica.id!.toString();
    this.musica = musica.text;
    this.author = musica.author;
  }

  remover(id: number) {
    this.musicService.remover(id)
      .subscribe(() => this.obterMusicasCadastradas());
  }
}
