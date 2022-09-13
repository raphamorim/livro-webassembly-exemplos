// rustc runtime.rs --target wasm32-unknown-unknown --crate-type=cdylib 

#[no_mangle]
pub fn funcao_com_erro_em_execucao(numero: u8) -> u8 {
    numero + 255
}
