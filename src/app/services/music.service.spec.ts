import { TestBed } from '@angular/core/testing';
import { MusicService } from './music.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Music, MusicCadastrar } from '../models/music.model';
import { environment } from 'src/environments/environment';

describe('MusicService', () => {
  let service: MusicService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.api}/musics`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MusicService]
    });

    service = TestBed.inject(MusicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve obter músicas', () => {
    const dummyMusics: Music[] = [
      { id: 1, author: 'Autor 1', text: 'Música 1' },
      { id: 2, author: 'Autor 2', text: 'Música 2' }
    ];

    service.obterMusicas().subscribe(musics => {
      expect(musics.length).toBe(2);
      expect(musics).toEqual(dummyMusics);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMusics);
  });

  it('deve cadastrar uma música', () => {
    const novaMusica: MusicCadastrar = { author: 'Novo Autor', text: 'Nova Música' };
    const musicaCriada: Music = { id: 3, author: 'Novo Autor', text: 'Nova Música' };

    service.cadastrarMusica(novaMusica).subscribe(musica => {
      expect(musica).toEqual(musicaCriada);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novaMusica);
    req.flush(musicaCriada);
  });

  it('deve editar uma música', () => {
    const musicaEditada: Music = { id: 1, author: 'Autor Editado', text: 'Texto Editado' };

    service.editarMusica(musicaEditada).subscribe(musica => {
      expect(musica).toEqual(musicaEditada);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(musicaEditada);
    req.flush(musicaEditada);
  });

  it('deve remover uma música', () => {
  const musicaId = 1;

    service.remover(musicaId).subscribe(response => {
        expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/${musicaId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });
});