WebAssembly.instantiateStreaming(fetch('livro.wasm'))
.then(({ instance }) => {
  const {
    criar_texto_na_memoria,
    memory
  } = instance.exports;

  // Insere os bytes nas posições do tamanho do texto
  criar_texto_na_memoria();

  // Aqui lemos os primeiros 700 blocos da memória
  const memoria = new Uint8Array(memory.buffer, 0, 700);
  console.log(memoria);

  const conteudo = document.querySelector('#conteudo');
  const decoder = new TextDecoder();
  const texto = decoder.decode(memoria);
  conteudo.textContent = texto;
});