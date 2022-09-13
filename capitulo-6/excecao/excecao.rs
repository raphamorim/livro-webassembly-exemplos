// rustc excecao.rs --target wasm32-unknown-unknown --crate-type=cdylib 

extern {
    #[link_name = "lanca_excecao"]
    fn lanca_excecao_js();
}

#[no_mangle]
pub extern fn excecao() {
    unsafe {
        lanca_excecao_js();
    }
}
