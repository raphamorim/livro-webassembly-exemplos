// rustc vinculacao.rs --target wasm32-unknown-unknown --crate-type=cdylib 

pub mod numeros;

extern "C" {
    #[link_name = "console_log"]
    fn log(x: u32) -> u32;

    #[link_name = "alert"]
    fn alert(x: u8) -> u8;
}

#[no_mangle]
pub fn executar() {
    unsafe {
        let vinte: u32 = *numeros::retorna_vinte();

        log(vinte); // 20
        log(numeros::NUMERO); // 87654321

        alert(85); // 85 com window.alert
    }
}
