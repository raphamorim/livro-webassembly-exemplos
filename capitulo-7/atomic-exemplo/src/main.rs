use std::sync::Arc;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::thread;

fn main() {
    let mut atomico = AtomicUsize::new(5);
    assert_eq!(*atomico.get_mut(), 5);
    *atomico.get_mut() = 8;
    assert_eq!(atomico.load(Ordering::SeqCst), 8);

    // Compartilha atômico mutável
    let valor = Arc::new(atomico);

    // Irá printar valores começando de 8 em diferentes threads
    // A ordem dos valores muda a cada execução
    // A quantidade de threads muda a execução já que o 
    // processo primário não espera pela threads
    for _ in 0..10 {
        let val = Arc::clone(&valor);

        thread::spawn(move || {
            // Incrementa o valor atual em val e 
            // retorna o valor anterior.
            let v = val.fetch_add(1, Ordering::SeqCst);
            println!("{v:?}");
        });
    }
}