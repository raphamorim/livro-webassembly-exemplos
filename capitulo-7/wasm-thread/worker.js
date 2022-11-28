let soma;

addEventListener('message', async (e) => {
  if (e.data.action === 'INICIALIZAR') {
    result = await WebAssembly.instantiateStreaming(
      fetch('./target/wasm32-unknown-unknown/release/wasm_thread.wasm'),
      e.data.imports
    );
    soma = result.instance.exports.soma;
  }

  if (e.data.action === 'EXECUTAR') {
    console.log(soma(e.data.valor));
  }

  postMessage(e.data);
}, false);