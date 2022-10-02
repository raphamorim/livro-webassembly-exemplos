// rustc link.rs --target wasm32-unknown-unknown --crate-type=cdylib 

// Se preferir otimizado: rustc link.rs -C lto -O --target wasm32-unknown-unknown --crate-type=cdylib 
// Você também pode especificar como: extern "C"
extern {
    #[link_name = "console_log"]
    fn log(x: f32) -> f32;

    #[link_name = "erro"]
    fn erro(x: u8) -> u8;
}

fn funcao_que_falha() -> Result<(), &'static str> {
    Err("Falhou")
}

#[no_mangle]
pub extern fn executa_funcao_que_falha() {
    match funcao_que_falha() {
        Ok(_) => {},
        Err(..) => {
            unsafe {
                erro(1);
            }
        },
    }
}

#[no_mangle]
pub extern fn soma_ate_n(n: f32) -> f32 {
    unsafe {
        log(n);
    }
    (n * (n + 1.)) / 2.
}
