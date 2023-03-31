const input = document.querySelector('input');
const botaoResetarFiltro = document.querySelector('#remover');
const botaoPBFiltroJs = document.querySelector('#preto-e-branco-js');
const botaoPBFiltroWasm = document.querySelector('#preto-e-branco-wasm');

// Salva o atributo 'src' da imagem original
let imagemOriginal = document.getElementById('imagem').src;

// const arquivo = './target/wasm32-unknown-unknown/release/editor.wasm';
const arquivo = 'editor-binaryen.wasm';
const memoria = new WebAssembly.Memory({
  initial: 10,
  maximum: 100,
});
WebAssembly.instantiateStreaming(fetch(arquivo), { js: { mem: memoria } })
  .then(wasm => {
    const { instance } = wasm;
    const { 
      subtracao,
      criar_memoria_inicial,
      memory,
      malloc, 
      acumular,
      filtro_preto_e_branco
    } = instance.exports;

    botaoPBFiltroWasm.addEventListener('click', (event) => {
        // Seleciona a imagem
        const imagem = document.getElementById('imagem');

        // Converte a imagem para canvas
        const { canvas, contexto } = converteImagemParaCanvas(imagem);

        // Dados da imagem (objeto com tipo ImageData)
        const dadosDaImagem = contexto.getImageData(0, 0, canvas.width, canvas.height);

        // Porém dessa vez usamos "buffer" em vez de "data" para
        // poder montar a matriz tipada da imagem
        const buffer = dadosDaImagem.data.buffer;

        // Matriz tipada de u8 (0 a 255)
        const u8Array = new Uint8Array(buffer);

        // Realiza o malloc matriz tipada
        const ponteiro = malloc(u8Array.length);

        // Cria matriz tipada a partir da visualização da memória da
        // instancia, ponteiro e comprimento (u8Array.length)
        let wasmArray = new Uint8ClampedArray(
            instance.exports.memory.buffer,
            ponteiro, 
            u8Array.length
        );

        // O valor de wasmArray se torna o mesmo da nossa imagem
        wasmArray.set(u8Array);

        // Salva o tempo do início da operação
        const inicio = performance.now();

        // Aplica filtro na imagem que está salva na memória
        filtro_preto_e_branco(ponteiro, u8Array.length);

        // Salva o tempo do final da operação
        const final = performance.now();

        // Computa tempo da operação
        tempoDaOperacao(inicio, final, 'WebAssembly Preto e Branco');

        // Pega altura e largura da imagem
        const width = imagem.naturalWidth || imagem.width;
        const height = imagem.naturalHeight || imagem.height;

        // Cria dados da imagem (ImageData) usando largura e altura
        const novoDadosDaImagem = contexto.createImageData(width, height);
        
        // Preenche os dados com a matriz tipada
        novoDadosDaImagem.data.set(wasmArray);

        // Atualiza o canvas com a nova image
        contexto.putImageData(novoDadosDaImagem, 0, 0);

        // Atualiza o atributo src como o base64 do canvas
        imagem.src = canvas.toDataURL('image/jpeg');
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
}

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
}

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
}
