// rustc vinculacao.rs --target wasm32-unknown-unknown --crate-type=cdylib 

// pub mod numeros;

extern "C" {
    #[link_name = "console_log_u8"]
    fn log_u8(x: u8) -> u8;

    #[link_name = "console_log_u32"]
    fn log_u32(x: u32) -> u32;
}

#[no_mangle]
pub fn executar() {
    unsafe {
        let vinte: u8 = *numeros::retorna_vinte();

        log_u8(vinte); // 20
        log_u32(numeros::NUMERO); // 87654321
    }
}
