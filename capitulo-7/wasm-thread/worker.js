let soma;

addEventListener('message', async (e) => {
  if (e.data.operacao === 'INICIALIZAR') {
    result = await WebAssembly.instantiateStreaming(
      fetch('./target/wasm32-unknown-unknown/release/wasm_thread.wasm'),
      e.data.imports
    );
    soma = result.instance.exports.soma;
  }

  if (e.data.operacao === 'EXECUTAR') {
    console.log(soma(e.data.valor));
  }

  postMessage(e.data);
}, false);