const memory = new WebAssembly.Memory({
  initial: 320, // 20 MiB
  maximum: 3200, // 200 MiB
  shared: true
});

const workersLista = [];
const imports = { env: { memory } };

// A propriedade somente leitura navigator.hardwareConcurrency retorna o número de processadores 
// lógicos disponíveis para executar threads no computador do usuário.
const processadores = window.navigator.hardwareConcurrency;

console.log(`processadores: ${processadores}`);

for (let i = 0; i < processadores; i++) {
  let worker = new Worker('./worker.js');

  worker.addEventListener('message', e => {
    if (e.data.action === 'INICIALIZAR') {
      workersLista.push(worker);
    }
  }, false);

  worker.postMessage({ action: 'INICIALIZAR', imports });   
}

const funcaoComIntervalo = setInterval(executarWorkers, 100);

function executarWorkers() {
  if (workersLista.length == processadores) {
    clearInterval(funcaoComIntervalo);

    for (let i = 0; i < processadores; i++) {
      const valor = i + 1;
      console.log('valor para somar:', valor);

      workersLista[i].postMessage({
        action: 'EXECUTAR',
        valor 
      });
    }
  }
}
