const input = document.querySelector('input');
const botaoResetarFiltro = document.querySelector('#remover');
const botaoPBFiltroJs = document.querySelector('#preto-e-branco-js');
const botaoSepiaJs = document.querySelector('#sepia-js');

// Salva o atributo 'src' da imagem original
let imagemOriginal = document.getElementById('imagem').src;

// Se não tiver compilado o arquivo: use 'editor.wasm'
const arquivo = './target/wasm32-unknown-unknown/release/editor.wasm';
// const arquivo = 'editor.wasm';

function executarFiltro(image, processImageFn) {
  const { canvas } = converteImagemParaCanvas(image);
  if (!processImageFn) {
    return canvas.toDataURL();
  }

  if (typeof processImageFn === 'function') {
    processImageFn(canvas, canvas.getContext('2d'));
    return canvas.toDataURL('image/jpeg');
  }
};

function adicionarFiltro(text, selector, { instance, filtro }) {
  const button = document.querySelector(selector);
  const imagem = document.getElementById('imagem');
  button.addEventListener('click', () => {
    executarFiltro(imagem, (canvas, context) => {
      const image = document.getElementById("imagem");
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const buffer = imageData.data.buffer;
      const u8Array = new Uint8Array(buffer);
      let wasmClampedPtr = instance.exports.malloc(u8Array.length);
      let wasmClampedArray = new Uint8ClampedArray(instance.exports.memory.buffer, wasmClampedPtr, u8Array.length);
      wasmClampedArray.set(u8Array);
      const startTime = performance.now();
      filtro(wasmClampedPtr, u8Array.length);
      const endTime = performance.now();
      tempoDaOperacao(startTime, endTime, text);
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      const newImageData = context.createImageData(width, height);
      newImageData.data.set(wasmClampedArray);
      context.putImageData(newImageData, 0, 0);
      image.src = canvas.toDataURL('image/jpeg');
    });
  });
};

WebAssembly.instantiateStreaming(fetch(arquivo))
  .then(({instance}) => {
    const {
      ponteiro_usando_box,
      ponteiro,
      sem_ponteiro,
      subtracao,
      criar_memoria_inicial,
      memory,
      malloc, 
      acumular,
      filtro_preto_e_branco,
      filtro_vermelho,
      filtro_verde,
      filtro_azul,
      filtro_super_azul,
      filtro_opacidade,
      filtro_sepia,
      filtro_inversao
    } = instance.exports;

    // ----
    // Ponteiro com Box
    const ptrBox = ponteiro_usando_box();
    const ptrBoxValor = new Uint8Array(instance.exports.memory.buffer, ptrBox, 4);
    // ptrBoxValor Uint8Array(4) [ 8, 5, 8, 5 ]
    console.log('ptrBoxValor', ptrBoxValor);

    // ----
    // Ponteiro sem Box
    const ptr = ponteiro();
    const ptrValor = new Uint8Array(instance.exports.memory.buffer, ptr, 4);
    // ptrValor Uint8Array(4) [ 8, 5, 8, 5 ]
    console.log('ptrValor', ptrValor);

    // -----
    // Função sem declaração de "extern"
    // e retorno do valor de forma direta.
    const semPonteiro = sem_ponteiro();
    console.log(semPonteiro); // 84411656

    adicionarFiltro('Preto e Branco WASM', '#preto-e-branco-wasm', {
      instance, filtro: filtro_preto_e_branco
    });
    adicionarFiltro('Vermelho WASM', '#vermelho-wasm', {
      instance, filtro: filtro_vermelho
    });
    adicionarFiltro('Azul WASM', '#azul-wasm', {
      instance, filtro: filtro_azul
    });
    adicionarFiltro('Verde WASM', '#verde-wasm', {
      instance, filtro: filtro_verde
    });
    adicionarFiltro('Super Azul WASM', '#super-azul-wasm', {
      instance, filtro: filtro_super_azul
    });
    adicionarFiltro('Opacidade WASM', '#opacidade-wasm', {
      instance, filtro: filtro_opacidade
    });
    adicionarFiltro('Sépia WASM', '#sepia-wasm', {
      instance, filtro: filtro_sepia
    });
    adicionarFiltro('Inversão WASM', '#inversao-wasm', {
      instance, filtro: filtro_inversao
    });
    
    criar_memoria_inicial();
    const arrayMemoria = new Uint8Array(memory.buffer, 0).slice(0, 10);
    console.log(arrayMemoria); // 85
    console.log(subtracao(28, 10)); // 18

    const jsLista = Uint8Array.from([20, 50, 80]);
    const comprimento = jsLista.length;
    const wasmListaPonteiro = malloc(comprimento);
    const wasmLista = new Uint8Array(memory.buffer, wasmListaPonteiro, comprimento);
    wasmLista.set(jsLista);
    const somaEntreItensDaLista = acumular(wasmListaPonteiro, comprimento); // -> Retona 150
    console.log(somaEntreItensDaLista);
  });

// Toda vez que for mudado o valor de input executará a função abaixo
input.addEventListener('change', (event) => {
  const arquivo = event.target.files[0];
  const reader = new FileReader();

  // Seleciona o elemento imagem e atualiza o título baseado no arquivo
  const imagem = document.getElementById('imagem');
  imagem.title = arquivo.name;

  reader.onload = (event) => {
    // Quando o processo for finalizado salva o resultado no 
    // atributo src da imagem. Também atualiza a variável imagemOriginal
    imagem.src = event.target.result;
    imagemOriginal = event.target.result;
  };

  reader.readAsDataURL(arquivo);
});

botaoResetarFiltro.addEventListener('click', (event) => {
  const imagem = document.getElementById('imagem');
  imagem.src = imagemOriginal;
  console.log('Imagem voltou ao original');
});

function converteImagemParaCanvas(imagem) {
  // Cria a referência do canvas
  const canvas = document.createElement('canvas');

  // Seleciona o context 2d do canvas
  const contexto = canvas.getContext('2d');

  // Coloca a largura e altura do canvas similar a imagem
  canvas.width = imagem.naturalWidth || imagem.width;
  canvas.height = imagem.naturalHeight || imagem.height;

  // Desenha a imagem no contexto 2d
  contexto.drawImage(imagem, 0, 0);

  // Retorna tanto o canvas como seu contexto
  return { canvas, contexto };
};

function filtroSepia(canvas, contexto) {
  const dadosDaImagem = contexto.getImageData(
    0, 0, canvas.width, canvas.height);
  const pixels  = dadosDaImagem.data;
  const inicio = performance.now();
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];

    pixels[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
    pixels[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
    pixels[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
  }
  const fim = performance.now();
  tempoDaOperacao(inicio, fim, 'JavaScript Sepia');
  contexto.putImageData(dadosDaImagem, 0, 0);
  return canvas.toDataURL('image/jpeg');
};

botaoSepiaJs.addEventListener('click', (event) => {
  const imagem = document.getElementById('imagem');
  const { canvas, contexto } = converteImagemParaCanvas(imagem);
  const base64 = filtroSepia(canvas, contexto);
  imagem.src = base64;
});

function filtroPretoBrancoJS(canvas, contexto) {
  // Pega os dados da imagem
  const dadosDaImagem = contexto.getImageData(0, 0, canvas.width, canvas.height);

  // Pega os pixels da imagem
  const pixels = dadosDaImagem.data;

  // Salva o tempo do inicio
  const inicio = performance.now();

  // Performa a mudança em cada pixel da imagem de 
  // acordo com a formula vista acima
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    const filtro = pixels[i] / 3 + pixels[i+1] / 3 + pixels[i+2] / 3;
    pixels[i] = filtro;
    pixels[i+1] = filtro;
    pixels[i+2] = filtro;
  }

  // Salva o tempo do fim
  const fim = performance.now();

  // Reporta o tempo que levou
  tempoDaOperacao(inicio, fim, 'JavaScript Preto e Branco');

  // Atualiza o canvas com os novos dados
  contexto.putImageData(dadosDaImagem, 0, 0);

  // Retorna um base64 do canvas
  return canvas.toDataURL('image/jpeg');
};

botaoPBFiltroJs.addEventListener('click', (event) => {
  // Seleciona a imagem
  const imagem = document.getElementById('imagem');
  
  // Converte a imagem para canvas
  const { canvas, contexto } = converteImagemParaCanvas(imagem);

  // Recebe o base64
  const base64 = filtroPretoBrancoJS(canvas, contexto);

  // Coloca o novo base64 na imagem
  imagem.src = base64;  
});

function tempoDaOperacao(inicio, fim, nomeDaOperacao) {
  // Seleciona o elemento #performance
  const performance = document.querySelector('#performance');
  // Muda o texto de #performance para o tempo da execução
  performance.textContent = `${nomeDaOperacao}: ${fim - inicio} ms.`;
};
