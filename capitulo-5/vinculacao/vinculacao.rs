// rustc vinculacao.rs --target wasm32-unknown-unknown --crate-type=cdylib -L ./

extern "C" {
    #[link_name = "console_log"]
    fn log(x: i32) -> i32;

    #[link_name = "alert"]
    fn alert(x: i32) -> i32;
}

#[link(name = "numeros", kind = "static")]
extern "C" {
    fn retorna_dez() -> i32;

    fn quadrado(x: i32) -> i32;
}

#[no_mangle]
pub fn executar() {
    unsafe {
        let dez = retorna_dez();

        log(20); // 20
        log(87654321); // 87654321
        
        log(dez); // 10
        log(quadrado(dez)); // 100

        alert(85); // 85 com window.alert
    }
}
