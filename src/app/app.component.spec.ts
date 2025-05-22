import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MusicService } from './services/music.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let musicServiceSpy: jasmine.SpyObj<MusicService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MusicService', [
      'obterMusicas', 'cadastrarMusica', 'editarMusica', 'remover'
    ]);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule],
      providers: [{ provide: MusicService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    musicServiceSpy = TestBed.inject(MusicService) as jasmine.SpyObj<MusicService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar obterMusicasCadastradas ao iniciar', () => {
    const mockMusics = [{ id: 1, author: 'Autor', text: 'Texto' }];
    musicServiceSpy.obterMusicas.and.returnValue(of(mockMusics));

    component.obterMusicasCadastradas();

    expect(musicServiceSpy.obterMusicas).toHaveBeenCalled();
  });

  it('deve cadastrar uma música nova', () => {
    component.author = 'Autor Teste';
    component.musica = 'Texto Teste';
    component.id = '';

    musicServiceSpy.cadastrarMusica.and.returnValue(of({ id: 1, author: 'Autor Teste', text: 'Texto Teste' }));
    musicServiceSpy.obterMusicas.and.returnValue(of([]));

    component.buttonClick();

    expect(musicServiceSpy.cadastrarMusica).toHaveBeenCalledWith({
      author: 'Autor Teste',
      text: 'Texto Teste'
    });
  });

  it('deve atualizar uma música existente', () => {
    component.id = '1';
    component.author = 'Novo Autor';
    component.musica = 'Nova Música';

    const musicaAtualizada = { id: 1, author: 'Novo Autor', text: 'Nova Música' };

    musicServiceSpy.editarMusica.and.returnValue(of(musicaAtualizada));
    musicServiceSpy.obterMusicas.and.returnValue(of([]));

    component.buttonClick();

    expect(musicServiceSpy.editarMusica).toHaveBeenCalledWith(musicaAtualizada);
  });

  it('deve remover uma música', () => {
    musicServiceSpy.remover.and.returnValue(of(void 0));
    musicServiceSpy.obterMusicas.and.returnValue(of([]));

    component.remover(1);

    expect(musicServiceSpy.remover).toHaveBeenCalledWith(1);
  });
});